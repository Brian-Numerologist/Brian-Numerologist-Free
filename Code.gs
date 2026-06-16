const PHASE_VERSION = "PHASE4_LEAD_CRM_v1";

const SHEET_NAMES = {
  leads: "leads",
  logs: "logs",
  dashboard: "dashboard",
  followups: "followups",
  message_templates: "message_templates",
  config: "config"
};

const LEADS_HEADERS = [
  "lead_id",
  "created_at",
  "updated_at",
  "full_name",
  "normalized_name",
  "birth_date",
  "life_path",
  "destiny",
  "soul",
  "birthday",
  "personality",
  "master_number",
  "karmic_debt",
  "report_summary",
  "lead_status",
  "lead_status_label",
  "lead_temperature",
  "selected_package",
  "selected_package_price",
  "selected_addon",
  "selected_addon_price",
  "recommended_package",
  "recommendation_reason",
  "zalo_phone",
  "email",
  "consent",
  "last_action",
  "last_action_at",
  "pdf_downloaded_at",
  "package_clicked_at",
  "zalo_submitted_at",
  "follow_up_status",
  "follow_up_due_date",
  "follow_up_note",
  "contacted_at",
  "consulted_at",
  "converted_at",
  "conversion_value",
  "consultant_note",
  "source_url",
  "user_agent",
  "session_id",
  "event_count",
  "raw_payload"
];

const LOG_HEADERS = [
  "timestamp",
  "event_id",
  "lead_id",
  "session_id",
  "event_type",
  "full_name",
  "birth_date",
  "selected_package",
  "selected_package_price",
  "selected_addon",
  "selected_addon_price",
  "lead_status",
  "lead_temperature",
  "payload_json",
  "source_url",
  "user_agent"
];

const DASHBOARD_HEADERS = ["metric", "value", "description", "updated_at"];
const FOLLOWUP_HEADERS = [
  "follow_up_id",
  "lead_id",
  "full_name",
  "zalo_phone",
  "lead_status_label",
  "lead_temperature",
  "selected_package",
  "recommended_package",
  "follow_up_status",
  "follow_up_due_date",
  "follow_up_note",
  "message_template_key",
  "last_contacted_at",
  "next_action",
  "owner",
  "updated_at"
];
const TEMPLATE_HEADERS = [
  "template_key",
  "template_name",
  "lead_status",
  "message_text",
  "variables",
  "is_active",
  "updated_at"
];
const CONFIG_HEADERS = ["key", "value", "description", "updated_at"];

const MESSAGE_TEMPLATES = [
  [
    "report_generated_intro",
    "Khách vừa tạo bản FREE",
    "new_report_generated",
    "Chào {{full_name}}, Brian đã thấy bạn vừa tạo bản FREE. Bản này mở 4 trụ cột đầu tiên: Đường Đời {{life_path}}, Sứ Mệnh {{destiny}}, Linh Hồn {{soul}}. Nếu bạn muốn Brian đọc sâu hơn theo bối cảnh hiện tại, mình có thể gợi ý hướng phù hợp.",
    "{{full_name}}, {{life_path}}, {{destiny}}, {{soul}}, {{zalo_brian}}",
    true
  ],
  [
    "pdf_downloaded_followup",
    "Khách đã tải PDF",
    "pdf_downloaded",
    "Chào {{full_name}}, bạn đã lưu bản PDF FREE. Nếu phần nào trong báo cáo khiến bạn thấy đúng với mình, Brian có thể giúp đọc sâu hơn để biến thông tin thành hướng hành động rõ ràng.",
    "{{full_name}}, {{recommended_package}}, {{zalo_brian}}",
    true
  ],
  [
    "package_clicked_hot",
    "Khách bấm chọn gói",
    "package_clicked",
    "Chào {{full_name}}, Brian thấy bạn quan tâm gói {{selected_package}}. Với bản đồ hiện tại, gợi ý nhẹ là {{recommended_package}}. Nếu tiện, mình có thể tư vấn nhanh để bạn chọn đúng mức cần thiết.",
    "{{full_name}}, {{selected_package}}, {{recommended_package}}, {{zalo_brian}}",
    true
  ],
  [
    "discount_reminder",
    "Nhắc ưu đãi 20%",
    "pdf_downloaded",
    "Chào {{full_name}}, nhắc nhẹ bạn đang có ưu đãi {{discount_percent}}% trong {{discount_days}} ngày sau bản FREE. Ưu đãi chỉ là hỗ trợ quyết định, quan trọng nhất vẫn là chọn đúng gói phù hợp với nhu cầu hiện tại.",
    "{{full_name}}, {{discount_percent}}, {{discount_days}}, {{zalo_brian}}",
    true
  ],
  [
    "consultation_booking",
    "Đặt lịch tư vấn",
    "zalo_submitted",
    "Chào {{full_name}}, nếu bạn muốn đặt lịch tư vấn, hãy gửi Brian 2-3 khung giờ thuận tiện. Brian sẽ xác nhận lịch và chuẩn bị phần đọc trọng tâm cho bản đồ của bạn.",
    "{{full_name}}, {{zalo_brian}}",
    true
  ]
];

