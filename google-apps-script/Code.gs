const SHEET_NAMES = {
  leads: "leads",
  config: "config",
  logs: "logs"
};

const LEADS_HEADERS = [
  "created_at",
  "last_updated_at",
  "lead_id",
  "full_name_original",
  "birth_date",
  "phone_or_zalo",
  "email",
  "gender",
  "note",
  "consent_to_contact",
  "entry_mode",
  "source",
  "device_type",
  "normalized_name",
  "life_path",
  "destiny",
  "soul",
  "birthday",
  "personality",
  "karmic_debts",
  "master_numbers",
  "selected_package",
  "status",
  "duplicate_warning",
  "local_backup_id"
];

const CONFIG_HEADERS = ["key", "value", "description", "updated_at"];

const LOG_HEADERS = [
  "timestamp",
  "lead_id",
  "event_type",
  "status_after_event",
  "selected_package",
  "phone_or_zalo_present",
  "consent_to_contact",
  "source",
  "entry_mode",
  "device_type",
  "message",
  "raw_payload_summary"
];

function doPost(e) {
  try {
    setupSheets();

    const payload = parsePayload_(e);
    if (!validateSecret_(payload)) {
      appendLog_(payload, "Invalid shared secret");
      return jsonResponse_({
        ok: false,
        message: "Invalid shared secret"
      });
    }

    validatePayload_(payload);

    const duplicateWarning = detectDuplicate_(payload.lead);
    appendLead_(payload, duplicateWarning);
    appendLog_(payload, "Lead saved");

    return jsonResponse_({
      ok: true,
      message: "Lead saved",
      lead_id: payload.lead.lead_id,
      duplicate_warning: duplicateWarning
    });
  } catch (error) {
    try {
      appendLog_({ event_type: "sync_failed", lead: {} }, error.message);
    } catch (logError) {
      console.error(logError);
    }

    return jsonResponse_({
      ok: false,
      message: error.message
    });
  }
}

function setupSheets() {
  ensureHeader_(getSheet_(SHEET_NAMES.leads), LEADS_HEADERS);
  ensureHeader_(getSheet_(SHEET_NAMES.config), CONFIG_HEADERS);
  ensureHeader_(getSheet_(SHEET_NAMES.logs), LOG_HEADERS);
  seedConfig_();
}

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function appendLead_(payload, duplicateWarning) {
  const lead = payload.lead || {};
  const sheet = getSheet_(SHEET_NAMES.leads);
  const row = [
    lead.created_at || "",
    lead.last_updated_at || "",
    lead.lead_id || "",
    lead.full_name_original || "",
    lead.birth_date || "",
    lead.phone_or_zalo || "",
    lead.email || "",
    lead.gender || "",
    lead.note || "",
    Boolean(lead.consent_to_contact),
    lead.entry_mode || "",
    lead.source || "",
    lead.device_type || "",
    lead.normalized_name || "",
    lead.life_path || "",
    lead.destiny || "",
    lead.soul || "",
    lead.birthday || "",
    lead.personality || "",
    lead.karmic_debts || "",
    lead.master_numbers || "",
    lead.selected_package || "",
    lead.status || "",
    duplicateWarning || "",
    lead.local_backup_id || ""
  ];

  sheet.appendRow(row);
}

function appendLog_(payload, message) {
  const lead = (payload && payload.lead) || {};
  const sheet = getSheet_(SHEET_NAMES.logs);
  const summary = {
    lead_id: lead.lead_id || "",
    full_name_original: lead.full_name_original || "",
    birth_date: lead.birth_date || "",
    status: lead.status || "",
    selected_package: lead.selected_package || "",
    meta: (payload && payload.meta) || {}
  };
  const row = [
    new Date().toISOString(),
    lead.lead_id || "",
    (payload && payload.event_type) || "",
    lead.status || "",
    lead.selected_package || "",
    Boolean(lead.phone_or_zalo),
    Boolean(lead.consent_to_contact),
    lead.source || "",
    lead.entry_mode || "",
    lead.device_type || "",
    message || "",
    JSON.stringify(summary)
  ];

  sheet.appendRow(row);
}

function detectDuplicate_(lead) {
  if (!lead) {
    return "";
  }

  const sheet = getSheet_(SHEET_NAMES.leads);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return "";
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, LEADS_HEADERS.length).getValues();
  const phone = normalizeText_(lead.phone_or_zalo);
  const name = normalizeText_(lead.full_name_original);
  const birthDate = normalizeText_(lead.birth_date);
  let samePhone = false;
  let sameNameBirthdate = false;

  rows.forEach(function (row) {
    const existingPhone = normalizeText_(row[5]);
    const existingName = normalizeText_(row[3]);
    const existingBirthDate = normalizeText_(row[4]);

    if (phone && phone === existingPhone) {
      samePhone = true;
    }

    if (name && birthDate && name === existingName && birthDate === existingBirthDate) {
      sameNameBirthdate = true;
    }
  });

  if (samePhone && sameNameBirthdate) {
    return "same_phone_and_name_birthdate_possible_duplicate";
  }

  if (samePhone) {
    return "same_phone_possible_duplicate";
  }

  if (sameNameBirthdate) {
    return "same_name_birthdate_possible_duplicate";
  }

  return "";
}

function validateSecret_(payload) {
  const expected = PropertiesService.getScriptProperties().getProperty("GOOGLE_SCRIPT_SHARED_SECRET");
  return Boolean(expected) && payload && payload.shared_secret === expected;
}

function setSecretOnce() {
  PropertiesService.getScriptProperties().setProperty(
    "GOOGLE_SCRIPT_SHARED_SECRET",
    "CHANGE_ME_PHASE2_SECRET"
  );
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Missing POST body");
  }

  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  if (!payload || !payload.lead) {
    throw new Error("Missing lead payload");
  }

  if (!payload.event_type) {
    throw new Error("Missing event_type");
  }

  if (!payload.lead.lead_id) {
    throw new Error("Missing lead_id");
  }

  if (!payload.lead.full_name_original) {
    throw new Error("Missing full_name_original");
  }

  if (!payload.lead.birth_date) {
    throw new Error("Missing birth_date");
  }
}

function ensureHeader_(sheet, headers) {
  const range = sheet.getRange(1, 1, 1, headers.length);
  const currentHeaders = range.getValues()[0];
  const hasAnyHeader = currentHeaders.some(function (value) {
    return String(value || "").trim() !== "";
  });

  if (!hasAnyHeader) {
    range.setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function seedConfig_() {
  const sheet = getSheet_(SHEET_NAMES.config);
  if (sheet.getLastRow() > 1) {
    return;
  }

  const now = new Date().toISOString();
  sheet.getRange(2, 1, 7, CONFIG_HEADERS.length).setValues([
    ["brand_name", "BRIAN-NUMEROLOGIST", "Tên thương hiệu hiển thị", now],
    ["consultant_name", "BRIAN", "Tên người tư vấn", now],
    ["zalo_phone", "0948909983", "Số Zalo/điện thoại", now],
    ["discount", "20%", "Ưu đãi nâng cấp", now],
    ["discount_validity", "3 ngày", "Thời hạn ưu đãi", now],
    ["google_sheet_version", "phase2_v1", "Phiên bản cấu trúc Sheet", now],
    ["shared_secret_enabled", "true", "Có dùng shared secret cơ bản", now]
  ]);
}

function normalizeText_(value) {
  return String(value || "").trim().toLowerCase();
}
