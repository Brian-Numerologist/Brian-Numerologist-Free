(function () {
  "use strict";

  const BRAND = "BRIAN-NUMEROLOGIST";
  const CONSULTANT = "BRIAN";
  const ZALO_PHONE = "0948909983";
  const LEADS_STORAGE_KEY = "brian_numerologist_free_leads_v1";
  const PENDING_LEADS_STORAGE_KEY = "brian_numerologist_pending_leads";
  const LEAD_ID_STORAGE_KEY = "brian_numerologist_current_lead_id";
  const PRINT_VIEW_STORAGE_KEY = "brian_numerologist_print_view_report_data";
  const APP_VERSION = "free_mvp_v1_phase4_lead_crm";
  const BIRTH_DATE_ERROR_MESSAGE = "Ngày sinh chưa hợp lệ. Anh/chị có thể nhập 27081962 hoặc 27/08/1962.";
  const GOOGLE_SHEET_CONFIG = {
    google_apps_script_web_app_url: "https://script.google.com/macros/s/AKfycby5GujG0AlO6fpZA69LoF0IiD8t6oaEjE2FyeaNIpTfGROwiSNtPKhaDYeigzDEAdCQ/exec",
    google_sheet_url: "https://docs.google.com/spreadsheets/d/11q34k1QhhgSwishOx9QqFabRrjvElbpRfU6PE5UlmrM/edit?gid=0#gid=0",
    google_sheet_name: "Brian_Numerologist_FREE_Leads",
    shared_secret: "CHANGE_ME_PHASE2_SECRET",
    enable_google_sheet_sync: true,
    fallback_to_local_storage: true
  };
  const PUBLIC_UI_CONFIG = Object.freeze({
    show_admin_link: false,
    show_lead_csv_export: false,
    show_debug_tools: false
  });

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
      price: 199000,
      price_display: "199.000đ",
      short_description: "4 chỉ số cốt lõi, PDF 80 trang và 25 phút tư vấn.",
      category: "personal"
    },
    lo_trinh_giai_ma: {
      display_name: "Lộ Trình Giải Mã",
      price: 399000,
      price_display: "399.000đ",
      short_description: "Phân tích cá nhân đầy đủ hơn, PDF 120 trang và 45 phút tư vấn.",
      category: "personal"
    },
    ban_do_kien_tao: {
      display_name: "Bản Đồ Kiến Tạo",
      price: 499000,
      price_display: "499.000đ",
      short_description: "Phân tích năng lượng cá nhân, dự báo giai đoạn và định hướng phát triển.",
      category: "personal"
    },
    doanh_nghiep_khoi_nghiep: {
      display_name: "Thần Số Học Doanh Nghiệp - Gói Khởi Nghiệp",
      price: 1688000,
      price_display: "1.688.000đ",
      short_description: "Phân tích chủ doanh nghiệp, tên/ngày vận hành, HR định hướng và 120 phút tư vấn.",
      category: "business"
    },
    doanh_nghiep_doanh_nghiep: {
      display_name: "Thần Số Học Doanh Nghiệp - Gói Doanh Nghiệp",
      price: 2368000,
      price_display: "2.368.000đ",
      short_description: "Phân tích chủ doanh nghiệp, tương thích doanh nghiệp, thời điểm vàng và 150 phút tư vấn.",
      category: "business"
    },
    cap_doi_moi_quan_he: {
      display_name: "Gói Cặp Đôi / Mối Quan Hệ",
      price: 1399000,
      price_display: "1.399.000đ",
      short_description: "Phân tích 2 người, tương thích quan hệ, dự báo phát triển và 120 phút tư vấn.",
      category: "relationship"
    }
  });

  const SERVICE_ADDONS = Object.freeze({
    tuong_thich_moi_quan_he: {
      display_name: "Đánh Giá Tương Thích Mối Quan Hệ",
      price: 499000,
      price_display: "499.000đ",
      short_description: "Đọc tương thích theo chỉ số cốt lõi và chu kỳ thời điểm."
    },
    ten_phu_nickname: {
      display_name: "Tư Vấn Tên Phụ/Nickname Cải Vận",
      price: 149000,
      price_display: "149.000đ",
      short_description: "Gợi ý tên phụ/nickname và phân tích các phương án phù hợp."
    },
    dinh_huong_nghe_nghiep: {
      display_name: "Định Hướng Nghề Nghiệp",
      price: 149000,
      price_display: "149.000đ",
      short_description: "Gợi ý nhóm nghề và đọc một lựa chọn cá nhân đang cân nhắc."
    },
    checklist_3_thang: {
      display_name: "Checklist 3 Tháng Cá Nhân",
      price: 139000,
      price_display: "139.000đ",
      short_description: "Checklist hành động theo ngày trong 3 tháng."
    },
    checklist_6_thang: {
      display_name: "Checklist 6 Tháng",
      price: 239000,
      price_display: "239.000đ",
      short_description: "Checklist cá nhân và lịch hành động 6 tháng."
    },
    checklist_12_thang: {
      display_name: "Checklist 12 Tháng",
      price: 399000,
      price_display: "399.000đ",
      short_description: "Checklist cá nhân và lịch hành động 12 tháng."
    }
  });

  const LEAD_STATUS_LABELS = Object.freeze({
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
    invalid_contact: "Liên hệ không hợp lệ",
    txt_downloaded: "Đã tải TXT"
  });

  const LEAD_STATUS_HEAT = Object.freeze({
    new_report_generated: "warm",
    pdf_downloaded: "warm",
    package_clicked: "hot",
    addon_clicked: "hot",
    zalo_submitted: "very_hot",
    contacted: "hot",
    consulted: "hot",
    converted: "converted",
    not_ready: "cold",
    no_response: "warm",
    invalid_contact: "cold",
    txt_downloaded: "warm"
  });

  const MESSAGE_TEMPLATE_FALLBACKS = Object.freeze({
    report_generated_intro:
      "Chào {{full_name}}, Brian đã thấy bạn vừa tạo bản FREE. Bản này mở 4 trụ cột đầu tiên: Đường Đời {{life_path}}, Sứ Mệnh {{destiny}}, Linh Hồn {{soul}}. Nếu bạn muốn Brian đọc sâu hơn theo bối cảnh hiện tại, mình có thể gợi ý hướng phù hợp.",
    pdf_downloaded_followup:
      "Chào {{full_name}}, bạn đã lưu bản PDF FREE. Nếu phần nào trong báo cáo khiến bạn thấy đúng với mình, Brian có thể giúp đọc sâu hơn để biến thông tin thành hướng hành động rõ ràng.",
    package_clicked_hot:
      "Chào {{full_name}}, Brian thấy bạn quan tâm gói {{selected_package}}. Với bản đồ hiện tại, gợi ý nhẹ là {{recommended_package}}. Nếu tiện, mình có thể tư vấn nhanh để bạn chọn đúng mức cần thiết.",
    discount_reminder:
      "Chào {{full_name}}, nhắc nhẹ bạn đang có ưu đãi {{discount_percent}}% trong {{discount_days}} ngày sau bản FREE. Ưu đãi chỉ là hỗ trợ quyết định, quan trọng nhất vẫn là chọn đúng gói phù hợp với nhu cầu hiện tại.",
    consultation_booking:
      "Chào {{full_name}}, nếu bạn muốn đặt lịch tư vấn, hãy gửi Brian 2-3 khung giờ thuận tiện. Brian sẽ xác nhận lịch và chuẩn bị phần đọc trọng tâm cho bản đồ của bạn."
  });

  const PRINT_TOC_ITEMS = Object.freeze([
    "Tính toán & nhận diện 4 chỉ số cốt lõi",
    "Đường Đời",
    "Sứ Mệnh",
    "Đường Đời vs Sứ Mệnh",
    "Linh Hồn",
    "Linh Hồn vs Đường Đời/Sứ Mệnh",
    "Ngày Sinh",
    "Tổng hợp mâu thuẫn chính",
    "Tầm quan trọng của hóa giải",
    "Các chỉ số bổ sung",
    "Hệ sinh thái dịch vụ"
  ]);

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
  let contentLibraryState = {
    loaded_count: 0,
    loaded_files: 0,
    used_fallback: true
  };
  let currentReportData = null;
  let currentLeadId = null;
  let selectedPackage = null;
  let selectedAddon = null;

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

  function normalizeBirthDateInput(value) {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  function parseBirthDate(birthDate) {
    const value = normalizeBirthDateInput(birthDate);
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

    if (!match) {
      return {
        is_valid: false,
        error: BIRTH_DATE_ERROR_MESSAGE
      };
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const currentYear = new Date().getFullYear();

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > currentYear) {
      return {
        is_valid: false,
        error: BIRTH_DATE_ERROR_MESSAGE
      };
    }

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return {
        is_valid: false,
        error: BIRTH_DATE_ERROR_MESSAGE
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

  function stripInternalNotes(text) {
    return String(text || "")
      .replace(/\r\n/g, "\n")
      .split(/\n=+\nIMPLEMENTATION NOTES\n=+\n/)[0]
      .trim();
  }

  function isInternalNotesStart(line) {
    const trimmed = String(line || "").trim();
    return (
      trimmed === "IMPLEMENTATION NOTES" ||
      /^=+$/.test(trimmed) ||
      /^Routing đề xuất:/i.test(trimmed) ||
      /^Ngôn ngữ cần tránh:/i.test(trimmed) ||
      /^Ngôn ngữ nên dùng:/i.test(trimmed)
    );
  }

  function parseBlocksFromText(text) {
    const blocks = {};
    const normalized = stripInternalNotes(text);
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
      contentLibraryState = {
        loaded_count: 0,
        loaded_files: 0,
        used_fallback: true
      };
      return contentLibraryState;
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
    const loadedCount = Object.keys(loadedBlocks).length;
    contentLibraryState = {
      loaded_count: loadedCount,
      loaded_files: loadedFiles,
      used_fallback: loadedCount === 0
    };
    return contentLibraryState;
  }

  function getContentLibraryState() {
    return { ...contentLibraryState };
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
    const raw = stripInternalNotes(getBlockContent(blockId));
    const lines = raw.replace(/\r\n/g, "\n").split("\n");
    const output = [];

    for (const line of lines) {
      if (isInternalNotesStart(line)) {
        break;
      }

      const keyMatch = /^([a-z_]+):\s*(.*)$/.exec(line.trim());

      if (!keyMatch) {
        output.push(line);
        continue;
      }

      const key = keyMatch[1];
      const value = keyMatch[2];

      if (METADATA_KEYS.has(key)) {
        continue;
      }

      const label = HUMAN_LABELS[key] || key.replace(/_/g, " ");
      output.push(value ? `${label}: ${value}` : `${label}:`);
    }

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

  function showToast(message, type = "info") {
    if (typeof document === "undefined") {
      return;
    }

    const container = getElement("toast-container");
    if (!container) {
      return;
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 4200);
  }

  function getGoogleSheetConfig() {
    const externalConfig =
      (typeof window !== "undefined" &&
        (window.BRIAN_NUMEROLOGIST_GOOGLE_SHEET_CONFIG || window.GOOGLE_SHEET_CONFIG)) ||
      {};

    return {
      ...GOOGLE_SHEET_CONFIG,
      ...externalConfig
    };
  }

  function buildLocalAdminStats() {
    const leads = getStoredLeads();
    const totals = {
      total_leads: leads.length,
      pdf_downloaded: 0,
      package_clicked: 0,
      addon_clicked: 0,
      zalo_submitted: 0,
      very_hot_leads: 0,
      converted: 0
    };
    const packages = {};

    leads.forEach((lead) => {
      const status = normalizeLeadStatus(lead.lead_status || lead.status);
      if (status === "pdf_downloaded" || lead.requested_pdf) totals.pdf_downloaded += 1;
      if (lead.selected_package) {
        totals.package_clicked += 1;
        const label = lead.selected_package_name || getPackageDisplayName(lead.selected_package) || lead.selected_package;
        packages[label] = (packages[label] || 0) + 1;
      }
      if (lead.selected_addon) totals.addon_clicked += 1;
      if (lead.phone_or_zalo && lead.consent_to_contact) totals.zalo_submitted += 1;
      if ((lead.lead_temperature || getLeadHeat(status, lead)) === "very_hot") totals.very_hot_leads += 1;
      if (status === "converted") totals.converted += 1;
    });

    return {
      ok: true,
      source: "localStorage",
      updated_at: new Date().toISOString(),
      totals,
      funnel_rates: {
        report_to_pdf: totals.total_leads ? totals.pdf_downloaded / totals.total_leads : 0,
        pdf_to_package: totals.pdf_downloaded ? totals.package_clicked / totals.pdf_downloaded : 0,
        package_to_zalo: totals.package_clicked ? totals.zalo_submitted / totals.package_clicked : 0,
        zalo_to_converted: totals.zalo_submitted ? totals.converted / totals.zalo_submitted : 0
      },
      package_interest: Object.entries(packages).map(([name, count]) => ({ name, count })),
      followups: {
        urgent: leads.filter((lead) => lead.follow_up_status === "urgent").length,
        pending: leads.filter((lead) => lead.follow_up_status === "pending").length,
        retry: leads.filter((lead) => lead.follow_up_status === "retry").length
      }
    };
  }

  async function fetchGoogleSheetJson(action) {
    const config = getGoogleSheetConfig();
    if (!config.google_apps_script_web_app_url) {
      throw new Error("Google Apps Script Web App URL is not configured.");
    }
    const url = new URL(config.google_apps_script_web_app_url);
    url.searchParams.set("action", action);
    url.searchParams.set("shared_secret", config.shared_secret);
    const response = await fetch(url.toString(), { method: "GET" });
    const text = await response.text();
    let payload = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch (error) {
      throw new Error(text || "Invalid Google Sheet response.");
    }
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.message || "Google Sheet request failed.");
    }
    return payload;
  }

  async function fetchAdminStats() {
    const config = getGoogleSheetConfig();
    if (!config.enable_google_sheet_sync || !config.google_apps_script_web_app_url) {
      return buildLocalAdminStats();
    }
    try {
      return await fetchGoogleSheetJson("admin_stats");
    } catch (error) {
      console.warn(error);
      return {
        ...buildLocalAdminStats(),
        warning: error.message
      };
    }
  }

  function getLocalMessageTemplates() {
    return Object.entries(MESSAGE_TEMPLATE_FALLBACKS).map(([template_key, message_text]) => ({
      template_key,
      template_name: template_key.replace(/_/g, " "),
      message_text,
      is_active: true
    }));
  }

  async function fetchMessageTemplates() {
    const config = getGoogleSheetConfig();
    if (!config.enable_google_sheet_sync || !config.google_apps_script_web_app_url) {
      return {
        ok: true,
        source: "local",
        templates: getLocalMessageTemplates()
      };
    }
    try {
      return await fetchGoogleSheetJson("message_templates");
    } catch (error) {
      console.warn(error);
      return {
        ok: true,
        source: "local",
        warning: error.message,
        templates: getLocalMessageTemplates()
      };
    }
  }

  function generateLeadId() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(4, "X");

    return `LEAD_${datePart}_${timePart}_${randomPart}`;
  }

  function getOrCreateLeadId() {
    if (currentLeadId) {
      return currentLeadId;
    }

    if (typeof localStorage !== "undefined") {
      const storedLeadId = localStorage.getItem(LEAD_ID_STORAGE_KEY);
      if (storedLeadId) {
        currentLeadId = storedLeadId;
        return currentLeadId;
      }
    }

    currentLeadId = generateLeadId();

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LEAD_ID_STORAGE_KEY, currentLeadId);
    }

    return currentLeadId;
  }

  function detectDeviceType() {
    if (typeof navigator === "undefined") {
      return "unknown";
    }

    const ua = navigator.userAgent || "";

    if (/ipad|tablet|playbook|silk/i.test(ua)) {
      return "tablet";
    }

    if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) {
      return "mobile";
    }

    return "desktop";
  }

  function getEntryMode() {
    const value = getElement("entryMode")?.value;
    return value === "internal_entry" ? "internal_entry" : "customer_self";
  }

  function getSource() {
    if (typeof window === "undefined") {
      return "website";
    }

    const sourceFromUrl = new URLSearchParams(window.location.search).get("source");
    return sourceFromUrl || getElement("leadSource")?.value || "website";
  }

  function getSessionId() {
    const key = "brian_numerologist_session_id";
    if (typeof sessionStorage === "undefined") {
      return `SESSION_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    }

    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  function normalizeLeadStatus(status) {
    const map = {
      report_generated: "new_report_generated",
      pdf_requested: "pdf_downloaded",
      paid_report_requested: "package_clicked",
      paid_package_clicked: "package_clicked"
    };
    return map[status] || status || "new_report_generated";
  }

  function getLeadStatusLabel(status) {
    return LEAD_STATUS_LABELS[normalizeLeadStatus(status)] || "Mới";
  }

  function getLeadHeat(status, lead = {}) {
    const normalizedStatus = normalizeLeadStatus(status);
    if (normalizedStatus === "converted") {
      return "converted";
    }
    if (lead.phone_or_zalo && lead.consent_to_contact && ["package_clicked", "addon_clicked", "zalo_submitted"].includes(normalizedStatus)) {
      return "very_hot";
    }
    return LEAD_STATUS_HEAT[normalizedStatus] || "warm";
  }

  function getPackageByKey(packageKey) {
    return SERVICE_PACKAGES[packageKey] || null;
  }

  function getAddonByKey(addonKey) {
    return SERVICE_ADDONS[addonKey] || null;
  }

  function getPackageDisplayName(packageKey) {
    return getPackageByKey(packageKey)?.display_name || "";
  }

  function getAddonDisplayName(addonKey) {
    return getAddonByKey(addonKey)?.display_name || "";
  }

  function buildRecommendation(data = currentReportData, context = {}) {
    const clickedPackage = context.selected_package || selectedPackage;
    const clickedPackageData = getPackageByKey(clickedPackage);

    if (clickedPackageData?.category === "business") {
      return {
        recommended_package: clickedPackageData.display_name,
        recommendation_reason: "Bạn vừa quan tâm nhóm doanh nghiệp, nên Brian ưu tiên đọc theo bối cảnh kinh doanh hiện tại."
      };
    }

    if (clickedPackageData?.category === "relationship") {
      return {
        recommended_package: "Gói Cặp Đôi / Mối Quan Hệ",
        recommendation_reason: "Bạn vừa quan tâm nhóm quan hệ, nên hướng đọc nên đặt trọng tâm vào tương thích và cách phối hợp giữa hai người."
      };
    }

    const karmicDebts = data?.karmic_debts || [];
    const masterNumbers = [
      ...(data?.master_numbers?.primary_master_numbers || []),
      ...(data?.master_numbers?.intermediate_master_numbers || [])
    ];
    if (karmicDebts.length || masterNumbers.length) {
      return {
        recommended_package: "Bản Đồ Kiến Tạo",
        recommendation_reason: "Bản đồ có Karmic/Master cần đọc nhiều lớp hơn để tránh nhìn một chỉ số theo hướng quá đơn giản."
      };
    }

    const bases = [
      data?.core_numbers?.life_path_base,
      data?.core_numbers?.destiny_base,
      data?.core_numbers?.soul_base
    ];
    if (bases.includes(8)) {
      return {
        recommended_package: "Bản Đồ Kiến Tạo",
        recommendation_reason: "Năng lượng 8 liên quan nhiều đến quyền lực, tiền bạc, trách nhiệm và vận hành nguồn lực; nên đọc sâu theo chiến lược phát triển."
      };
    }

    if (context.event_type === "pdf_downloaded") {
      return {
        recommended_package: "Hạt Giống Thấu Hiểu hoặc Lộ Trình Giải Mã",
        recommendation_reason: "Bạn đã lưu bản FREE; bước phù hợp là chọn mức đọc vừa đủ để biến thông tin thành hướng hành động rõ hơn."
      };
    }

    return {
      recommended_package: "Lộ Trình Giải Mã",
      recommendation_reason: "Đây là gợi ý nhẹ để mở rộng từ 4 trụ cột đầu tiên sang các lớp bổ sung, không phải kết luận bắt buộc."
    };
  }

  function computeFollowUpStatus(status) {
    const normalizedStatus = normalizeLeadStatus(status);
    if (["package_clicked", "addon_clicked", "zalo_submitted"].includes(normalizedStatus)) {
      return "urgent";
    }
    if (normalizedStatus === "pdf_downloaded") {
      return "pending";
    }
    if (normalizedStatus === "no_response") {
      return "retry";
    }
    if (normalizedStatus === "not_ready") {
      return "nurture";
    }
    if (normalizedStatus === "converted") {
      return "done";
    }
    return "not_required_yet";
  }

  function addDaysIso(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function computeFollowUpDueDate(status) {
    const normalizedStatus = normalizeLeadStatus(status);
    if (["package_clicked", "addon_clicked", "zalo_submitted"].includes(normalizedStatus)) {
      return addDaysIso(0);
    }
    if (normalizedStatus === "pdf_downloaded") {
      return addDaysIso(1);
    }
    if (normalizedStatus === "no_response") {
      return addDaysIso(2);
    }
    if (normalizedStatus === "not_ready") {
      return addDaysIso(7);
    }
    return "";
  }

  function getFormInput() {
    return {
      full_name_original: getElement("fullName")?.value.trim() || "",
      birth_date: getElement("birthDate")?.value.trim() || "",
      phone_or_zalo: getElement("phoneOrZalo")?.value.trim() || "",
      email: getElement("email")?.value.trim() || "",
      gender: getElement("gender")?.value || "khong_cung_cap",
      entry_mode: getElement("entryMode")?.value || "customer_self",
      source: getElement("leadSource")?.value || getSource(),
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

    if (input.phone_or_zalo && !input.consent_to_contact) {
      errors.push("Nếu đã nhập số điện thoại/Zalo, vui lòng tick đồng ý để Brian-Numerologist lưu thông tin và liên hệ khi cần.");
    }

    return errors;
  }

  function validateContactRequirement(reason) {
    return validateContactConsentForPaidAction(reason);
  }

  function validateContactConsentForPaidAction(reason = "yêu cầu tư vấn hoặc bản chuyên sâu") {
    const input = getFormInput();
    const errors = [];
    const phoneField = getElement("phoneOrZalo");
    const consentField = getElement("consentToContact");

    if (!input.phone_or_zalo) {
      errors.push(`Để ${reason}, vui lòng nhập số điện thoại/Zalo.`);
    } else if (!isValidPhoneOrZalo(input.phone_or_zalo)) {
      errors.push("Số điện thoại/Zalo chưa hợp lệ. Vui lòng kiểm tra lại trước khi tiếp tục.");
    }

    if (!input.consent_to_contact) {
      errors.push(`Để ${reason}, vui lòng tick đồng ý để Brian liên hệ qua Zalo/SĐT nhằm tư vấn bản phân tích phù hợp.`);
    }

    phoneField?.classList.toggle("attention-field", !input.phone_or_zalo || !isValidPhoneOrZalo(input.phone_or_zalo));
    consentField?.classList.toggle("attention-field", !input.consent_to_contact);

    if (errors.length) {
      showValidationError(errors);
      getElement("leadForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
      phoneField?.focus();
      return false;
    }

    phoneField?.classList.remove("attention-field");
    consentField?.classList.remove("attention-field");
    return true;
  }

  function isValidPhoneOrZalo(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15;
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
          <details class="report-section" ${index === 0 ? "open" : ""}>
            <summary><span>${escapeHtml(item.title)}</span></summary>
            <div class="accordion-body report-section-content">${textToHtml(item.content)}${
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
              <strong class="package-price">${escapeHtml(pack.price_display)}</strong>
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

  function renderAddons() {
    const grid = getElement("addonsGrid");
    if (!grid) {
      return;
    }

    grid.innerHTML = Object.entries(SERVICE_ADDONS)
      .map(
        ([key, addon]) => `
          <article class="addon-card">
            <div>
              <h3>${escapeHtml(addon.display_name)}</h3>
              <strong class="package-price">${escapeHtml(addon.price_display)}</strong>
              <p>${escapeHtml(addon.short_description)}</p>
            </div>
            <button class="ghost-button addon-button" type="button" data-addon-key="${escapeHtml(key)}">Tôi quan tâm add-on</button>
          </article>
        `
      )
      .join("");

    grid.querySelectorAll(".addon-button").forEach((button) => {
      button.addEventListener("click", () => handleAddonClick(button.dataset.addonKey));
    });
  }

  function renderConversionCta(data = currentReportData) {
    const panel = getElement("conversionCta");
    const recommendationBox = getElement("recommendationBox");
    if (!panel || !data) {
      return;
    }

    const recommendation = buildRecommendation(data);
    if (recommendationBox) {
      recommendationBox.innerHTML = `
        <strong>Gợi ý nhẹ từ bản FREE: ${escapeHtml(recommendation.recommended_package)}</strong>
        <span>${escapeHtml(recommendation.recommendation_reason)}</span>
      `;
    }
    panel.hidden = false;
  }

  function renderComputedData(data, options = {}) {
    currentReportData = attachReport(data);
    renderCalculationSummary(currentReportData);
    renderReportIntro(currentReportData);
    renderReportAccordion(currentReportData.report.sections);
    preparePrintLayout(currentReportData);
    renderConversionCta(currentReportData);

    if (options.saveLead !== false) {
      updateLeadStatus("new_report_generated", {
        event_type: "report_generated"
      });
    }

    getElement("reportPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function formatMasterNumbersForLead(data) {
    const primary = data?.master_numbers?.primary_master_numbers || [];
    const intermediate = data?.master_numbers?.intermediate_master_numbers || [];
    const parts = [];

    primary.forEach((item) => {
      parts.push(`${item.value} primary`);
    });

    intermediate.forEach((item) => {
      parts.push(`${item.value} intermediate`);
    });

    return parts.join(", ");
  }

  function buildLeadData(data, overrides = {}) {
    const input = getFormInput();
    const now = new Date().toISOString();
    const existingLead = data?.lead || {};
    const leadId = overrides.lead_id || existingLead.lead_id || getOrCreateLeadId();
    const createdAt = existingLead.created_at || now;
    const selectedPackageValue = overrides.selected_package ?? selectedPackage ?? existingLead.selected_package ?? null;
    const selectedAddonValue = overrides.selected_addon ?? selectedAddon ?? existingLead.selected_addon ?? null;
    const packageData = getPackageByKey(selectedPackageValue);
    const addonData = getAddonByKey(selectedAddonValue);
    const coreNumbers = data?.core_numbers || {};
    const leadStatus = normalizeLeadStatus(overrides.lead_status || overrides.status || existingLead.lead_status || existingLead.status || "new_report_generated");
    const recommendation = buildRecommendation(data, {
      selected_package: selectedPackageValue,
      event_type: overrides.event_type || statusToEventType(leadStatus)
    });
    const leadDraft = {
      phone_or_zalo: input.phone_or_zalo || data?.input?.phone_or_zalo || "",
      consent_to_contact: input.consent_to_contact
    };
    const leadTemperature = overrides.lead_temperature || getLeadHeat(leadStatus, leadDraft);

    return {
      lead_id: leadId,
      created_at: createdAt,
      last_updated_at: now,
      updated_at: now,
      status: leadStatus,
      lead_status: leadStatus,
      lead_status_label: getLeadStatusLabel(leadStatus),
      lead_temperature: leadTemperature,
      requested_pdf: Boolean(overrides.requested_pdf ?? existingLead.requested_pdf),
      requested_paid_report: Boolean(overrides.requested_paid_report ?? existingLead.requested_paid_report),
      selected_package: selectedPackageValue,
      selected_package_name: packageData?.display_name || existingLead.selected_package_name || "",
      selected_package_price: packageData?.price || existingLead.selected_package_price || "",
      selected_package_price_display: packageData?.price_display || existingLead.selected_package_price_display || "",
      selected_addon: selectedAddonValue,
      selected_addon_name: addonData?.display_name || existingLead.selected_addon_name || "",
      selected_addon_price: addonData?.price || existingLead.selected_addon_price || "",
      selected_addon_price_display: addonData?.price_display || existingLead.selected_addon_price_display || "",
      recommended_package: recommendation.recommended_package,
      recommendation_reason: recommendation.recommendation_reason,
      consent_to_contact: input.consent_to_contact,
      full_name_original: data?.input?.full_name_original || input.full_name_original,
      birth_date: data?.input?.birth_date || input.birth_date,
      phone_or_zalo: input.phone_or_zalo || data?.input?.phone_or_zalo || "",
      zalo_phone: input.phone_or_zalo || data?.input?.phone_or_zalo || "",
      email: input.email || data?.input?.email || "",
      gender: input.gender || data?.input?.gender || "khong_cung_cap",
      note: input.note || data?.input?.note || "",
      entry_mode: input.entry_mode || getEntryMode(),
      source: input.source || getSource(),
      device_type: detectDeviceType(),
      normalized_full_name: data?.normalized?.full_name || "",
      normalized_name: data?.normalized?.full_name || "",
      life_path: coreNumbers.life_path || "",
      destiny: coreNumbers.destiny || "",
      soul: coreNumbers.soul || "",
      birthday: coreNumbers.birthday || "",
      personality: coreNumbers.personality || "",
      karmic_debts_text: (data?.karmic_debts || []).join(", "),
      master_numbers_text: formatMasterNumbersForLead(data),
      report_summary: `Đường Đời ${coreNumbers.life_path || ""}, Sứ Mệnh ${coreNumbers.destiny || ""}, Linh Hồn ${coreNumbers.soul || ""}`,
      last_action: overrides.event_type || statusToEventType(leadStatus),
      last_action_at: now,
      pdf_downloaded_at: leadStatus === "pdf_downloaded" ? now : existingLead.pdf_downloaded_at || "",
      package_clicked_at: leadStatus === "package_clicked" ? now : existingLead.package_clicked_at || "",
      addon_clicked_at: leadStatus === "addon_clicked" ? now : existingLead.addon_clicked_at || "",
      zalo_submitted_at: leadStatus === "zalo_submitted" ? now : existingLead.zalo_submitted_at || "",
      follow_up_status: overrides.follow_up_status || computeFollowUpStatus(leadStatus),
      follow_up_due_date: overrides.follow_up_due_date || computeFollowUpDueDate(leadStatus),
      follow_up_note: overrides.follow_up_note || existingLead.follow_up_note || "",
      contacted_at: existingLead.contacted_at || "",
      consulted_at: existingLead.consulted_at || "",
      converted_at: existingLead.converted_at || "",
      conversion_value: existingLead.conversion_value || "",
      consultant_note: existingLead.consultant_note || "",
      session_id: overrides.session_id || existingLead.session_id || getSessionId(),
      source_url: typeof window !== "undefined" ? window.location.href : "",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      event_count: Number(existingLead.event_count || 0) + 1,
      local_backup_id: existingLead.local_backup_id || `LOCAL_${Date.now()}`,
      core_numbers: coreNumbers,
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

  function saveLocalLead(leadData) {
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
    localStorage.setItem(LEAD_ID_STORAGE_KEY, currentLeadId);

    return lead;
  }

  function statusToEventType(status) {
    const map = {
      new_report_generated: "report_generated",
      pdf_downloaded: "pdf_downloaded",
      package_clicked: "package_clicked",
      addon_clicked: "addon_clicked",
      zalo_submitted: "zalo_submitted",
      paid_report_requested: "paid_report_requested"
    };
    return map[status] || status || "report_generated";
  }

  function buildLeadPayload(eventType, status, extraData = {}) {
    const lead = extraData.lead || buildLeadData(currentReportData, {
      ...extraData,
      status
    });
    const config = getGoogleSheetConfig();
    const normalizedStatus = normalizeLeadStatus(status || lead.lead_status || lead.status);
    const resolvedEventType = eventType || statusToEventType(normalizedStatus);

    return {
      shared_secret: config.shared_secret,
      event_type: resolvedEventType,
      event_id: `EVT_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      lead: {
        created_at: lead.created_at || "",
        last_updated_at: lead.last_updated_at || lead.updated_at || "",
        lead_id: lead.lead_id || "",
        full_name_original: lead.full_name_original || "",
        full_name: lead.full_name_original || "",
        birth_date: lead.birth_date || "",
        phone_or_zalo: lead.phone_or_zalo || "",
        zalo_phone: lead.zalo_phone || lead.phone_or_zalo || "",
        email: lead.email || "",
        gender: lead.gender || "",
        note: lead.note || "",
        consent_to_contact: Boolean(lead.consent_to_contact),
        consent: Boolean(lead.consent_to_contact),
        entry_mode: lead.entry_mode || "customer_self",
        source: lead.source || "website",
        device_type: lead.device_type || "unknown",
        normalized_name: lead.normalized_name || lead.normalized_full_name || "",
        life_path: lead.life_path || lead.core_numbers?.life_path || "",
        destiny: lead.destiny || lead.core_numbers?.destiny || "",
        soul: lead.soul || lead.core_numbers?.soul || "",
        birthday: lead.birthday || lead.core_numbers?.birthday || "",
        personality: lead.personality || lead.core_numbers?.personality || "",
        karmic_debts: lead.karmic_debts_text || (lead.karmic_debts || []).join(", "),
        karmic_debt: lead.karmic_debts_text || (lead.karmic_debts || []).join(", "),
        master_numbers: lead.master_numbers_text || "",
        master_number: lead.master_numbers_text || "",
        report_summary: lead.report_summary || "",
        selected_package: lead.selected_package || "",
        selected_package_name: lead.selected_package_name || getPackageDisplayName(lead.selected_package) || "",
        selected_package_price: lead.selected_package_price || "",
        selected_package_price_display: lead.selected_package_price_display || "",
        selected_addon: lead.selected_addon || "",
        selected_addon_name: lead.selected_addon_name || getAddonDisplayName(lead.selected_addon) || "",
        selected_addon_price: lead.selected_addon_price || "",
        selected_addon_price_display: lead.selected_addon_price_display || "",
        recommended_package: lead.recommended_package || "",
        recommendation_reason: lead.recommendation_reason || "",
        status: normalizedStatus,
        lead_status: normalizedStatus,
        lead_status_label: lead.lead_status_label || getLeadStatusLabel(normalizedStatus),
        lead_temperature: lead.lead_temperature || getLeadHeat(normalizedStatus, lead),
        last_action: resolvedEventType,
        last_action_at: lead.last_action_at || new Date().toISOString(),
        pdf_downloaded_at: lead.pdf_downloaded_at || "",
        package_clicked_at: lead.package_clicked_at || "",
        addon_clicked_at: lead.addon_clicked_at || "",
        zalo_submitted_at: lead.zalo_submitted_at || "",
        follow_up_status: lead.follow_up_status || computeFollowUpStatus(normalizedStatus),
        follow_up_due_date: lead.follow_up_due_date || computeFollowUpDueDate(normalizedStatus),
        follow_up_note: lead.follow_up_note || "",
        contacted_at: lead.contacted_at || "",
        consulted_at: lead.consulted_at || "",
        converted_at: lead.converted_at || "",
        conversion_value: lead.conversion_value || "",
        consultant_note: lead.consultant_note || "",
        source_url: lead.source_url || (typeof window !== "undefined" ? window.location.href : ""),
        user_agent: lead.user_agent || (typeof navigator !== "undefined" ? navigator.userAgent : ""),
        session_id: lead.session_id || getSessionId(),
        event_count: lead.event_count || 1,
        local_backup_id: lead.local_backup_id || ""
      },
      meta: {
        site_url: typeof window !== "undefined" ? window.location.href : "",
        app_version: APP_VERSION,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        screen_width: typeof window !== "undefined" ? window.innerWidth : "",
        screen_height: typeof window !== "undefined" ? window.innerHeight : "",
        session_id: lead.session_id || getSessionId()
      }
    };
  }

  async function saveLeadToGoogleSheet(payload) {
    const config = getGoogleSheetConfig();

    if (!config.enable_google_sheet_sync) {
      return {
        ok: true,
        skipped: true,
        message: "Google Sheet sync disabled."
      };
    }

    if (!config.google_apps_script_web_app_url) {
      throw new Error("Google Apps Script Web App URL is not configured.");
    }

    const response = await fetch(config.google_apps_script_web_app_url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    let result = {};

    try {
      result = text ? JSON.parse(text) : {};
    } catch (error) {
      result = {
        ok: response.ok,
        message: text
      };
    }

    if (!response.ok || result.ok === false) {
      throw new Error(result.message || "Google Sheet sync failed.");
    }

    showToast("Thông tin đã được ghi nhận.", "success");
    return result;
  }

  function getPendingLeads() {
    if (typeof localStorage === "undefined") {
      return [];
    }

    try {
      const raw = localStorage.getItem(PENDING_LEADS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn(error);
      return [];
    }
  }

  function savePendingLead(payload) {
    if (typeof localStorage === "undefined") {
      return payload;
    }

    const pending = getPendingLeads();
    const pendingItem = {
      pending_id: `PENDING_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      saved_at: new Date().toISOString(),
      attempts: 0,
      payload
    };
    pending.push(pendingItem);
    localStorage.setItem(PENDING_LEADS_STORAGE_KEY, JSON.stringify(pending));

    return pendingItem;
  }

  async function retryPendingLeads() {
    const config = getGoogleSheetConfig();
    const pending = getPendingLeads();

    if (!pending.length) {
      showToast("Không có lead lỗi đang chờ đồng bộ.", "info");
      return {
        synced: 0,
        remaining: 0
      };
    }

    if (!config.enable_google_sheet_sync || !config.google_apps_script_web_app_url) {
      showToast("Google Sheet sync chưa bật hoặc chưa có Web App URL.", "warning");
      return {
        synced: 0,
        remaining: pending.length
      };
    }

    const remaining = [];
    let synced = 0;

    for (const item of pending) {
      try {
        const payload = {
          ...item.payload,
          event_type: item.payload.event_type || "sync_retried"
        };
        await saveLeadToGoogleSheet(payload);
        synced += 1;
      } catch (error) {
        remaining.push({
          ...item,
          attempts: Number(item.attempts || 0) + 1,
          last_error: error.message,
          last_attempt_at: new Date().toISOString()
        });
      }
    }

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(PENDING_LEADS_STORAGE_KEY, JSON.stringify(remaining));
    }

    showToast(`Đã đồng bộ ${synced} lead. Còn lại ${remaining.length}.`, remaining.length ? "warning" : "success");

    return {
      synced,
      remaining: remaining.length
    };
  }

  function getPendingLeadCount() {
    return getPendingLeads().length;
  }

  function saveLead(payloadOrLead, options = {}) {
    const isPayload = Boolean(payloadOrLead && payloadOrLead.lead && payloadOrLead.event_type);
    const lead = isPayload ? payloadOrLead.lead : payloadOrLead;
    const eventType = isPayload ? payloadOrLead.event_type : options.event_type || statusToEventType(lead?.status);
    const status = lead?.status || options.status || "new";
    const localLead = saveLocalLead(lead);
    const payload = isPayload ? payloadOrLead : buildLeadPayload(eventType, status, { lead: localLead });
    const config = getGoogleSheetConfig();

    if (!config.enable_google_sheet_sync) {
      return localLead;
    }

    saveLeadToGoogleSheet(payload).catch((error) => {
      console.warn(error);
      savePendingLead(payload);
      showToast("Hệ thống sẽ đồng bộ lại sau.", "warning");
    });

    return localLead;
  }

  function updateLeadStatus(status, overrides = {}) {
    if (!currentReportData) {
      return null;
    }

    const existingLead = currentReportData.lead || {};
    const normalizedStatus = normalizeLeadStatus(status);
    const extra = {
      status: normalizedStatus,
      lead_status: normalizedStatus,
      event_type: overrides.event_type || statusToEventType(normalizedStatus),
      requested_pdf:
        overrides.requested_pdf ?? (normalizedStatus === "pdf_downloaded" ? true : Boolean(existingLead.requested_pdf)),
      requested_paid_report:
        overrides.requested_paid_report ??
        (normalizedStatus === "package_clicked" ? true : Boolean(existingLead.requested_paid_report)),
      selected_package: overrides.selected_package ?? selectedPackage ?? existingLead.selected_package ?? null,
      selected_addon: overrides.selected_addon ?? selectedAddon ?? existingLead.selected_addon ?? null
    };
    currentReportData.lead = buildLeadData(currentReportData, extra);
    return saveLead(currentReportData.lead, {
      event_type: overrides.event_type || statusToEventType(normalizedStatus),
      status: normalizedStatus
    });
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
      "lead_status",
      "lead_status_label",
      "lead_temperature",
      "full_name_original",
      "birth_date",
      "phone_or_zalo",
      "email",
      "gender",
      "note",
      "entry_mode",
      "source",
      "device_type",
      "selected_package",
      "selected_package_name",
      "selected_package_price",
      "selected_addon",
      "selected_addon_name",
      "selected_addon_price",
      "recommended_package",
      "recommendation_reason",
      "follow_up_status",
      "follow_up_due_date",
      "last_action",
      "last_action_at",
      "requested_pdf",
      "requested_paid_report",
      "consent_to_contact",
      "normalized_full_name",
      "life_path",
      "destiny",
      "soul",
      "birthday",
      "personality",
      "core_numbers",
      "karmic_debts",
      "master_numbers_text",
      "local_backup_id"
    ];
    const rows = leads.map((lead) => headers.map((header) => csvEscape(lead[header])).join(","));
    downloadBlob("brian-numerologist-leads.csv", [headers.join(","), ...rows].join("\n"), "text/csv;charset=utf-8");
  }

  function formatReportDate(date = new Date()) {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  function formatCustomerDisplayName(name) {
    return String(name || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("vi-VN")
      .split(" ")
      .map((word) => word ? word.charAt(0).toLocaleUpperCase("vi-VN") + word.slice(1) : word)
      .join(" ");
  }

  function renderPrintCover(data) {
    const container = getElement("print-cover");
    if (!container) {
      return;
    }

    const customerDisplayName = formatCustomerDisplayName(data.input.full_name_original);

    container.innerHTML = `
      <div class="print-cover__inner">
        <div>
          <div class="print-cover__brand">${escapeHtml(BRAND)}</div>
          <h1 class="print-cover__title">Bản đồ Thần số học FREE 11 bước</h1>
          <p class="print-cover__subtitle">Cửa mở đầu tiên để hiểu bản thân qua Họ tên và Ngày sinh</p>
          <div class="print-cover__client">
            <div class="print-cover__meta">
              <span>Họ tên</span>
              <strong>${escapeHtml(customerDisplayName)}</strong>
            </div>
            <div class="print-cover__meta">
              <span>Ngày sinh</span>
              <strong>${escapeHtml(data.input.birth_date)}</strong>
            </div>
            <div class="print-cover__meta">
              <span>Ngày tạo báo cáo</span>
              <strong>${escapeHtml(formatReportDate())}</strong>
            </div>
            <div class="print-cover__meta">
              <span>Zalo Brian</span>
              <strong>${escapeHtml(ZALO_PHONE)}</strong>
            </div>
          </div>
        </div>
        <div class="print-cover__disclaimer">
          Thần số học là bản đồ khuynh hướng, không phải bản án định mệnh.
        </div>
      </div>
    `;
  }

  function renderPrintToc() {
    const container = getElement("print-toc");
    if (!container) {
      return;
    }

    container.innerHTML = `
      <h2 class="print-toc__title">Mục lục báo cáo</h2>
      <ol class="print-toc__list">
        ${PRINT_TOC_ITEMS.map(
          (item, index) => `
            <li class="print-toc__item">
              <span class="print-toc__number">${String(index + 1).padStart(2, "0")}</span>
              <span class="print-toc__text">${escapeHtml(item)}</span>
            </li>
          `
        ).join("")}
      </ol>
    `;
  }

  function renderPrintCoreSummary(data) {
    const container = getElement("print-core-summary");
    if (!container) {
      return;
    }

    const karmic = data.karmic_debts.length ? data.karmic_debts.join(", ") : "Không có";
    const master = formatMasterSummary(data);
    const originalDisplayName = formatCustomerDisplayName(data.input.full_name_original);
    const normalizedDisplayName = formatCustomerDisplayName(data.normalized.full_name);
    const audit = data.calculation_audit.is_valid ? "Hợp lệ" : "Cần kiểm tra lại";
    const items = [
      ["Họ tên gốc", originalDisplayName, "wide"],
      ["Họ tên chuẩn hóa", normalizedDisplayName, "wide"],
      ["Ngày sinh", data.input.birth_date],
      ["Đường Đời", data.core_numbers.life_path],
      ["Sứ Mệnh", data.core_numbers.destiny],
      ["Linh Hồn", data.core_numbers.soul],
      ["Ngày Sinh", data.core_numbers.birthday],
      ["Nhân Cách", data.core_numbers.personality],
      ["Master Number", master, "wide"],
      ["Karmic Debt", karmic, "wide"],
      ["Kiểm tra dữ liệu", audit, "wide"]
    ];

    container.innerHTML = `
      <h2 class="print-core-summary__title">Tóm tắt bản đồ cốt lõi</h2>
      <div class="print-core-grid">
        ${items.map(
          ([label, value, wide]) => `
            <div class="print-core-card${wide ? " wide" : ""}">
              <span class="print-core-label">${escapeHtml(label)}</span>
              <strong class="print-core-value">${escapeHtml(value)}</strong>
            </div>
          `
        ).join("")}
      </div>
    `;
  }

  function renderPrintFinalCta() {
    const container = getElement("print-final-cta");
    if (!container) {
      return;
    }

    const packageCards = Object.entries(SERVICE_PACKAGES)
      .map(
        ([, pack]) => `
          <div class="print-package-card">
            <strong>${escapeHtml(pack.display_name)}</strong>
            <span>${escapeHtml(pack.short_description)}</span>
          </div>
        `
      )
      .join("");

    container.innerHTML = `
      <h2 class="print-final-cta__title">Bước tiếp theo của bạn</h2>
      <p class="print-final-cta__lead">
        Bản FREE đã mở ra 4 trụ cột đầu tiên. Nhưng nó chưa phải toàn bộ bản đồ.
      </p>
      <ul class="print-limit-list">
        <li>Chưa mở toàn bộ chỉ số bổ sung.</li>
        <li>Chưa phân tích sâu mâu thuẫn nội tại.</li>
        <li>Chưa có chiến lược hóa giải.</li>
        <li>Chưa có dự báo chu kỳ cá nhân.</li>
        <li>Chưa có định hướng hành động theo giai đoạn.</li>
      </ul>
      <p>
        Nếu anh/chị muốn đi sâu hơn, hãy chọn gói chuyên sâu phù hợp hoặc nhắn Zalo cho Brian.
      </p>
      <div class="print-discount-box">Ưu đãi 20% nếu nâng cấp trong vòng 3 ngày. Zalo Brian: ${escapeHtml(ZALO_PHONE)}</div>
      <div class="print-package-grid">${packageCards}</div>
    `;
  }

  function preparePrintLayout(data = currentReportData) {
    if (!data) {
      return;
    }

    renderPrintCover(data);
    renderPrintToc();
    renderPrintCoreSummary(data);
    renderPrintFinalCta(data);
  }

  function isMobilePrintEnvironment() {
    if (typeof navigator === "undefined" || typeof window === "undefined") {
      return false;
    }

    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }

  function isPrintViewMode() {
    if (typeof window === "undefined") {
      return false;
    }

    return new URLSearchParams(window.location.search).get("print") === "1";
  }

  function saveCurrentReportForPrintView() {
    if (typeof sessionStorage === "undefined" || !currentReportData) {
      return false;
    }

    try {
      sessionStorage.setItem(PRINT_VIEW_STORAGE_KEY, JSON.stringify(currentReportData));
      return true;
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  function loadReportForPrintView() {
    if (typeof sessionStorage === "undefined") {
      return null;
    }

    try {
      const raw = sessionStorage.getItem(PRINT_VIEW_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  function prepareCurrentReportForPrint() {
    openAllSections();
    preparePrintLayout(currentReportData);
    saveCurrentReportForPrintView();
    if (typeof document !== "undefined") {
      document.body.classList.add("is-printing-report");
    }
  }

  function setMobilePrintHelpVisible(visible) {
    const modal = getElement("mobilePrintHelpModal");
    if (!modal || typeof document === "undefined") {
      return;
    }

    modal.hidden = !visible;
    document.body.classList.toggle("has-mobile-print-modal", visible);
  }

  function showMobilePrintHelp() {
    prepareCurrentReportForPrint();
    updateLeadStatus("pdf_downloaded", {
      event_type: "pdf_downloaded",
      requested_pdf: true
    });
    updateLeadStatus("pdf_downloaded", {
      event_type: "mobile_print_help_viewed",
      requested_pdf: true
    });
    saveCurrentReportForPrintView();
    setMobilePrintHelpVisible(true);
    showToast("Trên điện thoại, hãy mở bản in riêng rồi dùng Share/In/Lưu PDF của trình duyệt nếu hộp thoại in không hiện.", "info");
  }

  function buildPrintViewUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("print", "1");
    url.hash = "";
    return url.toString();
  }

  function openMobilePrintView() {
    if (!currentReportData || typeof window === "undefined") {
      return;
    }

    prepareCurrentReportForPrint();
    updateLeadStatus("pdf_downloaded", {
      event_type: "mobile_print_view_opened",
      requested_pdf: true
    });
    saveCurrentReportForPrintView();

    const opened = window.open(buildPrintViewUrl(), "_blank");
    if (!opened) {
      showToast("Trình duyệt đang chặn tab mới. Tôi sẽ mở bản in ngay trong tab hiện tại.", "warning");
      window.location.href = buildPrintViewUrl();
    }
  }

  function tryMobilePrintNow() {
    if (!currentReportData) {
      return;
    }

    prepareCurrentReportForPrint();
    updateLeadStatus("pdf_downloaded", {
      event_type: "print_attempted",
      requested_pdf: true
    });
    saveCurrentReportForPrintView();
    window.print();
  }

  function printFromPrintView() {
    if (!currentReportData) {
      showToast("Không tìm thấy dữ liệu bản in. Vui lòng quay lại tạo báo cáo trước.", "warning");
      return;
    }

    prepareCurrentReportForPrint();
    updateLeadStatus("pdf_downloaded", {
      event_type: "print_attempted",
      requested_pdf: true
    });
    saveCurrentReportForPrintView();
    window.print();
  }

  function goBackFromPrintView() {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("print");
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = url.toString();
    }
  }

  function renderMobilePrintViewFromSession() {
    if (!isPrintViewMode() || typeof document === "undefined") {
      return false;
    }

    document.body.classList.add("is-mobile-print-view");
    const bar = getElement("mobilePrintViewBar");
    const status = getElement("mobilePrintViewStatus");
    if (bar) {
      bar.hidden = false;
    }

    const data = loadReportForPrintView();
    if (!data || !data.report || !Array.isArray(data.report.sections)) {
      if (status) {
        status.textContent = "Không tìm thấy dữ liệu bản in. Vui lòng quay lại trang chính, tạo báo cáo rồi mở bản in lại.";
      }
      showValidationError("Không tìm thấy dữ liệu bản in. Vui lòng quay lại tạo báo cáo trước.");
      return true;
    }

    currentReportData = data;
    document.title = "Bản in PDF | Brian-Numerologist";
    renderCalculationSummary(currentReportData);
    renderReportIntro(currentReportData);
    renderReportAccordion(currentReportData.report.sections);
    openAllSections();
    preparePrintLayout(currentReportData);
    const reportPanel = getElement("reportPanel");
    if (reportPanel) {
      reportPanel.hidden = false;
    }

    return true;
  }

  function downloadTxt() {
    if (!currentReportData) {
      showValidationError("Vui lòng tạo báo cáo trước khi tải TXT.");
      return;
    }

    updateLeadStatus("txt_downloaded", {
      event_type: "txt_downloaded"
    });
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
      showToast("Vui lòng tạo báo cáo trước khi In/Lưu PDF.", "warning");
      return;
    }

    if (contentLibraryState.used_fallback) {
      const fallbackPrintMessage =
        "Báo cáo hiện đang dùng fallback content ngắn vì thư viện TXT chưa tải được. Hãy chạy website bằng local server/GitHub Pages rồi in lại để có nội dung đầy đủ.";
      showValidationError(fallbackPrintMessage);
      showToast(fallbackPrintMessage, "warning");
      return;
    }

    updateLeadStatus("new_report_generated", {
      event_type: "pdf_gate_viewed"
    });

    if (!validateContactConsentForPaidAction("tải/In PDF")) {
      showToast("PDF cần Zalo/SĐT và đồng ý liên hệ để Brian có thể tư vấn bản phân tích phù hợp.", "warning");
      return;
    }

    updateLeadStatus("zalo_submitted", {
      event_type: "zalo_submitted"
    });

    if (isMobilePrintEnvironment()) {
      showMobilePrintHelp();
      return;
    }

    prepareCurrentReportForPrint();
    showToast("Khi lưu PDF: chọn A4, tắt Headers and footers, bật Background graphics để bản PDF sạch và giữ màu bìa.", "info");
    updateLeadStatus("pdf_downloaded", {
      event_type: "pdf_downloaded",
      requested_pdf: true
    });
    window.print();
    window.setTimeout(() => {
      showToast("Nếu cần bản chuyên sâu, nhắn Zalo Brian.", "info");
    }, 250);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("afterprint", () => {
      document.body.classList.remove("is-printing-report");
    });
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
    const price = getElement("selectedPackagePrice");
    const recommendationBox = getElement("recommendationBox");

    if (box && name && pack) {
      name.textContent = pack.display_name;
      if (price) {
        price.textContent = pack.price_display;
      }
      box.hidden = false;
    }

    if (!currentReportData) {
      showValidationError("Hãy tạo báo cáo FREE trước, sau đó chọn gói để lưu đúng lead.");
      getElement("leadForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const recommendation = buildRecommendation(currentReportData, {
      selected_package: packageKey,
      event_type: "package_clicked"
    });
    if (recommendationBox) {
      recommendationBox.innerHTML = `
        <strong>Gợi ý đang mở: ${escapeHtml(recommendation.recommended_package)}</strong>
        <span>${escapeHtml(recommendation.recommendation_reason)}</span>
      `;
    }

    updateLeadStatus("package_clicked", {
      event_type: "package_clicked",
      selected_package: packageKey,
      requested_paid_report: true
    });

    const input = getFormInput();
    if (!input.phone_or_zalo || !input.consent_to_contact || !isValidPhoneOrZalo(input.phone_or_zalo)) {
      getElement("phoneOrZalo")?.classList.add("attention-field");
      getElement("consentToContact")?.classList.add("attention-field");
      showToast("Brian đã ghi nhận gói quan tâm. Vui lòng nhập Zalo/SĐT và tick đồng ý nếu muốn được tư vấn nhanh.", "warning");
      return;
    }

    updateLeadStatus("zalo_submitted", {
      event_type: "zalo_submitted",
      selected_package: packageKey,
      requested_paid_report: true
    });
    updateLeadStatus("package_clicked", {
      event_type: "paid_report_requested",
      selected_package: packageKey,
      requested_paid_report: true
    });
    showToast("Brian đã ghi nhận yêu cầu. Bạn có thể nhắn Zalo 0948909983 để được tư vấn nhanh hơn.", "success");
  }

  function handleAddonClick(addonKey) {
    selectedAddon = addonKey;
    const addon = SERVICE_ADDONS[addonKey];
    const box = getElement("packageInterestBox");
    const name = getElement("selectedPackageName");
    const price = getElement("selectedPackagePrice");

    if (box && name && addon) {
      name.textContent = addon.display_name;
      if (price) {
        price.textContent = addon.price_display;
      }
      box.hidden = false;
    }

    if (!currentReportData) {
      showValidationError("Hãy tạo báo cáo FREE trước, sau đó chọn add-on để lưu đúng lead.");
      getElement("leadForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    updateLeadStatus("addon_clicked", {
      event_type: "addon_clicked",
      selected_addon: addonKey
    });

    const input = getFormInput();
    if (!input.phone_or_zalo || !input.consent_to_contact || !isValidPhoneOrZalo(input.phone_or_zalo)) {
      getElement("phoneOrZalo")?.classList.add("attention-field");
      getElement("consentToContact")?.classList.add("attention-field");
      showToast("Brian đã ghi nhận add-on quan tâm. Vui lòng nhập Zalo/SĐT và tick đồng ý nếu muốn được tư vấn.", "warning");
      return;
    }

    updateLeadStatus("zalo_submitted", {
      event_type: "zalo_submitted",
      selected_addon: addonKey
    });
    showToast("Brian đã ghi nhận add-on bạn quan tâm.", "success");
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

  function normalizeBirthDateField() {
    const field = getElement("birthDate");
    if (!field) {
      return "";
    }

    field.value = normalizeBirthDateInput(field.value);
    return field.value;
  }

  function handleBirthDateInput(event) {
    const field = event.target;
    if (!field) {
      return;
    }

    field.value = normalizeBirthDateInput(field.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    clearValidationErrors();

    normalizeBirthDateField();
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

  function removeElements(selector) {
    if (typeof document === "undefined") {
      return;
    }

    document.querySelectorAll(selector).forEach((element) => element.remove());
  }

  function applyPublicUiConfig() {
    if (!PUBLIC_UI_CONFIG.show_admin_link) {
      removeElements('a[href="admin.html"], a[href="./admin.html"], [data-admin-link], [data-public-admin-link]');
    }

    if (!PUBLIC_UI_CONFIG.show_lead_csv_export) {
      removeElements("#downloadCsvButton, #downloadAdminCsvButton, [data-lead-csv-export]");
    }

    if (!PUBLIC_UI_CONFIG.show_debug_tools) {
      removeElements("#debugPanel, .debug-panel, [data-debug-tool]");
    }
  }

  async function init() {
    applyPublicUiConfig();
    renderPackages();
    renderAddons();

    const status = getElement("libraryStatus");
    try {
      const result = await loadContentLibraries();
      if (status) {
        status.classList.toggle("status-warning", result.used_fallback);
        status.textContent = result.used_fallback
          ? "CẢNH BÁO: Đang dùng fallback content ngắn. Vui lòng chạy bằng local server hoặc GitHub Pages để tải đủ thư viện TXT trước khi in PDF."
          : `Đã tải ${result.loaded_count} content blocks từ ${result.loaded_files} file TXT.`;
      }
    } catch (error) {
      contentLibraryState = {
        loaded_count: 0,
        loaded_files: 0,
        used_fallback: true
      };
      if (status) {
        status.classList.add("status-warning");
        status.textContent = "CẢNH BÁO: Đang dùng fallback content ngắn. Vui lòng chạy bằng local server hoặc GitHub Pages để tải đủ thư viện TXT trước khi in PDF.";
      }
    }

    renderMobilePrintViewFromSession();

    getElement("leadForm")?.addEventListener("submit", handleFormSubmit);
    getElement("birthDate")?.addEventListener("input", handleBirthDateInput);
    getElement("birthDate")?.addEventListener("blur", normalizeBirthDateField);
    getElement("downloadTxtButton")?.addEventListener("click", downloadTxt);
    getElement("printPdfButton")?.addEventListener("click", printPdf);
    getElement("ctaPdfButton")?.addEventListener("click", printPdf);
    getElement("closeMobilePrintHelpButton")?.addEventListener("click", () => setMobilePrintHelpVisible(false));
    getElement("openMobilePrintViewButton")?.addEventListener("click", openMobilePrintView);
    getElement("tryMobilePrintButton")?.addEventListener("click", tryMobilePrintNow);
    getElement("printViewPrintButton")?.addEventListener("click", printFromPrintView);
    getElement("printViewBackButton")?.addEventListener("click", goBackFromPrintView);
    if (PUBLIC_UI_CONFIG.show_lead_csv_export) {
      getElement("downloadCsvButton")?.addEventListener("click", downloadLeadsCsv);
    }
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
    GOOGLE_SHEET_CONFIG,
    PUBLIC_UI_CONFIG,
    SERVICE_PACKAGES,
    SERVICE_ADDONS,
    normalizeVietnameseName,
    normalizeBirthDateInput,
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
    stripInternalNotes,
    getContentLibraryState,
    parseBlocksFromText,
    getBlockContent,
    getFallbackBlockContent,
    buildReportSections,
    buildFullReportText,
    renderReportAccordion,
    downloadTxt,
    printPdf,
    preparePrintLayout,
    isMobilePrintEnvironment,
    isPrintViewMode,
    saveCurrentReportForPrintView,
    loadReportForPrintView,
    openMobilePrintView,
    tryMobilePrintNow,
    printFromPrintView,
    renderMobilePrintViewFromSession,
    generateLeadId,
    getOrCreateLeadId,
    detectDeviceType,
    getEntryMode,
    getSource,
    getGoogleSheetConfig,
    fetchAdminStats,
    fetchMessageTemplates,
    buildLocalAdminStats,
    getLocalMessageTemplates,
    escapeHtml,
    buildLeadData,
    buildLeadPayload,
    getStoredLeads,
    saveLocalLead,
    saveLead,
    saveLeadToGoogleSheet,
    getPendingLeads,
    savePendingLead,
    retryPendingLeads,
    getPendingLeadCount,
    updateLeadStatus,
    validateContactConsentForPaidAction,
    isValidPhoneOrZalo,
    downloadLeadsCsv,
    runTestCase001,
    assertEqual,
    displayTestResult,
    handleFormSubmit,
    showValidationError,
    clearValidationErrors,
    showToast,
    handlePackageClick,
    handleAddonClick,
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