function doPost(e) {
  try {
    setupPhase4Sheets();
    const payload = parsePayload_(e);
    if (!validateSecret_(payload)) {
      logLeadEvent({
        event_type: "error",
        event_id: payload && payload.event_id,
        lead: payload && payload.lead,
        message: "Invalid shared secret"
      });
      return jsonResponse_({ ok: false, message: "Invalid shared secret" });
    }

    validatePayload_(payload);
    upsertLead(payload);
    logLeadEvent(payload);
    refreshDashboard_();

    return jsonResponse_({
      ok: true,
      phase_version: PHASE_VERSION,
      message: "Lead CRM event saved",
      lead_id: payload.lead.lead_id,
      event_type: payload.event_type
    });
  } catch (error) {
    try {
      logLeadEvent({ event_type: "error", message: error.message, lead: {} });
    } catch (logError) {
      console.error(logError);
    }
    return jsonResponse_({ ok: false, message: error.message });
  }
}

function doGet(e) {
  try {
    setupPhase4Sheets();
    const action = (e && e.parameter && e.parameter.action) || "health";
    const payload = { shared_secret: e && e.parameter && e.parameter.shared_secret };
    if (["admin_stats", "message_templates"].indexOf(action) >= 0 && !validateSecret_(payload)) {
      return jsonResponse_({ ok: false, message: "Invalid shared secret" });
    }

    if (action === "admin_stats") {
      return jsonResponse_(getAdminStats());
    }
    if (action === "message_templates") {
      return jsonResponse_({ ok: true, templates: getMessageTemplates() });
    }
    return jsonResponse_({ ok: true, phase_version: PHASE_VERSION });
  } catch (error) {
    return jsonResponse_({ ok: false, message: error.message });
  }
}

function setupSheets() {
  setupPhase4Sheets();
}

function setupPhase4Sheets() {
  ensurePhase4Headers();
  seedConfig_();
  seedMessageTemplates_();
  applyPhase4Formatting();
  refreshDashboard_();
}

function ensurePhase4Headers() {
  ensureHeader_(getSheet_(SHEET_NAMES.leads), LEADS_HEADERS);
  ensureHeader_(getSheet_(SHEET_NAMES.logs), LOG_HEADERS);
  ensureHeader_(getSheet_(SHEET_NAMES.dashboard), DASHBOARD_HEADERS);
  ensureHeader_(getSheet_(SHEET_NAMES.followups), FOLLOWUP_HEADERS);
  ensureHeader_(getSheet_(SHEET_NAMES.message_templates), TEMPLATE_HEADERS);
  ensureHeader_(getSheet_(SHEET_NAMES.config), CONFIG_HEADERS);
}

