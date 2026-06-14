# Brian-Numerologist FREE MVP

Website MVP tĩnh bằng HTML/CSS/JavaScript thuần để tạo báo cáo Thần số học FREE 11 bước cho Brian-Numerologist.

## Cấu trúc thư mục

```text
.
├── index.html
├── admin.html
├── styles.css
├── app.js
├── README.md
├── content/
│   ├── 01_Calculation_Rules_v1.1.txt
│   ├── LifePath_Library_FREE_v1.txt
│   ├── Karmic_Overlay_FREE_v1.txt
│   ├── Destiny_Library_FREE_v1.txt
│   ├── Soul_Library_FREE_v1.txt
│   ├── Birthday_Library_FREE_v1.txt
│   ├── Report_Template_FREE_11_Buoc_v1.txt
│   └── Data_Schema_FREE_v1.json
└── test-cases/
    └── TEST_CASE_001_NGUYEN_THANH_TRI_FREE_REPORT.txt
```

## Cách chạy local

Khuyến nghị dùng local server để browser đọc được các file TXT trong `content/`:

```bash
python3 -m http.server 8000
```

Mở `http://localhost:8000`.

Nếu mở trực tiếp `index.html` bằng `file://`, browser có thể chặn `fetch()` do CORS. Khi đó app vẫn chạy bằng fallback object trong `app.js`, nhưng nên dùng local server để đọc đúng thư viện TXT.

## Deploy GitHub Pages

1. Commit toàn bộ file trong thư mục này.
2. Push lên GitHub repository.
3. Vào `Settings > Pages`.
4. Chọn source là branch chứa `index.html`, thường là `main`.
5. Chọn root folder.
6. Lưu lại và mở URL GitHub Pages được cấp.

## Cách sửa nội dung thư viện

Sửa trực tiếp các file trong `content/`. Mỗi block dùng format:

```text
============================================================
BLOCK_ID
============================================================

summary:
Nội dung...
```

Report engine sẽ gọi block theo ID như `LIFEPATH_4`, `DESTINY_4`, `SOUL_7`, `BIRTHDAY_21`, `KARMIC_OVERLAY_13_4`.

## Cách chạy test case

Trên website, bấm nút `Run Test Case 001`.

Expected chính:

- `Nguyễn Thanh Trí` chuẩn hóa thành `NGUYEN THANH TRI`
- `letter_count = 14`
- `number_count = 14`
- `life_path = 13/4`
- `destiny = 13/4`
- `soul = 16/7`
- `birthday = 21/3`
- `birthday_blocks = ["BIRTHDAY_21"]`
- `personality = 24/6`
- Karmic overlay có `13/4` và `16/7`

Có thể kiểm tra bằng Node:

```bash
node -e "const app=require('./app.js'); console.log(app.runTestCase001().pass)"
```

## Tải TXT và In/Lưu PDF

Sau khi tạo báo cáo:

- Bấm `Tải báo cáo TXT` để tải file `.txt`.
- Bấm `In/Lưu PDF` để dùng browser print. Browser sẽ cho chọn máy in hoặc `Save as PDF`.

Theo MVP, nếu muốn PDF hoặc tư vấn chuyên sâu, người dùng phải nhập số điện thoại/Zalo và tick đồng ý liên hệ.

## Lead localStorage/CSV

Mỗi lần generate report, app lưu lead vào `localStorage` với key `brian_numerologist_free_leads_v1`. Các trạng thái chính:

- `report_generated`
- `txt_downloaded`
- `pdf_requested`
- `paid_report_requested`

Bấm `Tải CSV lead tạm` để xuất lead hiện có. Phase 2 sẽ thay `saveLead()` bằng Google Apps Script Web App POST đến Google Sheet.

## Admin Phase 2

`admin.html` hiện là placeholder. Phase 2 sẽ:

- Xem lead từ Google Sheet.
- Tải lại báo cáo.
- Regenerate report.
- Cập nhật trạng thái khách.

## Các lỗi cấm mắc

- Không tính `Y` là phụ âm.
- Không đếm `NGUYEN THANH TRI` thành 15 chữ cái.
- Không route birthday thành `BIRTHDAY_3`.
- Không bỏ Karmic Overlay.
- Không cộng cả chuỗi tên trước rồi mới rút gọn Sứ Mệnh.
- Không cộng toàn bộ nguyên âm trước rồi mới rút gọn Linh Hồn.
- Không viết nội dung hù dọa hoặc định mệnh hóa tuyệt đối.
