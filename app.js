(function () {
  "use strict";

  const BRAND = "BRIAN-NUMEROLOGIST";
  const CONSULTANT = "BRIAN";
  const ZALO_PHONE = "0948909983";
  const LEADS_STORAGE_KEY = "brian_numerologist_free_leads_v1";

  const CONTENT_FILES = [
    "content/LifePath_Library_FREE_v1.txt",
    "content/Karmic_Overlay_FREE_v1.txt",
    "content/Destiny_Library_FREE_v1.txt",
    "content/Soul_Library_FREE_v1.txt",
    "content/Birthday_Library_FREE_v1.txt",
    "content/Report_Template_FREE_11_Buoc_v1.txt"
  ];

  const PYTHAGORAS_MAP = Object.freeze({
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    O: 6,
    P: 7,
    Q: 8,
    R: 9,
    S: 1,
    T: 2,
    U: 3,
    V: 4,
    W: 5,
    X: 6,
    Y: 7,
    Z: 8
  });

  const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);
  const KARMIC_VALUES = Object.freeze({
    13: "13/4",
    14: "14/5",
    16: "16/7",
    19: "19/1"
  });
  const MASTER_VALUES = Object.freeze({
    11: "11/2",
    22: "22/4"
  });

  const SERVICE_PACKAGES = Object.freeze({
    hat_giong_thau_hieu: {
      display_name: "Hạt Giống Thấu Hiểu",
      short_description: "Gói nền cho người mới bắt đầu, tập trung vào 4 chỉ số cốt lõi."
    },
    lo_trinh_giai_ma: {
      display_name: "Lộ Trình Giải Mã",
      short_description: "Mở rộng từ cốt lõi sang các chỉ số bổ sung và các lớp nội tâm."
    },
    ban_do_kien_tao: {
      display_name: "Bản Đồ Kiến Tạo",
      short_description: "Bản đồ toàn diện hơn, kết hợp cốt lõi, bổ sung, chu kỳ và định hướng."
    },
    toi_uu_doanh_nghiep: {
      display_name: "Tối Ưu Doanh Nghiệp",
      short_description: "Dành cho tên thương hiệu, cửa hàng, đối tác, đội nhóm hoặc kinh doanh."
    },
    thau_hieu_moi_quan_he: {
      display_name: "Thấu Hiểu Mối Quan Hệ",
      short_description: "Dành cho vợ chồng, người yêu, gia đình, bạn bè, đối tác hoặc đội nhóm."
    },
    kien_tao_ban_than: {
      display_name: "Kiến Tạo Bản Thân",
      short_description: "Gói đi sâu toàn diện: bản đồ cá nhân, chu kỳ, nghề nghiệp, tên phụ và chiến lược phát triển."
    }
  });

  const FALLBACK_BLOCKS = Object.freeze({
    LIFEPATH_4: [
      "display_title: Đường Đời 4 - Người Kiến Tạo",
      "",
      "summary:",
      "Bạn mang năng lượng của người xây nền. Đường Đời 4 học cách tạo sự vững chắc bằng kỷ luật, quy trình và khả năng đi đường dài.",
      "",
      "life_symptoms:",
      "- Muốn mọi thứ chắc chắn rồi mới hành động.",
      "- Dễ kiệt sức vì ôm trách nhiệm quá nặng.",
      "- Ghét sự hỗn loạn nhưng thường phải tái cấu trúc mọi thứ.",
      "",
      "free_guidance:",
      "Kỷ luật là sức mạnh, nhưng đừng biến nó thành nhà tù. Sự ổn định nên là bệ phóng, không phải chiếc lồng."
    ].join("\n"),
    DESTINY_4: [
      "display_title: Sứ Mệnh 4 - Người Kiến Thiết",
      "",
      "summary:",
      "Sứ Mệnh 4 cho thấy hành trang của người biết biến ý tưởng mơ hồ thành cấu trúc cụ thể, biến hỗn loạn thành trật tự.",
      "",
      "life_symptoms:",
      "- Khó chịu khi mọi thứ thiếu quy trình.",
      "- Làm tốt việc chi tiết mà người khác dễ chán.",
      "- Cần học nhìn bức tranh lớn, không chỉ sửa từng chi tiết nhỏ.",
      "",
      "free_guidance:",
      "Kỷ luật là sức mạnh, nhưng linh hoạt mới giúp kỷ luật sống được lâu."
    ].join("\n"),
    SOUL_7: [
      "display_title: Linh Hồn 7 - Khát Khao Chân Lý",
      "",
      "summary:",
      "Bên trong bạn là nhu cầu đi tìm ý nghĩa, chiều sâu và sự thật. Bạn không dễ thỏa mãn với câu trả lời hời hợt.",
      "",
      "life_symptoms:",
      "- Cần ở một mình để phục hồi năng lượng.",
      "- Khó chịu với sự nông cạn hoặc câu trả lời quá đơn giản.",
      "- Hiểu nhiều nhưng không dễ chia sẻ ra ngoài.",
      "",
      "free_guidance:",
      "Hãy cho nội tâm không gian tĩnh lặng, nhưng đừng dùng sự cô lập để tự cắt mình khỏi những kết nối lành mạnh."
    ].join("\n"),
    BIRTHDAY_21: [
      "display_title: Ngày Sinh 21 - Nghệ Sĩ Ngoại Giao",
      "",
      "summary:",
      "Ngày Sinh 21 rút về 3, được tạo bởi 2 và 1. Bạn có sự duyên dáng xã giao, tinh tế và khả năng biểu đạt thu hút.",
      "",
      "life_symptoms:",
      "- Dễ tạo thiện cảm khi giao tiếp.",
      "- Có thể biết nói điều người khác muốn nghe.",
      "- Cần cẩn thận với việc hứa quá nhanh hoặc chiều lòng quá mức.",
      "",
      "free_guidance:",
      "Duyên nói chuyện là món quà, nhưng sự nhất quán mới tạo niềm tin dài lâu."
    ].join("\n"),
    KARMIC_OVERLAY_13_4: [
      "display_title: Nợ Nghiệp 13/4 - Bài học về kỷ luật",
      "",
      "core_meaning:",
      "13/4 là bài học về trách nhiệm, chăm chỉ và khả năng hoàn thành điều đã cam kết.",
      "",
      "life_symptoms:",
      "- Dễ thấy việc gì cũng chậm, nặng hoặc nhiều bước hơn người khác.",
      "- Hay gặp tình huống phải làm lại, sửa lại, xây lại từ đầu.",
      "- Có xu hướng trì hoãn khi việc quá dài hoặc quá khó.",
      "",
      "free_guidance:",
      "Bài học nằm ở kỷ luật và sự hoàn thành. Khi bạn chịu xây nền, cuộc đời bắt đầu bớt làm sập những gì còn lỏng."
    ].join("\n"),
    KARMIC_OVERLAY_16_7: [
      "display_title: Nợ Nghiệp 16/7 - Bài học về niềm tin",
      "",
      "core_meaning:",
      "16/7 là bài học về sự trung thực, niềm tin, cái tôi và tái sinh nội tâm.",
      "",
      "life_symptoms:",
      "- Dễ có cảm giác cô độc sâu, kể cả khi xung quanh vẫn có người.",
      "- Có thể khó tin người khác, kể cả khi họ thật lòng.",
      "- Bài học thường đi qua tình cảm, gia đình hoặc các mối quan hệ thân thiết.",
      "",
      "free_guidance:",
      "Sự sụp đổ của một hình ảnh cũ có thể là cơ hội xây lại nội tâm chân thật hơn."
    ].join("\n")
  });

  const HUMAN_LABELS = Object.freeze({
    display_title: "Tiêu đề",
    subtitle: "Phụ đề",
    keywords: "Từ khóa",
    summary: "Tổng quan",
    soul_lesson: "Bài học linh hồn",
    positive_energy: "Năng lượng tích cực",
    underbalanced_energy: "Khi thiếu cân bằng",
    overbalanced_energy: "Khi thái quá",
    warning_signs: "Dấu hiệu cảnh báo",
    life_symptoms: "Triệu chứng dễ chạm",
    free_guidance: "Gợi mở bản FREE",
    core_potential: "Tiềm năng cốt lõi",
    positive_attitude: "Mặt sáng",
    shadow_attitude: "Mặt bóng",
    career_direction: "Định hướng nghề nghiệp",
    career_note: "Ghi chú nghề nghiệp",
    core_motivation: "Động lực sâu",
    fulfilled_state: "Khi được thỏa mãn",
    blocked_state: "Khi bị kìm nén",
    gift: "Món quà",
    warning: "Lưu ý",
    core_meaning: "Ý nghĩa cốt lõi",
    symbolic_cause: "Ngôn ngữ biểu tượng",
    current_life_manifestation: "Biểu hiện hiện tại",
    upsell_hook: "Gợi mở chuyên sâu"
  });

  const METADATA_KEYS = new Set([
    "field",
    "value",
    "base_number",
    "group",
    "condition",
    "compatible_base_block",
    "report_section",
    "free_depth",
    "paid_depth_reserved"
  ]);

  let contentBlocks = { ...FALLBACK_BLOCKS };
  let currentReportData = null;
  let currentLeadId = null;
  let selectedPackage = null;

  function normalizeVietnameseName(name) {
    return String(name || "")
      .replace(/Đ/g, "D")
      .replace(/đ/g, "d")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }

  function splitVietnameseName(normalizedName) {
    const words = String(normalizedName || "").split(" ").filter(Boolean);
    return {
      last_name: words[0] || "",
      middle_name_group: words.length > 2 ? words.slice(1, -1).join(" ") : "",
      first_name: words.length > 1 ? words[words.length - 1] : "",
      word_count: words.length
    };
  }

  function letterToNumber(letter) {
    return PYTHAGORAS_MAP[String(letter || "").toUpperCase()] || null;
  }

  function isVowel(letter) {
    return VOWELS.has(String(letter || "").toUpperCase());
  }

  function isConsonant(letter) {
    const upper = String(letter || "").toUpperCase();
    return /^[A-Z]$/.test(upper) && !isVowel(upper);
  }

  function sumDigits(value) {
    return String(Math.abs(Number(value) || 0))
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  function baseFromSpecial(value) {
    return sumDigits(value);
  }

  function zeroReduction() {
    return {
      raw_total: 0,
      special_total: null,
      display: "0",
      base: 0,
      kind: "none",
      history: [0],
      sum_value: 0
    };
  }

  function reduceWithSpecialNumbers(total) {
    let current = Number(total) || 0;
    const history = [];

    if (current <= 0) {
      return zeroReduction();
    }

    while (true) {
      history.push(current);

      if (MASTER_VALUES[current]) {
        return {
          raw_total: Number(total),
          special_total: current,
          display: MASTER_VALUES[current],
          base: baseFromSpecial(current),
          kind: "master",
          history,
          sum_value: current
        };
      }

      if (KARMIC_VALUES[current]) {
        return {
          raw_total: Number(total),
          special_total: current,
          display: KARMIC_VALUES[current],
          base: baseFromSpecial(current),
          kind: "karmic",
          history,
          sum_value: baseFromSpecial(current)
        };
      }

      if (current < 10) {
        return {
          raw_total: Number(total),
          special_total: null,
          display: String(current),
          base: current,
          kind: "none",
          history,
          sum_value: current
        };
      }

      current = sumDigits(current);
    }
  }

  function displayRawOverBase(reduction) {
    if (!reduction || reduction.raw_total <= 0) {
      return "0";
    }

    if (reduction.kind === "master" || reduction.kind === "karmic") {
      return reduction.display;
    }

    return reduction.raw_total > 9 ? `${reduction.raw_total}/${reduction.base}` : String(reduction.base);
  }

  function parseBirthDate(birthDate) {
    const value = String(birthDate || "").trim();
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

    if (!match) {
      return {
        is_valid: false,
        error: "Ngày sinh phải đúng định dạng DD/MM/YYYY, ví dụ 21/04/1986."
      };
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return {
        is_valid: false,
        error: "Ngày sinh không hợp lệ. Vui lòng kiểm tra lại ngày, tháng, năm."
      };
    }

    return {
      is_valid: true,
      day,
      month,
      year,
      normalized: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`
    };
  }

  function lettersFromText(text, filterName) {
    const letters = String(text || "").replace(/\s+/g, "").split("").filter(Boolean);

    if (filterName === "vowels") {
      return letters.filter(isVowel);
    }

    if (filterName === "consonants") {
      return letters.filter(isConsonant);
    }

    return letters.filter((letter) => /^[A-Z]$/.test(letter));
  }

  function calculateNamePart(partName, text, filterName) {
    const letters = lettersFromText(text, filterName);
    const numbers = letters.map(letterToNumber).filter((number) => number !== null);
    const rawTotal = numbers.reduce((sum, number) => sum + number, 0);
    const reduction = rawTotal > 0 ? reduceWithSpecialNumbers(rawTotal) : zeroReduction();

    return {
      part_name: partName,
      text,
      letters,
      numbers,
      raw_total: rawTotal,
      reduction_display: reduction.display,
      base: reduction.base,
      sum_value: reduction.sum_value,
      special_kind: reduction.kind,
      special_total: reduction.special_total,
      history: reduction.history
    };
  }

  function calculateNameNumber(parts, fieldName, filterName) {
    const suffix = filterName === "all" ? "all_letters" : filterName;
    const partResults = [
      calculateNamePart(`last_name_${suffix}`, parts.last_name, filterName),
      calculateNamePart(`middle_name_group_${suffix}`, parts.middle_name_group, filterName),
      calculateNamePart(`first_name_${suffix}`, parts.first_name, filterName)
    ];
    const finalTotal = partResults.reduce((sum, part) => sum + part.sum_value, 0);
    const finalReduction = reduceWithSpecialNumbers(finalTotal);
    const display = fieldName === "personality" ? displayRawOverBase(finalReduction) : finalReduction.display;

    return {
      field_name: fieldName,
      display,
      base: finalReduction.base,
      raw_total: finalTotal,
      special_kind: finalReduction.kind,
      special_total: finalReduction.special_total,
      reduction_display: finalReduction.display,
      parts: partResults,
      history: finalReduction.history
    };
  }

  function calculateLifePath(parsedDate) {
    const dayReduction = reduceWithSpecialNumbers(parsedDate.day);
    const monthReduction = reduceWithSpecialNumbers(parsedDate.month);
    const yearRawTotal = String(parsedDate.year)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
    const yearReduction = reduceWithSpecialNumbers(yearRawTotal);
    const finalTotal = dayReduction.sum_value + monthReduction.sum_value + yearReduction.sum_value;
    const finalReduction = reduceWithSpecialNumbers(finalTotal);

    return {
      field_name: "life_path",
      display: finalReduction.display,
      base: finalReduction.base,
      raw_total: finalTotal,
      special_kind: finalReduction.kind,
      special_total: finalReduction.special_total,
      day: dayReduction,
      month: monthReduction,
      year: yearReduction,
      year_raw_total: yearRawTotal,
      history: finalReduction.history
    };
  }

  function calculateBirthday(parsedDate) {
    const reduction = reduceWithSpecialNumbers(parsedDate.day);
    const display = parsedDate.day > 9 || reduction.kind !== "none"
      ? `${parsedDate.day}/${reduction.base}`
      : String(reduction.base);

    return {
      field_name: "birthday",
      display,
      base: reduction.base,
      original_day: parsedDate.day,
      special_kind: reduction.kind,
      special_total: reduction.special_total,
      route_block_id: `BIRTHDAY_${parsedDate.day}`,
      history: reduction.history
    };
  }

  function buildNameAudit(normalizedName) {
    const letters = normalizedName.replace(/\s+/g, "").split("").filter(Boolean);
    const numbers = letters.map(letterToNumber).filter((number) => number !== null);

    return {
      letters,
      numbers,
      letter_number_pairs: letters.map((letter, index) => ({
        letter,
        number: numbers[index]
      })),
      letter_count: letters.length,
      number_count: numbers.length,
      is_valid: letters.length === numbers.length
    };
  }

  function addKarmic(karmicMap, value, appearsIn) {
    if (!value) {
      return;
    }

    const base = Number(value.split("/")[1]);
    const existing = karmicMap.get(value) || {
      value,
      base,
      appears_in: [],
      overlay_block_id: `KARMIC_OVERLAY_${value.replace("/", "_")}`
    };

    if (!existing.appears_in.includes(appearsIn)) {
      existing.appears_in.push(appearsIn);
    }

    karmicMap.set(value, existing);
  }

  function addMaster(masterMap, value, appearsIn, note, isPrimary) {
    if (!value) {
      return;
    }

    const key = `${value}|${appearsIn}|${isPrimary ? "primary" : "intermediate"}`;
    if (!masterMap.has(key)) {
      masterMap.set(key, {
        value,
        appears_in: [appearsIn],
        note
      });
    }
  }

  function routeBlocks(prefix, calculation) {
    const baseBlock = `${prefix}_${calculation.base}`;

    if (calculation.special_kind === "master") {
      return [`${prefix}_${calculation.special_total}`];
    }

    if (calculation.special_kind === "karmic") {
      return [baseBlock, `KARMIC_OVERLAY_${calculation.special_total}_${calculation.base}`];
    }

    return [baseBlock];
  }

  function buildRouting(calculations) {
    return {
      life_path_blocks: routeBlocks("LIFEPATH", calculations.life_path),
      destiny_blocks: routeBlocks("DESTINY", calculations.destiny),
      soul_blocks: routeBlocks("SOUL", calculations.soul),
      birthday_blocks: [calculations.birthday.route_block_id]
    };
  }

  function calculateAll(input) {
    const parsedDate = parseBirthDate(input.birth_date);
    if (!parsedDate.is_valid) {
      throw new Error(parsedDate.error);
    }

    const fullName = normalizeVietnameseName(input.full_name_original);
    const nameParts = splitVietnameseName(fullName);

    if (nameParts.word_count < 2) {
      throw new Error("Họ tên khai sinh cần tối thiểu 2 từ sau khi chuẩn hóa.");
    }

    const audit = buildNameAudit(fullName);
    if (!audit.is_valid) {
      throw new Error("Audit chữ cái và số quy đổi không khớp. Vui lòng kiểm tra chuẩn hóa tên.");
    }

    const lifePath = calculateLifePath(parsedDate);
    const destiny = calculateNameNumber(nameParts, "destiny", "all");
    const soul = calculateNameNumber(nameParts, "soul", "vowels");
    const personality = calculateNameNumber(nameParts, "personality", "consonants");
    const birthday = calculateBirthday(parsedDate);
    const calculations = {
      life_path: lifePath,
      destiny,
      soul,
      personality,
      birthday
    };
    const routing = buildRouting(calculations);
    const karmicMap = new Map();
    const masterMap = new Map();

    [
      ["life_path", lifePath],
      ["destiny", destiny],
      ["soul", soul],
      ["birthday", birthday],
      ["personality", personality]
    ].forEach(([field, calculation]) => {
      if (calculation.special_kind === "karmic") {
        addKarmic(karmicMap, `${calculation.special_total}/${calculation.base}`, field);
      }

      if (calculation.special_kind === "master") {
        addMaster(masterMap, `${calculation.special_total}/${calculation.base}`, field, "Master Number ở kết quả chính.", true);
      }
    });

    [destiny, soul, personality].forEach((calculation) => {
      calculation.parts.forEach((part) => {
        if (part.special_kind === "master") {
          addMaster(
            masterMap,
            `${part.special_total}/${part.base}`,
            part.part_name,
            "Master Number xuất hiện ở phép tính trung gian theo từng phần tên.",
            false
          );
        }
      });
    });

    const primaryMasterNumbers = Array.from(masterMap.values()).filter((item) => item.note === "Master Number ở kết quả chính.");
    const intermediateMasterNumbers = Array.from(masterMap.values()).filter((item) => item.note !== "Master Number ở kết quả chính.");
    const karmicDebtDetails = Array.from(karmicMap.values());

    return {
      schema_version: "1.0",
      input: {
        full_name_original: String(input.full_name_original || "").trim(),
        birth_date: parsedDate.normalized,
        phone_or_zalo: input.phone_or_zalo || null,
        email: input.email || null,
        gender: input.gender || "khong_cung_cap",
        note: input.note || null,
        consent_to_contact: Boolean(input.consent_to_contact)
      },
      normalized: {
        full_name: fullName,
        last_name: nameParts.last_name,
        middle_name_group: nameParts.middle_name_group,
        first_name: nameParts.first_name
      },
      core_numbers: {
        life_path: lifePath.display,
        life_path_base: lifePath.base,
        destiny: destiny.display,
        destiny_base: destiny.base,
        soul: soul.display,
        soul_base: soul.base,
        birthday: birthday.display,
        birthday_original: birthday.original_day,
        birthday_base: birthday.base,
        personality: personality.display,
        personality_base: personality.base
      },
      master_numbers: {
        primary_master_numbers: primaryMasterNumbers,
        intermediate_master_numbers: intermediateMasterNumbers
      },
      karmic_debts: karmicDebtDetails.map((detail) => detail.value),
      karmic_debt_details: karmicDebtDetails,
      calculation_audit: {
        letter_count: audit.letter_count,
        number_count: audit.number_count,
        is_valid: audit.is_valid,
        audit_notes: [
          audit.is_valid
            ? "Số chữ cái A-Z khớp số con số quy đổi."
            : "Số chữ cái A-Z không khớp số con số quy đổi."
        ]
      },
      calculation_debug: {
        name_conversion: audit,
        life_path_calculation: lifePath,
        destiny_calculation: destiny,
        soul_calculation: soul,
        personality_calculation: personality,
        birthday_calculation: {
          original_day: birthday.original_day,
          base: birthday.base,
          display: birthday.display,
          route_block_id: birthday.route_block_id,
          history: birthday.history
        }
      },
      routing,
      report: {
        format: "web",
        sections: [],
        full_report_text: ""
      },
      lead: {
        status: "new",
        requested_pdf: false,
        requested_paid_report: false,
        selected_package: null,
        consent_to_contact: Boolean(input.consent_to_contact)
      },
      cta: {
        consultant: CONSULTANT,
        zalo_phone: ZALO_PHONE,
        offer: "Ưu đãi 20% trong vòng 3 ngày nếu nâng cấp bản chuyên sâu.",
        service_packages: SERVICE_PACKAGES
      },
      admin: {
        phase: "phase_2_placeholder",
        google_sheet_enabled: false
      }
    };
  }

  function parseBlocksFromText(text) {
    const blocks = {};
    const normalized = String(text || "").replace(/\r\n/g, "\n");
    const markerPattern = /(?:^|\n)=+\n([A-Z][A-Z0-9_]+)\n=+\n/g;
    const markers = [];
    let match;

    while ((match = markerPattern.exec(normalized)) !== null) {
      markers.push({
        id: match[1].trim(),
        contentStart: markerPattern.lastIndex,
        markerStart: match.index
      });
    }

    markers.forEach((marker, index) => {
      const nextMarker = markers[index + 1];
      const end = nextMarker ? nextMarker.markerStart : normalized.length;
      const body = normalized.slice(marker.contentStart, end).trim();

      if (marker.id && body) {
        blocks[marker.id] = body;
      }
    });

    return blocks;
  }

  async function loadContentLibraries() {
    if (typeof fetch !== "function") {
      return {
        loaded_count: Object.keys(contentBlocks).length,
        used_fallback: true
      };
    }

    const loadedBlocks = {};
    let loadedFiles = 0;

    for (const file of CONTENT_FILES) {
      try {
        const response = await fetch(file, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Không tải được ${file}`);
        }

        const text = await response.text();
        Object.assign(loadedBlocks, parseBlocksFromText(text));
        loadedFiles += 1;
      } catch (error) {
        console.warn(error);
      }
    }

    contentBlocks = { ...FALLBACK_BLOCKS, ...loadedBlocks };

    return {
      loaded_count: Object.keys(loadedBlocks).length,
      loaded_files: loadedFiles,
      used_fallback: loadedFiles === 0
    };
  }

  function getFallbackBlockContent(blockId) {
    if (FALLBACK_BLOCKS[blockId]) {
      return FALLBACK_BLOCKS[blockId];
    }

    const [kind, value] = String(blockId || "").split(/_(.+)/);

    if (kind === "LIFEPATH") {
      return [
        `display_title: Đường Đời ${value}`,
        "",
        "summary:",
        `Đường Đời ${value} cho thấy hướng phát triển chính của hành trình sống. Đây là lớp nền để đọc cách bạn học bài học, ra quyết định và trưởng thành.`,
        "",
        "free_guidance:",
        "Bản FREE chỉ mở lớp đầu. Bản chuyên sâu sẽ cần đối chiếu thêm Sứ Mệnh, Linh Hồn, Ngày Sinh và các chu kỳ cá nhân."
      ].join("\n");
    }

    if (kind === "DESTINY") {
      return [
        `display_title: Sứ Mệnh ${value}`,
        "",
        "summary:",
        `Sứ Mệnh ${value} mô tả hành trang và năng lực bạn mang vào đời qua họ tên khai sinh.`,
        "",
        "free_guidance:",
        "Hãy xem đây là gợi ý về cách dùng năng lực, không phải kết luận cố định về nghề nghiệp hay số phận."
      ].join("\n");
    }

    if (kind === "SOUL") {
      return [
        `display_title: Linh Hồn ${value}`,
        "",
        "summary:",
        `Linh Hồn ${value} phản ánh nhu cầu sâu bên trong, điều làm bạn thấy được nuôi dưỡng và đúng với mình.`,
        "",
        "free_guidance:",
        "Khi nhu cầu bên trong được gọi tên, bạn có thêm quyền lựa chọn cách sống cân bằng hơn."
      ].join("\n");
    }

    if (kind === "BIRTHDAY") {
      return [
        `display_title: Ngày Sinh ${value}`,
        "",
        "summary:",
        `Ngày Sinh ${value} là món quà bẩm sinh thể hiện cách bạn phản ứng nhanh, bộc lộ tài năng và tạo dấu ấn riêng.`,
        "",
        "free_guidance:",
        "Ngày Sinh cần được đọc cùng các chỉ số khác để tránh nhìn một chiều."
      ].join("\n");
    }

    if (String(blockId || "").startsWith("KARMIC_OVERLAY_")) {
      return [
        `display_title: ${blockId.replace(/_/g, " ")}`,
        "",
        "core_meaning:",
        "Đây là một bài học sâu cần tỉnh thức. Hãy xem nó như tín hiệu để rèn năng lực, không phải lời kết án.",
        "",
        "free_guidance:",
        "Bản chuyên sâu sẽ đọc bài học này trong tương quan với toàn bộ bản đồ cá nhân."
      ].join("\n");
    }

    return `Không tìm thấy block ${blockId}. App đang dùng fallback an toàn để báo cáo không bị dừng.`;
  }

  function getBlockContent(blockId) {
    return contentBlocks[blockId] || getFallbackBlockContent(blockId);
  }

  function formatLibraryBlock(blockId) {
    const raw = getBlockContent(blockId);
    const lines = raw.replace(/\r\n/g, "\n").split("\n");
    const output = [];

    lines.forEach((line) => {
      const keyMatch = /^([a-z_]+):\s*(.*)$/.exec(line.trim());

      if (!keyMatch) {
        output.push(line);
        return;
      }

      const key = keyMatch[1];
      const value = keyMatch[2];

      if (METADATA_KEYS.has(key)) {
        return;
      }

      const label = HUMAN_LABELS[key] || key.replace(/_/g, " ");
      output.push(value ? `${label}: ${value}` : `${label}:`);
    });

    return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function joinBlockContents(blockIds) {
    return blockIds.map(formatLibraryBlock).join("\n\n---\n\n");
  }

  function formatKarmicSummary(data) {
    if (!data.karmic_debt_details.length) {
      return "Không ghi nhận Karmic Debt ở 4 chỉ số cốt lõi trong bản FREE này.";
    }

    return data.karmic_debt_details
      .map((detail) => `${detail.value} xuất hiện ở ${detail.appears_in.join(", ")}.`)
      .join("\n");
  }

  function formatMasterSummary(data) {
    const primary = data.master_numbers.primary_master_numbers;
    const intermediate = data.master_numbers.intermediate_master_numbers;
    const lines = [];

    if (primary.length) {
      lines.push(`Master chính: ${primary.map((item) => item.value).join(", ")}.`);
    }

    if (intermediate.length) {
      lines.push(
        `Master trung gian: ${intermediate
          .map((item) => `${item.value} ở ${item.appears_in.join(", ")}`)
          .join("; ")}.`
      );
    }

    return lines.length ? lines.join("\n") : "Không ghi nhận Master Number ở kết quả chính.";
  }

  function buildStep01(data) {
    const pairs = data.calculation_debug.name_conversion.letter_number_pairs
      .map((pair) => `${pair.letter}=${pair.number}`)
      .join(", ");

    return [
      "1. THÔNG TIN ĐẦU VÀO",
      "",
      `Họ tên khai sinh: ${data.input.full_name_original}`,
      `Tên chuẩn hóa: ${data.normalized.full_name}`,
      `Ngày sinh dương lịch: ${data.input.birth_date}`,
      "",
      "Cấu trúc tên:",
      `- Họ: ${data.normalized.last_name}`,
      `- Cụm tên lót: ${data.normalized.middle_name_group || "(không có)"}`,
      `- Tên: ${data.normalized.first_name}`,
      "",
      "2. BẢNG QUY ĐỔI CHỮ CÁI",
      "",
      data.calculation_debug.name_conversion.letters.join(""),
      pairs,
      "",
      "3. 4 CHỈ SỐ CỐT LÕI VÀ NHÂN CÁCH",
      "",
      `- Đường Đời: ${data.core_numbers.life_path}`,
      `- Sứ Mệnh: ${data.core_numbers.destiny}`,
      `- Linh Hồn: ${data.core_numbers.soul}`,
      `- Ngày Sinh: ${data.core_numbers.birthday}`,
      `- Nhân Cách: ${data.core_numbers.personality}`,
      "",
      "4. MASTER / KARMIC",
      "",
      formatMasterSummary(data),
      formatKarmicSummary(data),
      "",
      "5. AUDIT NGẮN",
      "",
      `- letter_count: ${data.calculation_audit.letter_count}`,
      `- number_count: ${data.calculation_audit.number_count}`,
      `- is_valid: ${data.calculation_audit.is_valid}`,
      `- birthday route: ${data.routing.birthday_blocks.join(", ")}`,
      "",
      "Lưu ý nền: Thần số học là bản đồ khuynh hướng, không phải bản án định mệnh."
    ].join("\n");
  }

  function buildLifePathVsDestinyFallback(data) {
    const sameFrequency = data.core_numbers.life_path_base === data.core_numbers.destiny_base;
    const karmicText = data.karmic_debts.length
      ? `Trong hồ sơ này có Karmic Debt ${data.karmic_debts.join(", ")}. Đây là bài học sâu cần tỉnh thức, không phải lời kết luận rằng bạn bị trói vào một số phận cố định.`
      : "Không có Karmic Debt nổi bật ở cặp Đường Đời - Sứ Mệnh trong bản FREE này.";

    return [
      `Đường Đời của bạn là ${data.core_numbers.life_path}, Sứ Mệnh là ${data.core_numbers.destiny}.`,
      "",
      sameFrequency
        ? "Hai chỉ số này cùng tần số nền. Con đường sống và hành trang tên gọi đang khuếch đại nhau: mặt mạnh tăng, nhưng áp lực cùng loại cũng tăng."
        : "Hai chỉ số này khác tần số. Điều đó tạo ra độ căng giữa hướng đời phải học và cách bạn quen dùng năng lực của mình.",
      "",
      "Những triệu chứng dễ chạm:",
      sameFrequency
        ? "- Bạn có thể thấy mình luôn bị kéo về cùng một kiểu bài học, dù đổi môi trường hay đổi vai trò.\n- Khi làm đúng, năng lượng đi rất bền. Khi lệch, bạn dễ mắc kẹt rất lâu.\n- Người khác có thể dựa vào bạn, nhưng bạn lại khó cho phép mình mềm ra."
        : "- Bạn có thể giỏi một kiểu, nhưng đời lại bắt học một kiểu khác.\n- Có lúc bạn thấy mình làm đúng năng lực nhưng vẫn chưa thấy thật sự đúng đường.\n- Cảm giác bên ngoài tiến lên nhưng bên trong còn một lực kéo ngược lại.",
      "",
      karmicText,
      "",
      "Bản chuyên sâu sẽ đọc cặp này cùng Linh Hồn, Nhân Cách và chu kỳ cá nhân để tìm chiến lược hóa giải cụ thể hơn."
    ].join("\n");
  }

  function buildSoulRelationshipsFallback(data) {
    const soulBase = data.core_numbers.soul_base;
    const lifeBase = data.core_numbers.life_path_base;
    const destinyBase = data.core_numbers.destiny_base;
    const soulDiffers = soulBase !== lifeBase || soulBase !== destinyBase;

    return [
      `Linh Hồn của bạn là ${data.core_numbers.soul}. Đây là nhu cầu sâu bên trong, không phải lớp thể hiện ra ngoài đầu tiên.`,
      "",
      soulDiffers
        ? "Linh Hồn đang khác tần số với ít nhất một trụ cột bên ngoài. Điều này thường tạo cảm giác: bên ngoài làm được, bên trong chưa chắc đã thấy đủ."
        : "Linh Hồn cùng tần số với các trụ cột chính. Nhu cầu bên trong và hướng vận hành bên ngoài có xu hướng hỗ trợ nhau mạnh.",
      "",
      "Trong quan hệ, điểm nhột có thể là:",
      "- Bạn muốn được hiểu đúng, nhưng không phải lúc nào cũng nói thẳng nhu cầu thật.",
      "- Khi bị ép sống trái nhịp bên trong, bạn dễ im lặng, lạnh đi hoặc tự rút lui.",
      "- Bạn có thể cho người khác thấy phần mạnh, còn phần cần được nâng đỡ lại giấu khá kỹ.",
      "",
      "Bản FREE chỉ gọi tên lớp tương quan đầu. Bản chuyên sâu sẽ đi vào kiểu kết nối, điểm dễ tổn thương và cách đặt ranh giới lành mạnh."
    ].join("\n");
  }

  function buildCoreConflictFallback(data) {
    const items = [
      `Đường Đời ${data.core_numbers.life_path}: bài học đường dài.`,
      `Sứ Mệnh ${data.core_numbers.destiny}: hành trang qua họ tên.`,
      `Linh Hồn ${data.core_numbers.soul}: nhu cầu bên trong.`,
      `Ngày Sinh ${data.core_numbers.birthday}: món quà phản xạ tự nhiên.`,
      `Nhân Cách ${data.core_numbers.personality}: lớp người khác dễ nhìn thấy.`
    ];

    return [
      "Tóm tắt xung đột cốt lõi trong bản FREE này không nhằm đóng khung bạn. Nó giúp gọi tên vài lực kéo có thể đang vận hành âm thầm.",
      "",
      ...items.map((item) => `- ${item}`),
      "",
      "Ba điểm dễ nhột:",
      "- Bạn có thể mạnh ở lớp hành động, nhưng nhu cầu sâu bên trong cần một kiểu nuôi dưỡng khác.",
      "- Khi bị áp lực, bạn dễ quay về mặt bóng của chỉ số mạnh nhất.",
      "- Nếu có Karmic Debt, bài học thường lặp lại cho đến khi bạn đổi cách phản ứng, không chỉ đổi hoàn cảnh.",
      "",
      "Đây là phần cần đọc đa chỉ số trong bản chuyên sâu. Một chỉ số riêng lẻ không đủ để kết luận toàn bộ con người."
    ].join("\n");
  }

  function buildResolutionImportanceFallback(data) {
    return [
      "Vì sao cần hóa giải các mâu thuẫn cốt lõi?",
      "",
      "Không phải vì bạn đang bị một con số quyết định. Lý do thực tế hơn: khi các lực bên trong không được gọi tên, bạn dễ lặp lại cùng một kiểu lựa chọn rồi tưởng đó là tính cách cố định.",
      "",
      `Với hồ sơ này, các điểm cần chú ý là ${[
        data.core_numbers.life_path,
        data.core_numbers.destiny,
        data.core_numbers.soul,
        data.core_numbers.birthday,
        data.core_numbers.personality
      ].join(", ")}.`,
      "",
      "Dấu hiệu nên đọc sâu hơn:",
      "- Có một bài học xuất hiện lặp lại trong công việc, tiền bạc hoặc quan hệ.",
      "- Bạn hiểu vấn đề bằng lý trí nhưng vẫn phản ứng theo mô thức cũ.",
      "- Bạn muốn có lộ trình hành động cụ thể, không chỉ phần mô tả tính cách.",
      "",
      "Bản chuyên sâu sẽ tập trung vào chiến lược chuyển hóa, không hù dọa và không ép mua."
    ].join("\n");
  }

  function buildAdditionalPreview(data) {
    return [
      "Bản FREE đã đọc các trụ cột đầu tiên. Một bản chuyên sâu có thể mở thêm các lớp sau:",
      "",
      "- Chỉ số Nhân Cách: cách người khác cảm nhận bạn lúc đầu.",
      "- Chỉ số Trưởng Thành: hướng phát triển sau các giai đoạn va đập.",
      "- Thái Độ, Năng Lực Tự Nhiên, chu kỳ năm cá nhân và các mốc chuyển pha.",
      "- Tương quan tên khai sinh, tên thường dùng, tên thương hiệu hoặc tên doanh nghiệp.",
      "",
      `Trong hồ sơ này, Nhân Cách là ${data.core_numbers.personality}. Đây là lớp đáng xem thêm vì nó cho biết hình ảnh bạn phát ra ngoài có khớp với Linh Hồn ${data.core_numbers.soul} hay không.`,
      "",
      "Bản FREE không đi sâu các lớp này để tránh kết luận vội. Khi đọc sâu, cần đặt tất cả chỉ số vào cùng một bản đồ."
    ].join("\n");
  }

  function buildServiceEcosystem(data) {
    const packageLines = Object.entries(SERVICE_PACKAGES)
      .map(([, pack]) => `- ${pack.display_name}: ${pack.short_description}`)
      .join("\n");

    return [
      "Nếu bản FREE này giúp bạn nhận ra đúng vài điểm đang vận hành, bước tiếp theo là chọn mức đọc sâu phù hợp.",
      "",
      packageLines,
      "",
      "Ưu đãi 20% nếu nâng cấp trong vòng 3 ngày sau khi nhận bản FREE.",
      `Liên hệ ${CONSULTANT} qua Zalo/điện thoại: ${ZALO_PHONE}.`,
      "",
      "Lưu ý: Brian-Numerologist không dùng báo cáo để hù dọa, ép mua hoặc thay bạn ra quyết định. Báo cáo là bản đồ khuynh hướng; quyền lựa chọn và hành động vẫn thuộc về bạn."
    ].join("\n");
  }

  function buildCoverText(data) {
    return [
      "BẢN ĐỒ THẦN SỐ HỌC FREE 11 BƯỚC",
      "Cửa mở đầu tiên để hiểu bản thân qua Họ tên và Ngày sinh",
      "",
      `Họ tên khai sinh: ${data.input.full_name_original}`,
      `Ngày sinh dương lịch: ${data.input.birth_date}`,
      `Thương hiệu: ${BRAND}`,
      `Liên hệ ${CONSULTANT}: ${ZALO_PHONE}`,
      "",
      "Lưu ý nền:",
      "Thần số học là bản đồ khuynh hướng, không phải bản án định mệnh. Báo cáo này giúp gọi tên những cấu trúc năng lượng chính, nhưng quyền lựa chọn, hành động và chuyển hóa vẫn thuộc về bạn.",
      "",
      "LỜI MỞ ĐẦU",
      "",
      `Chào bạn, ${data.input.full_name_original}.`,
      "",
      "Bản FREE này là cửa mở đầu tiên trong hệ thống Brian-Numerologist. Nó không nhằm nói hết mọi thứ về bạn, cũng không thay thế bản phân tích chuyên sâu. Mục tiêu của bản này là giúp bạn nhìn thấy 4 trụ cột cốt lõi đầu tiên trong bản đồ cá nhân: Đường Đời, Sứ Mệnh, Linh Hồn và Ngày Sinh."
    ].join("\n");
  }

  function section(stepNumber, sectionId, title, sourceType, sourceBlockIds, content, upsellHook, isLockedForPaid) {
    return {
      step_number: stepNumber,
      section_id: sectionId,
      title,
      source_type: sourceType,
      source_block_ids: sourceBlockIds,
      content,
      upsell_hook: upsellHook || "",
      is_locked_for_paid: Boolean(isLockedForPaid)
    };
  }

  function buildReportSections(data) {
    return [
      section(
        1,
        "STEP_01_CALCULATION",
        "Bước 1 - Tính toán và nhận diện 4 chỉ số cốt lõi",
        "calculation",
        [],
        buildStep01(data),
        "Bản chuyên sâu sẽ đọc các chỉ số này trong tương quan nhiều lớp.",
        false
      ),
      section(
        2,
        "STEP_02_LIFE_PATH",
        "Bước 2 - Đường Đời",
        "library",
        data.routing.life_path_blocks,
        joinBlockContents(data.routing.life_path_blocks),
        "Đọc sâu hơn Đường Đời cần đối chiếu với các chỉ số còn lại.",
        false
      ),
      section(
        3,
        "STEP_03_DESTINY",
        "Bước 3 - Sứ Mệnh",
        "library",
        data.routing.destiny_blocks,
        joinBlockContents(data.routing.destiny_blocks),
        "Sứ Mệnh cần được soi cùng môi trường nghề nghiệp và lựa chọn thực tế.",
        false
      ),
      section(
        4,
        "STEP_04_LIFE_PATH_VS_DESTINY",
        "Bước 4 - Đường Đời đối chiếu Sứ Mệnh",
        "fallback",
        [],
        buildLifePathVsDestinyFallback(data),
        "Bản chuyên sâu sẽ bóc tách mâu thuẫn giữa con đường và hành trang.",
        false
      ),
      section(
        5,
        "STEP_05_SOUL",
        "Bước 5 - Linh Hồn",
        "library",
        data.routing.soul_blocks,
        joinBlockContents(data.routing.soul_blocks),
        "Linh Hồn là lớp cần đọc kỹ nếu bạn muốn hiểu nhu cầu thật bên trong.",
        false
      ),
      section(
        6,
        "STEP_06_SOUL_RELATIONSHIPS",
        "Bước 6 - Linh Hồn trong quan hệ",
        "fallback",
        [],
        buildSoulRelationshipsFallback(data),
        "Bản chuyên sâu sẽ đọc nhu cầu bên trong khi đi vào tình cảm, gia đình và hợp tác.",
        false
      ),
      section(
        7,
        "STEP_07_BIRTHDAY",
        "Bước 7 - Ngày Sinh",
        "library",
        data.routing.birthday_blocks,
        joinBlockContents(data.routing.birthday_blocks),
        "Ngày Sinh là món quà, nhưng cần đi cùng kỷ luật vận hành.",
        false
      ),
      section(
        8,
        "STEP_08_CORE_CONFLICT_SUMMARY",
        "Bước 8 - Tóm tắt xung đột cốt lõi",
        "fallback",
        [],
        buildCoreConflictFallback(data),
        "Đây là phần nên đọc sâu để tìm mô thức lặp và hướng chuyển hóa.",
        false
      ),
      section(
        9,
        "STEP_09_IMPORTANCE_OF_RESOLUTION",
        "Bước 9 - Vì sao cần hóa giải",
        "fallback",
        [],
        buildResolutionImportanceFallback(data),
        "Bản chuyên sâu tập trung vào lộ trình hành động, không dùng ngôn ngữ hù dọa.",
        false
      ),
      section(
        10,
        "STEP_10_ADDITIONAL_NUMBERS_PREVIEW",
        "Bước 10 - Gợi mở các chỉ số bổ sung",
        "fallback",
        [],
        buildAdditionalPreview(data),
        "Các chỉ số bổ sung sẽ giúp bản đồ bớt một chiều.",
        false
      ),
      section(
        11,
        "STEP_11_SERVICE_ECOSYSTEM",
        "Bước 11 - Hệ sinh thái dịch vụ",
        "cta",
        [],
        buildServiceEcosystem(data),
        "Chọn gói phù hợp nếu bạn muốn Brian đọc sâu hơn trong vòng 3 ngày ưu đãi 20%.",
        false
      )
    ];
  }

  function buildFullReportText(data, sections) {
    const sectionTexts = sections.map((item) => {
      return [
        "============================================================",
        item.title.toUpperCase(),
        "============================================================",
        "",
        item.content,
        item.upsell_hook ? `\nGợi mở: ${item.upsell_hook}` : ""
      ].join("\n");
    });

    return [buildCoverText(data), ...sectionTexts].join("\n\n");
  }

  function attachReport(data) {
    const sections = buildReportSections(data);
    data.report = {
      format: "web",
      sections,
      full_report_text: buildFullReportText(data, sections)
    };
    return data;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function textToHtml(text) {
    const blocks = String(text || "").trim().split(/\n{2,}/);

    return blocks
      .map((block) => {
        const escaped = escapeHtml(block).replace(/\n/g, "<br>");
        return `<p>${escaped}</p>`;
      })
      .join("");
  }

  function getElement(id) {
    if (typeof document === "undefined") {
      return null;
    }

    return document.getElementById(id);
  }

  function showValidationError(errors) {
    const container = getElement("formErrors");
    if (!container) {
      return;
    }

    const list = Array.isArray(errors) ? errors : [errors];
    container.hidden = false;
    container.innerHTML = `<ul>${list.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>`;
  }

  function clearValidationErrors() {
    const container = getElement("formErrors");
    if (!container) {
      return;
    }

    container.hidden = true;
    container.innerHTML = "";
  }

  function getFormInput() {
    return {
      full_name_original: getElement("fullName")?.value.trim() || "",
      birth_date: getElement("birthDate")?.value.trim() || "",
      phone_or_zalo: getElement("phoneOrZalo")?.value.trim() || "",
      email: getElement("email")?.value.trim() || "",
      gender: getElement("gender")?.value || "khong_cung_cap",
      note: getElement("note")?.value.trim() || "",
      consent_to_contact: Boolean(getElement("consentToContact")?.checked)
    };
  }

  function validateBaseInput(input) {
    const errors = [];
    const normalizedName = normalizeVietnameseName(input.full_name_original);
    const nameParts = splitVietnameseName(normalizedName);
    const parsedDate = parseBirthDate(input.birth_date);

    if (!input.full_name_original.trim()) {
      errors.push("Vui lòng nhập họ tên khai sinh đầy đủ.");
    } else if (nameParts.word_count < 2) {
      errors.push("Họ tên khai sinh cần tối thiểu 2 từ.");
    }

    if (!parsedDate.is_valid) {
      errors.push(parsedDate.error);
    }

    return errors;
  }

  function validateContactRequirement(reason) {
    const input = getFormInput();
    const errors = [];

    if (!input.phone_or_zalo) {
      errors.push(`Để ${reason}, vui lòng nhập số điện thoại/Zalo.`);
    }

    if (!input.consent_to_contact) {
      errors.push(`Để ${reason}, vui lòng tick đồng ý để Brian liên hệ.`);
    }

    if (errors.length) {
      showValidationError(errors);
      getElement("phoneOrZalo")?.focus();
      return false;
    }

    return true;
  }

  function renderCalculationSummary(data) {
    const container = getElement("calculationSummary");
    const content = getElement("summaryContent");
    if (!container || !content) {
      return;
    }

    const karmic = data.karmic_debts.length ? data.karmic_debts.join(", ") : "Không có";
    const intermediateMasters = data.master_numbers.intermediate_master_numbers.length
      ? data.master_numbers.intermediate_master_numbers
          .map((item) => `${item.value} (${item.appears_in.join(", ")})`)
          .join("; ")
      : "Không có";
    const items = [
      ["Tên chuẩn hóa", data.normalized.full_name, true],
      ["Đường Đời", data.core_numbers.life_path, false],
      ["Sứ Mệnh", data.core_numbers.destiny, false],
      ["Linh Hồn", data.core_numbers.soul, false],
      ["Ngày Sinh", data.core_numbers.birthday, false],
      ["Nhân Cách", data.core_numbers.personality, false],
      ["Master Number", intermediateMasters, true],
      ["Karmic Debt", karmic, true],
      [
        "Audit",
        `letter_count=${data.calculation_audit.letter_count}, number_count=${data.calculation_audit.number_count}, is_valid=${data.calculation_audit.is_valid}`,
        true
      ]
    ];

    content.innerHTML = items
      .map(
        ([label, value, wide]) =>
          `<div class="summary-item${wide ? " wide" : ""}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`
      )
      .join("");
    container.hidden = false;
  }

  function renderReportAccordion(sections) {
    const panel = getElement("reportPanel");
    const accordion = getElement("reportAccordion");
    if (!panel || !accordion) {
      return;
    }

    accordion.innerHTML = sections
      .map(
        (item, index) => `
          <details ${index === 0 ? "open" : ""}>
            <summary><span>${escapeHtml(item.title)}</span></summary>
            <div class="accordion-body">${textToHtml(item.content)}${
          item.upsell_hook ? `<p><strong>Gợi mở:</strong> ${escapeHtml(item.upsell_hook)}</p>` : ""
        }</div>
          </details>
        `
      )
      .join("");
    panel.hidden = false;
  }

  function renderReportIntro(data) {
    const intro = getElement("reportIntro");
    if (!intro) {
      return;
    }

    intro.innerHTML = textToHtml(buildCoverText(data));
  }

  function renderPackages() {
    const grid = getElement("packagesGrid");
    if (!grid) {
      return;
    }

    grid.innerHTML = Object.entries(SERVICE_PACKAGES)
      .map(
        ([key, pack]) => `
          <article class="package-card">
            <div>
              <h3>${escapeHtml(pack.display_name)}</h3>
              <p>${escapeHtml(pack.short_description)}</p>
            </div>
            <button class="secondary-button package-button" type="button" data-package-key="${escapeHtml(key)}">Tôi quan tâm gói này</button>
          </article>
        `
      )
      .join("");

    grid.querySelectorAll(".package-button").forEach((button) => {
      button.addEventListener("click", () => handlePackageClick(button.dataset.packageKey));
    });
  }

  function renderComputedData(data, options = {}) {
    currentReportData = attachReport(data);
    renderCalculationSummary(currentReportData);
    renderReportIntro(currentReportData);
    renderReportAccordion(currentReportData.report.sections);

    if (options.saveLead !== false) {
      currentReportData.lead = buildLeadData(currentReportData, {
        status: "report_generated"
      });
      saveLead(currentReportData.lead);
    }

    getElement("reportPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildLeadData(data, overrides = {}) {
    const input = getFormInput();
    const now = new Date().toISOString();
    const existingLead = data?.lead || {};

    return {
      lead_id: currentLeadId || existingLead.lead_id || `lead_${Date.now()}`,
      created_at: existingLead.created_at || now,
      updated_at: now,
      status: overrides.status || existingLead.status || "new",
      requested_pdf: Boolean(overrides.requested_pdf ?? existingLead.requested_pdf),
      requested_paid_report: Boolean(overrides.requested_paid_report ?? existingLead.requested_paid_report),
      selected_package: overrides.selected_package ?? selectedPackage ?? existingLead.selected_package ?? null,
      consent_to_contact: input.consent_to_contact,
      full_name_original: data?.input?.full_name_original || input.full_name_original,
      birth_date: data?.input?.birth_date || input.birth_date,
      phone_or_zalo: input.phone_or_zalo || data?.input?.phone_or_zalo || "",
      email: input.email || data?.input?.email || "",
      gender: input.gender || data?.input?.gender || "khong_cung_cap",
      note: input.note || data?.input?.note || "",
      normalized_full_name: data?.normalized?.full_name || "",
      core_numbers: data?.core_numbers || {},
      karmic_debts: data?.karmic_debts || [],
      routing: data?.routing || {},
      calculation_audit: data?.calculation_audit || {}
    };
  }

  function getStoredLeads() {
    if (typeof localStorage === "undefined") {
      return [];
    }

    try {
      const raw = localStorage.getItem(LEADS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn(error);
      return [];
    }
  }

  function saveLead(leadData) {
    if (typeof localStorage === "undefined") {
      return leadData;
    }

    const leads = getStoredLeads();
    const now = new Date().toISOString();
    const lead = {
      ...leadData,
      updated_at: now
    };
    const existingIndex = leads.findIndex((item) => item.lead_id === lead.lead_id);

    if (existingIndex >= 0) {
      leads[existingIndex] = {
        ...leads[existingIndex],
        ...lead,
        created_at: leads[existingIndex].created_at || lead.created_at || now
      };
    } else {
      leads.push({
        ...lead,
        created_at: lead.created_at || now
      });
    }

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    currentLeadId = lead.lead_id;

    return lead;
    // Phase 2: thay hàm này bằng Google Apps Script Web App POST đến Google Sheet.
  }

  function updateLeadStatus(status, overrides = {}) {
    if (!currentReportData) {
      return null;
    }

    const existingLead = currentReportData.lead || {};
    const extra = {
      status,
      requested_pdf:
        overrides.requested_pdf ?? (status === "pdf_requested" ? true : Boolean(existingLead.requested_pdf)),
      requested_paid_report:
        overrides.requested_paid_report ??
        (status === "paid_report_requested" ? true : Boolean(existingLead.requested_paid_report)),
      selected_package: overrides.selected_package ?? selectedPackage ?? existingLead.selected_package ?? null
    };
    currentReportData.lead = buildLeadData(currentReportData, extra);
    return saveLead(currentReportData.lead);
  }

  function csvEscape(value) {
    const text = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadBlob(filename, content, mimeType) {
    if (typeof document === "undefined" || typeof Blob === "undefined") {
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadLeadsCsv() {
    const leads = getStoredLeads();

    if (!leads.length) {
      showValidationError("Chưa có lead nào trong localStorage để tải CSV.");
      return;
    }

    const headers = [
      "lead_id",
      "created_at",
      "updated_at",
      "status",
      "full_name_original",
      "birth_date",
      "phone_or_zalo",
      "email",
      "gender",
      "selected_package",
      "requested_pdf",
      "requested_paid_report",
      "consent_to_contact",
      "normalized_full_name",
      "core_numbers",
      "karmic_debts"
    ];
    const rows = leads.map((lead) => headers.map((header) => csvEscape(lead[header])).join(","));
    downloadBlob("brian-numerologist-leads.csv", [headers.join(","), ...rows].join("\n"), "text/csv;charset=utf-8");
  }

  function downloadTxt() {
    if (!currentReportData) {
      showValidationError("Vui lòng tạo báo cáo trước khi tải TXT.");
      return;
    }

    updateLeadStatus("txt_downloaded");
    const normalized = currentReportData.normalized.full_name.toLowerCase().replace(/\s+/g, "-");
    downloadBlob(
      `brian-numerologist-free-${normalized}.txt`,
      currentReportData.report.full_report_text,
      "text/plain;charset=utf-8"
    );
  }

  function printPdf() {
    if (!currentReportData) {
      showValidationError("Vui lòng tạo báo cáo trước khi In/Lưu PDF.");
      return;
    }

    if (!validateContactRequirement("In/Lưu PDF")) {
      return;
    }

    updateLeadStatus("pdf_requested", { requested_pdf: true });
    openAllSections();
    window.print();
  }

  function openAllSections() {
    if (typeof document === "undefined") {
      return;
    }

    document.querySelectorAll("#reportAccordion details").forEach((detail) => {
      detail.open = true;
    });
  }

  function closeAllSections() {
    if (typeof document === "undefined") {
      return;
    }

    document.querySelectorAll("#reportAccordion details").forEach((detail, index) => {
      detail.open = index === 0;
    });
  }

  function handlePackageClick(packageKey) {
    selectedPackage = packageKey;
    const pack = SERVICE_PACKAGES[packageKey];
    const box = getElement("packageInterestBox");
    const name = getElement("selectedPackageName");

    if (box && name && pack) {
      name.textContent = pack.display_name;
      box.hidden = false;
    }

    if (!currentReportData) {
      showValidationError("Hãy tạo báo cáo FREE trước, sau đó chọn gói để lưu đúng lead.");
      getElement("leadForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (!validateContactRequirement("chọn gói chuyên sâu")) {
      currentReportData.lead = buildLeadData(currentReportData, {
        selected_package: packageKey,
        requested_paid_report: true,
        status: currentReportData.lead.status || "report_generated"
      });
      saveLead(currentReportData.lead);
      return;
    }

    updateLeadStatus("paid_report_requested", {
      selected_package: packageKey,
      requested_paid_report: true
    });
  }

  function assertEqual(errors, label, actual, expected) {
    if (actual !== expected) {
      errors.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  function assertArrayEqual(errors, label, actual, expected) {
    const actualJson = JSON.stringify(actual);
    const expectedJson = JSON.stringify(expected);
    if (actualJson !== expectedJson) {
      errors.push(`${label}: expected ${expectedJson}, got ${actualJson}`);
    }
  }

  function assertIncludes(errors, label, actual, expectedValue) {
    if (!actual.includes(expectedValue)) {
      errors.push(`${label}: missing ${expectedValue}`);
    }
  }

  function runTestCase001() {
    const errors = [];
    const data = attachReport(
      calculateAll({
        full_name_original: "Nguyễn Thanh Trí",
        birth_date: "21/04/1986",
        phone_or_zalo: "",
        email: "",
        gender: "khong_cung_cap",
        note: "",
        consent_to_contact: false
      })
    );
    const firstNameConsonants = data.calculation_debug.personality_calculation.parts.find(
      (part) => part.part_name === "first_name_consonants"
    );
    const lastNameVowels = data.calculation_debug.soul_calculation.parts.find(
      (part) => part.part_name === "last_name_vowels"
    );

    assertEqual(errors, "normalized.full_name", data.normalized.full_name, "NGUYEN THANH TRI");
    assertEqual(errors, "last_name", data.normalized.last_name, "NGUYEN");
    assertEqual(errors, "middle_name_group", data.normalized.middle_name_group, "THANH");
    assertEqual(errors, "first_name", data.normalized.first_name, "TRI");
    assertEqual(errors, "letter_count", data.calculation_audit.letter_count, 14);
    assertEqual(errors, "number_count", data.calculation_audit.number_count, 14);
    assertEqual(errors, "is_valid", data.calculation_audit.is_valid, true);
    assertEqual(errors, "life_path", data.core_numbers.life_path, "13/4");
    assertEqual(errors, "life_path_base", data.core_numbers.life_path_base, 4);
    assertEqual(errors, "destiny", data.core_numbers.destiny, "13/4");
    assertEqual(errors, "destiny_base", data.core_numbers.destiny_base, 4);
    assertEqual(errors, "soul", data.core_numbers.soul, "16/7");
    assertEqual(errors, "soul_base", data.core_numbers.soul_base, 7);
    assertEqual(errors, "birthday", data.core_numbers.birthday, "21/3");
    assertEqual(errors, "birthday_base", data.core_numbers.birthday_base, 3);
    assertEqual(errors, "birthday original_day", data.calculation_debug.birthday_calculation.original_day, 21);
    assertEqual(errors, "birthday route", data.calculation_debug.birthday_calculation.route_block_id, "BIRTHDAY_21");
    assertEqual(errors, "personality", data.core_numbers.personality, "24/6");
    assertEqual(errors, "personality_base", data.core_numbers.personality_base, 6);
    assertArrayEqual(errors, "routing.life_path_blocks", data.routing.life_path_blocks, [
      "LIFEPATH_4",
      "KARMIC_OVERLAY_13_4"
    ]);
    assertArrayEqual(errors, "routing.destiny_blocks", data.routing.destiny_blocks, [
      "DESTINY_4",
      "KARMIC_OVERLAY_13_4"
    ]);
    assertArrayEqual(errors, "routing.soul_blocks", data.routing.soul_blocks, [
      "SOUL_7",
      "KARMIC_OVERLAY_16_7"
    ]);
    assertArrayEqual(errors, "routing.birthday_blocks", data.routing.birthday_blocks, ["BIRTHDAY_21"]);
    assertArrayEqual(errors, "first_name_consonants.letters", firstNameConsonants?.letters || [], ["T", "R"]);
    assertEqual(errors, "first_name_consonants.raw_total", firstNameConsonants?.raw_total, 11);
    assertIncludes(errors, "last_name_vowels", lastNameVowels?.letters || [], "Y");
    assertArrayEqual(errors, "karmic_debts", data.karmic_debts, ["13/4", "16/7"]);
    assertEqual(errors, "report.sections.length", data.report.sections.length, 11);
    assertIncludes(errors, "full_report_text", data.report.full_report_text, "Ưu đãi 20%");

    const result = {
      test_case_id: "TEST_CASE_001",
      pass: errors.length === 0,
      errors,
      data
    };

    displayTestResult(result);
    return result;
  }

  function displayTestResult(result) {
    const card = getElement("testResultCard");
    const content = getElement("testResultContent");
    if (!card || !content) {
      return;
    }

    card.hidden = false;
    content.innerHTML = result.pass
      ? `<div class="test-pass"><strong>PASS</strong><br>TEST_CASE_001 chạy đúng: Nguyễn Thanh Trí, 21/04/1986 ra life_path 13/4, destiny 13/4, soul 16/7, birthday BIRTHDAY_21, personality 24/6.</div>`
      : `<div class="test-fail"><strong>FAIL</strong><ul>${result.errors
          .map((error) => `<li>${escapeHtml(error)}</li>`)
          .join("")}</ul></div>`;
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    clearValidationErrors();

    const input = getFormInput();
    const validationErrors = validateBaseInput(input);

    if (validationErrors.length) {
      showValidationError(validationErrors);
      return;
    }

    try {
      const data = calculateAll(input);
      renderComputedData(data);
    } catch (error) {
      showValidationError(error.message);
    }
  }

  function fillFormWithTestCase() {
    const fullName = getElement("fullName");
    const birthDate = getElement("birthDate");
    if (fullName) fullName.value = "Nguyễn Thanh Trí";
    if (birthDate) birthDate.value = "21/04/1986";
  }

  async function init() {
    renderPackages();

    const status = getElement("libraryStatus");
    try {
      const result = await loadContentLibraries();
      if (status) {
        status.textContent = result.used_fallback
          ? "Đang dùng fallback content trong app.js."
          : `Đã tải ${result.loaded_count} content blocks từ ${result.loaded_files} file TXT.`;
      }
    } catch (error) {
      if (status) {
        status.textContent = "Không tải được thư viện TXT, đang dùng fallback content.";
      }
    }

    getElement("leadForm")?.addEventListener("submit", handleFormSubmit);
    getElement("downloadTxtButton")?.addEventListener("click", downloadTxt);
    getElement("printPdfButton")?.addEventListener("click", printPdf);
    getElement("downloadCsvButton")?.addEventListener("click", downloadLeadsCsv);
    getElement("openAllButton")?.addEventListener("click", openAllSections);
    getElement("closeAllButton")?.addEventListener("click", closeAllSections);
    getElement("runTestButton")?.addEventListener("click", () => {
      clearValidationErrors();
      fillFormWithTestCase();
      const result = runTestCase001();
      if (result.pass) {
        renderComputedData(result.data, { saveLead: false });
      }
    });
  }

  const api = {
    PYTHAGORAS_MAP,
    VOWELS,
    KARMIC_VALUES,
    MASTER_VALUES,
    normalizeVietnameseName,
    splitVietnameseName,
    letterToNumber,
    isVowel,
    isConsonant,
    sumDigits,
    reduceWithSpecialNumbers,
    calculateLifePath,
    calculateDestiny: (parts) => calculateNameNumber(parts, "destiny", "all"),
    calculateSoul: (parts) => calculateNameNumber(parts, "soul", "vowels"),
    calculatePersonality: (parts) => calculateNameNumber(parts, "personality", "consonants"),
    calculateBirthday,
    calculateAll,
    buildRouting,
    loadContentLibraries,
    parseBlocksFromText,
    getBlockContent,
    getFallbackBlockContent,
    buildReportSections,
    buildFullReportText,
    renderReportAccordion,
    downloadTxt,
    printPdf,
    buildLeadData,
    saveLead,
    updateLeadStatus,
    downloadLeadsCsv,
    runTestCase001,
    assertEqual,
    displayTestResult,
    handleFormSubmit,
    showValidationError,
    clearValidationErrors,
    handlePackageClick,
    openAllSections,
    closeAllSections
  };

  if (typeof window !== "undefined") {
    window.BrianNumerologist = api;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BrianNumerologist = api;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