function upsertLead(payload) {
  const lead = normalizeLead_(payload);
  const sheet = getSheet_(SHEET_NAMES.leads);
  const rowObject = {
    lead_id: lead.lead_id,
    created_at: lead.created_at,
    updated_at: lead.updated_at,
    full_name: lead.full_name,
    normalized_name: lead.normalized_name,
    birth_date: lead.birth_date,
    life_path: lead.life_path,
    destiny: lead.destiny,
    soul: lead.soul,
    birthday: lead.birthday,
    personality: lead.personality,
    master_number: lead.master_number,
    karmic_debt: lead.karmic_debt,
    report_summary: lead.report_summary,
    lead_status: lead.lead_status,
    lead_status_label: computeLeadStatusLabel(lead.lead_status),
    lead_temperature: computeLeadTemperature(lead),
    selected_package: lead.selected_package,
    selected_package_price: lead.selected_package_price,
    selected_addon: lead.selected_addon,
    selected_addon_price: lead.selected_addon_price,
    recommended_package: lead.recommended_package,
    recommendation_reason: lead.recommendation_reason,
    zalo_phone: lead.zalo_phone,
    email: lead.email,
    consent: lead.consent,
    last_action: payload.event_type,
    last_action_at: lead.updated_at,
    pdf_downloaded_at: lead.pdf_downloaded_at,
    package_clicked_at: lead.package_clicked_at,
    zalo_submitted_at: lead.zalo_submitted_at,
    follow_up_status: lead.follow_up_status,
    follow_up_due_date: lead.follow_up_due_date,
    follow_up_note: lead.follow_up_note,
    contacted_at: lead.contacted_at,
    consulted_at: lead.consulted_at,
    converted_at: lead.converted_at,
    conversion_value: lead.conversion_value,
    consultant_note: lead.consultant_note,
    source_url: lead.source_url,
    user_agent: lead.user_agent,
    session_id: lead.session_id,
    event_count: lead.event_count,
    raw_payload: JSON.stringify(payload)
  };

  const existingRow = findLeadRow_(lead.lead_id);
  if (existingRow > 1) {
    const existing = rowToObject_(sheet, existingRow, LEADS_HEADERS);
    rowObject.created_at = existing.created_at || rowObject.created_at;
    rowObject.contacted_at = existing.contacted_at || rowObject.contacted_at;
    rowObject.consulted_at = existing.consulted_at || rowObject.consulted_at;
    rowObject.converted_at = existing.converted_at || rowObject.converted_at;
    rowObject.conversion_value = existing.conversion_value || rowObject.conversion_value;
    rowObject.consultant_note = existing.consultant_note || rowObject.consultant_note;
    sheet.getRange(existingRow, 1, 1, LEADS_HEADERS.length).setValues([objectToRow_(rowObject, LEADS_HEADERS)]);
  } else {
    sheet.appendRow(objectToRow_(rowObject, LEADS_HEADERS));
  }

  upsertFollowUp_(rowObject);
  return rowObject;
}

function logLeadEvent(payload) {
  const lead = normalizeLead_(payload);
  const sheet = getSheet_(SHEET_NAMES.logs);
  sheet.appendRow(objectToRow_({
    timestamp: new Date().toISOString(),
    event_id: payload.event_id || ("EVT_" + Date.now()),
    lead_id: lead.lead_id,
    session_id: lead.session_id,
    event_type: payload.event_type || "unknown",
    full_name: lead.full_name,
    birth_date: lead.birth_date,
    selected_package: lead.selected_package,
    selected_package_price: lead.selected_package_price,
    selected_addon: lead.selected_addon,
    selected_addon_price: lead.selected_addon_price,
    lead_status: lead.lead_status,
    lead_temperature: computeLeadTemperature(lead),
    payload_json: JSON.stringify(payload),
    source_url: lead.source_url,
    user_agent: lead.user_agent
  }, LOG_HEADERS));
}

function getAdminStats() {
  const leads = readObjects_(getSheet_(SHEET_NAMES.leads), LEADS_HEADERS);
  const logs = readObjects_(getSheet_(SHEET_NAMES.logs), LOG_HEADERS);
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const month = today.slice(0, 7);
  const totals = {
    total_leads: leads.length,
    leads_today: leads.filter(function (lead) { return String(lead.created_at || "").slice(0, 10) === today; }).length,
    leads_this_month: leads.filter(function (lead) { return String(lead.created_at || "").slice(0, 7) === month; }).length,
    pdf_downloaded: countByEvent_(logs, "pdf_downloaded"),
    package_clicked: countByEvent_(logs, "package_clicked"),
    addon_clicked: countByEvent_(logs, "addon_clicked"),
    zalo_submitted: countByEvent_(logs, "zalo_submitted"),
    very_hot_leads: leads.filter(function (lead) { return lead.lead_temperature === "very_hot"; }).length,
    converted: leads.filter(function (lead) { return lead.lead_status === "converted"; }).length,
    total_conversion_value: leads.reduce(function (sum, lead) { return sum + Number(lead.conversion_value || 0); }, 0)
  };
  const packageInterest = {};
  leads.forEach(function (lead) {
    if (lead.selected_package) {
      packageInterest[lead.selected_package] = (packageInterest[lead.selected_package] || 0) + 1;
    }
  });

  return {
    ok: true,
    source: "Google Sheet",
    phase_version: PHASE_VERSION,
    updated_at: new Date().toISOString(),
    totals: totals,
    funnel_rates: {
      report_to_pdf: rate_(totals.pdf_downloaded, totals.total_leads),
      pdf_to_package: rate_(totals.package_clicked, totals.pdf_downloaded),
      package_to_zalo: rate_(totals.zalo_submitted, totals.package_clicked),
      zalo_to_converted: rate_(totals.converted, totals.zalo_submitted)
    },
    followups: {
      urgent: leads.filter(function (lead) { return lead.follow_up_status === "urgent"; }).length,
      pending: leads.filter(function (lead) { return lead.follow_up_status === "pending"; }).length,
      retry: leads.filter(function (lead) { return lead.follow_up_status === "retry"; }).length
    },
    package_interest: Object.keys(packageInterest).map(function (name) {
      return { name: name, count: packageInterest[name] };
    })
  };
}

function getMessageTemplates() {
  const rows = readObjects_(getSheet_(SHEET_NAMES.message_templates), TEMPLATE_HEADERS);
  return rows
    .filter(function (row) { return String(row.is_active).toLowerCase() !== "false"; })
    .map(function (row) {
      return {
        template_key: row.template_key,
        template_name: row.template_name,
        lead_status: row.lead_status,
        message_text: row.message_text,
        variables: row.variables,
        is_active: row.is_active
      };
    });
}

function computeLeadStatusLabel(status) {
  const labels = {
    new_report_generated: "Mới tạo báo cáo",
    pdf_downloaded: "Đã tải PDF",
    package_clicked: "Đã bấm chọn gói",
    addon_clicked: "Đã bấm add-on",
    zalo_submitted: "Đã nhập Zalo",
    contacted: "Đã liên hệ",
    consulted: "Đã tư vấn",
    converted: "Đã chốt khách",
    not_ready: "Chưa sẵn sàng",
    no_response: "Chưa phản hồi",
    invalid_contact: "Liên hệ không hợp lệ"
  };
  return labels[status] || "Mới tạo báo cáo";
}

function computeLeadTemperature(lead) {
  if (lead.lead_status === "converted") return "converted";
  if (lead.zalo_phone && lead.consent && ["zalo_submitted", "package_clicked", "addon_clicked"].indexOf(lead.lead_status) >= 0) return "very_hot";
  if (["package_clicked", "addon_clicked", "contacted", "consulted"].indexOf(lead.lead_status) >= 0) return "hot";
  if (["not_ready", "invalid_contact"].indexOf(lead.lead_status) >= 0) return "cold";
  return "warm";
}

function computeFollowUpDueDate(status) {
  if (["package_clicked", "addon_clicked", "zalo_submitted"].indexOf(status) >= 0) return addDays_(0);
  if (status === "pdf_downloaded") return addDays_(1);
  if (status === "no_response") return addDays_(2);
  if (status === "not_ready") return addDays_(7);
  return "";
}

function computeFollowUpStatus_(status) {
  if (["package_clicked", "addon_clicked", "zalo_submitted"].indexOf(status) >= 0) return "urgent";
  if (status === "pdf_downloaded") return "pending";
  if (status === "no_response") return "retry";
  if (status === "not_ready") return "nurture";
  if (status === "converted") return "done";
  return "not_required_yet";
}

function applyPhase4Formatting() {
  Object.keys(SHEET_NAMES).forEach(function (key) {
    const sheet = getSheet_(SHEET_NAMES[key]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn()))
      .setBackground("#4d0909")
      .setFontColor("#fff7e6")
      .setFontWeight("bold");
    sheet.autoResizeColumns(1, Math.min(Math.max(1, sheet.getLastColumn()), 12));
  });
}

function setSecretOnce() {
  PropertiesService.getScriptProperties().setProperty(
    "GOOGLE_SCRIPT_SHARED_SECRET",
    "CHANGE_ME_PHASE2_SECRET"
  );
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error("Missing POST body");
  return JSON.parse(e.postData.contents);
}

function validateSecret_(payload) {
  const expected = PropertiesService.getScriptProperties().getProperty("GOOGLE_SCRIPT_SHARED_SECRET");
  return Boolean(expected) && payload && payload.shared_secret === expected;
}

function validatePayload_(payload) {
  if (!payload || !payload.lead) throw new Error("Missing lead payload");
  if (!payload.event_type) throw new Error("Missing event_type");
  if (!payload.lead.lead_id) throw new Error("Missing lead_id");
  if (!payload.lead.full_name_original && !payload.lead.full_name) throw new Error("Missing full_name");
  if (!payload.lead.birth_date) throw new Error("Missing birth_date");
}

function normalizeLead_(payload) {
  const raw = (payload && payload.lead) || {};
  const status = normalizeStatus_(raw.lead_status || raw.status || payload.event_type || "new_report_generated");
  const now = new Date().toISOString();
  const selectedPackage = raw.selected_package_name || raw.selected_package || "";
  const selectedAddon = raw.selected_addon_name || raw.selected_addon || "";
  return {
    lead_id: raw.lead_id || "",
    created_at: raw.created_at || now,
    updated_at: raw.updated_at || raw.last_updated_at || now,
    full_name: raw.full_name || raw.full_name_original || "",
    normalized_name: raw.normalized_name || "",
    birth_date: raw.birth_date || "",
    life_path: raw.life_path || "",
    destiny: raw.destiny || "",
    soul: raw.soul || "",
    birthday: raw.birthday || "",
    personality: raw.personality || "",
    master_number: raw.master_number || raw.master_numbers || "",
    karmic_debt: raw.karmic_debt || raw.karmic_debts || "",
    report_summary: raw.report_summary || "",
    lead_status: status,
    selected_package: selectedPackage,
    selected_package_price: raw.selected_package_price || raw.selected_package_price_display || "",
    selected_addon: selectedAddon,
    selected_addon_price: raw.selected_addon_price || raw.selected_addon_price_display || "",
    recommended_package: raw.recommended_package || "",
    recommendation_reason: raw.recommendation_reason || "",
    zalo_phone: raw.zalo_phone || raw.phone_or_zalo || "",
    email: raw.email || "",
    consent: raw.consent === true || raw.consent_to_contact === true || String(raw.consent).toLowerCase() === "true",
    pdf_downloaded_at: raw.pdf_downloaded_at || (payload.event_type === "pdf_downloaded" ? now : ""),
    package_clicked_at: raw.package_clicked_at || (payload.event_type === "package_clicked" ? now : ""),
    zalo_submitted_at: raw.zalo_submitted_at || (payload.event_type === "zalo_submitted" ? now : ""),
    follow_up_status: raw.follow_up_status || computeFollowUpStatus_(status),
    follow_up_due_date: raw.follow_up_due_date || computeFollowUpDueDate(status),
    follow_up_note: raw.follow_up_note || "",
    contacted_at: raw.contacted_at || "",
    consulted_at: raw.consulted_at || "",
    converted_at: raw.converted_at || "",
    conversion_value: raw.conversion_value || "",
    consultant_note: raw.consultant_note || "",
    source_url: raw.source_url || (payload.meta && payload.meta.site_url) || "",
    user_agent: raw.user_agent || (payload.meta && payload.meta.user_agent) || "",
    session_id: raw.session_id || (payload.meta && payload.meta.session_id) || "",
    event_count: Number(raw.event_count || 0) || 1
  };
}

function normalizeStatus_(status) {
  const map = {
    report_generated: "new_report_generated",
    pdf_requested: "pdf_downloaded",
    paid_report_requested: "package_clicked",
    paid_package_clicked: "package_clicked"
  };
  return map[status] || status || "new_report_generated";
}

function upsertFollowUp_(lead) {
  if (!lead.follow_up_due_date || lead.follow_up_status === "done" || lead.follow_up_status === "not_required_yet") return;
  const sheet = getSheet_(SHEET_NAMES.followups);
  const existingRow = findRowByValue_(sheet, FOLLOWUP_HEADERS, "lead_id", lead.lead_id);
  const row = objectToRow_({
    follow_up_id: "FU_" + lead.lead_id,
    lead_id: lead.lead_id,
    full_name: lead.full_name,
    zalo_phone: lead.zalo_phone,
    lead_status_label: computeLeadStatusLabel(lead.lead_status),
    lead_temperature: computeLeadTemperature(lead),
    selected_package: lead.selected_package,
    recommended_package: lead.recommended_package,
    follow_up_status: lead.follow_up_status,
    follow_up_due_date: lead.follow_up_due_date,
    follow_up_note: lead.follow_up_note,
    message_template_key: lead.lead_status === "package_clicked" ? "package_clicked_hot" : "pdf_downloaded_followup",
    last_contacted_at: "",
    next_action: "Brian xem Sheet và nhắn Zalo phù hợp.",
    owner: "Brian",
    updated_at: new Date().toISOString()
  }, FOLLOWUP_HEADERS);
  if (existingRow > 1) {
    sheet.getRange(existingRow, 1, 1, FOLLOWUP_HEADERS.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
}

function refreshDashboard_() {
  const stats = getAdminStats();
  const sheet = getSheet_(SHEET_NAMES.dashboard);
  ensureHeader_(sheet, DASHBOARD_HEADERS);
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, DASHBOARD_HEADERS.length).clearContent();
  const now = new Date().toISOString();
  const rows = [
    ["Total leads", stats.totals.total_leads, "Tổng lead", now],
    ["Leads today", stats.totals.leads_today, "Lead hôm nay", now],
    ["Leads this month", stats.totals.leads_this_month, "Lead tháng này", now],
    ["PDF downloaded", stats.totals.pdf_downloaded, "Số lượt tải/in PDF", now],
    ["Package clicked", stats.totals.package_clicked, "Số lượt bấm gói", now],
    ["Add-on clicked", stats.totals.addon_clicked, "Số lượt bấm add-on", now],
    ["Zalo submitted", stats.totals.zalo_submitted, "Lead đã có Zalo/consent", now],
    ["Very hot leads", stats.totals.very_hot_leads, "Lead rất nóng", now],
    ["Converted", stats.totals.converted, "Lead đã chốt", now],
    ["Total conversion_value", stats.totals.total_conversion_value, "Tổng doanh thu đã nhập", now]
  ];
  if (rows.length) sheet.getRange(2, 1, rows.length, DASHBOARD_HEADERS.length).setValues(rows);
}

function seedConfig_() {
  const sheet = getSheet_(SHEET_NAMES.config);
  const existing = readObjects_(sheet, CONFIG_HEADERS).reduce(function (acc, row) {
    acc[row.key] = true;
    return acc;
  }, {});
  const now = new Date().toISOString();
  const rows = [
    ["phase_version", PHASE_VERSION, "Phiên bản cấu trúc CRM", now],
    ["discount_percent", "20", "Ưu đãi nâng cấp", now],
    ["discount_days", "3", "Số ngày giữ ưu đãi", now],
    ["require_zalo_before_pdf", "true", "Bắt buộc Zalo/SĐT trước PDF", now],
    ["enable_admin_stats", "true", "Cho phép admin aggregate stats", now],
    ["enable_package_tracking", "true", "Cho phép tracking gói", now],
    ["enable_recommendation", "true", "Cho phép recommendation nhẹ", now],
    ["zalo_brian", "0948909983", "Số Zalo Brian", now]
  ].filter(function (row) { return !existing[row[0]]; });
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, CONFIG_HEADERS.length).setValues(rows);
}

function seedMessageTemplates_() {
  const sheet = getSheet_(SHEET_NAMES.message_templates);
  const existing = readObjects_(sheet, TEMPLATE_HEADERS).reduce(function (acc, row) {
    acc[row.template_key] = true;
    return acc;
  }, {});
  const now = new Date().toISOString();
  const rows = MESSAGE_TEMPLATES
    .filter(function (row) { return !existing[row[0]]; })
    .map(function (row) { return row.concat([now]); });
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, TEMPLATE_HEADERS.length).setValues(rows);
}

function ensureHeader_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function findLeadRow_(leadId) {
  return findRowByValue_(getSheet_(SHEET_NAMES.leads), LEADS_HEADERS, "lead_id", leadId);
}

function findRowByValue_(sheet, headers, key, value) {
  if (!value || sheet.getLastRow() <= 1) return -1;
  const index = headers.indexOf(key);
  if (index < 0) return -1;
  const values = sheet.getRange(2, index + 1, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < values.length; i += 1) {
    if (String(values[i][0]) === String(value)) return i + 2;
  }
  return -1;
}

function rowToObject_(sheet, rowNumber, headers) {
  const values = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  return headers.reduce(function (acc, header, index) {
    acc[header] = values[index];
    return acc;
  }, {});
}

function objectToRow_(object, headers) {
  return headers.map(function (header) { return object[header] == null ? "" : object[header]; });
}

function readObjects_(sheet, headers) {
  if (sheet.getLastRow() <= 1) return [];
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  return values.map(function (row) {
    return headers.reduce(function (acc, header, index) {
      acc[header] = row[index];
      return acc;
    }, {});
  }).filter(function (row) {
    return Object.keys(row).some(function (key) { return String(row[key] || "").trim() !== ""; });
  });
}

function countByEvent_(logs, eventType) {
  return logs.filter(function (row) { return row.event_type === eventType; }).length;
}

function rate_(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function addDays_(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
