# Brian-Numerologist FREE MVP

Website MVP tĩnh bằng HTML/CSS/JavaScript thuần để tạo báo cáo Thần số học FREE 11 bước cho Brian-Numerologist.

## Cấu trúc thư mục

```text
.
├── index.html
├── admin.html
├── styles.css
├── pdf-print.css
├── app.js
├── README.md
├── google-sheet-config.example.json
├── phase3-print-test-notes.md
├── google-apps-script/
│   ├── Code.gs
│   └── README_Google_Apps_Script.md
├── specs/
│   └── Google_Sheet_Lead_Phase2_Spec_v1.txt
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

Không test chính thức bằng cách double click `index.html` hoặc mở bằng `file://`. Browser có thể chặn `fetch()` khi đọc `content/*.txt`, làm app rơi về fallback content ngắn trong `app.js`.

Sau khi mở website, kiểm tra dòng `libraryStatus`:

- Đúng: `Đã tải ... content blocks từ ... file TXT.`
- Sai: `CẢNH BÁO: Đang dùng fallback content ngắn...`

Nếu đang fallback, hãy chạy lại bằng local server hoặc GitHub Pages trước khi In/Lưu PDF.

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

Nếu `libraryStatus` đang báo fallback content, app sẽ chặn In/Lưu PDF để tránh xuất bản PDF sơ sài. Chạy website bằng local server hoặc GitHub Pages để tải đủ thư viện TXT rồi in lại.

Khi lưu PDF, dùng các thiết lập in này:

- Paper size: `A4`.
- Tắt: `Headers and footers`.
- Bật: `Background graphics`.

Nếu PDF còn hiện ngày giờ, title website, đường dẫn `localhost` hoặc số trang mặc định ở đầu/cuối trang, nghĩa là `Headers and footers` vẫn đang bật trong hộp thoại in của browser.

Phase 3 đã nâng cấp layout browser print: có trang bìa, mục lục, tóm tắt chỉ số, 11 bước báo cáo và CTA cuối.

## Phase 3 – Print/PDF Beauty

Phase 3 chỉ làm đẹp bản In/Lưu PDF bằng browser print + CSS. Không dùng `html2pdf`, không dùng `jsPDF`, không dùng server-side PDF, không sửa công thức và không sửa nội dung phân tích.

File mới:

- `pdf-print.css`
- `phase3-print-test-notes.md`

Cách dùng:

1. Không mở bằng `file://` hoặc double click `index.html`.
2. Chạy website bằng local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Mở `http://localhost:8000` hoặc dùng GitHub Pages.
4. Kiểm tra `libraryStatus` phải hiện `Đã tải ... content blocks từ ... file TXT.`
5. Tạo báo cáo.
6. Bấm `In/Lưu PDF`.
7. Trong hộp thoại in của browser, chọn:
   - Destination: `Save as PDF`
   - Paper size: `A4`
   - Tắt: `Headers and footers`
   - Bật: `Background graphics`
   - Nếu thấy ngày giờ/title/localhost/số trang ở đầu hoặc cuối PDF, quay lại hộp thoại in và tắt `Headers and footers`.
8. Kiểm tra bản PDF có:
   - Trang bìa.
   - Mục lục 11 bước.
   - Tóm tắt bản đồ cốt lõi.
   - 11 bước báo cáo.
   - CTA cuối và đủ 6 gói dịch vụ.

Để bìa in đúng màu đen/đỏ/vàng đồng, trong hộp thoại in hãy bật:

- Chrome/Edge: `More settings > Background graphics`.
- Safari: bật tùy chọn in nền nếu có.

Nếu thấy nội dung báo cáo quá sơ sài, kiểm tra lại `libraryStatus`. Trạng thái fallback nghĩa là website chưa tải được thư viện TXT đầy đủ.

Giới hạn:

- Số trang custom phụ thuộc browser; nếu browser không hỗ trợ, footer vẫn có thương hiệu.
- Màu nền bìa phụ thuộc setting `Background graphics`.
- Chưa có QR Zalo ở Phase 3.
- Browser print có thể khác nhau nhẹ giữa Chrome, Edge và Safari.

Test Phase 3:

```bash
node -e "const app=require('./app.js'); console.log(app.runTestCase001().pass)"
```

Sau đó test trên browser:

- Tạo báo cáo.
- Bấm `In/Lưu PDF`.
- Kiểm tra cover, mục lục, core summary, 11 bước, CTA cuối.
- Kiểm tra `pdf_requested` vẫn được ghi vào Google Sheet logs nếu sync đã bật.
- Kiểm tra `Tải báo cáo TXT` và chọn gói chuyên sâu vẫn hoạt động.

## Lead localStorage/CSV

Mỗi lần generate report, app lưu lead vào `localStorage` với key `brian_numerologist_free_leads_v1`. Các trạng thái chính:

- `report_generated`
- `txt_downloaded`
- `pdf_requested`
- `paid_report_requested`

Bấm `Tải CSV lead tạm` để xuất lead hiện có. Phase 2 vẫn giữ localStorage/CSV làm fallback khi Google Sheet sync tắt hoặc lỗi.

## Phase 2 – Google Sheet Lead Sync

Phase 2 thêm Google Sheet Lead Sync nhưng không thay đổi công thức Thần số học. Sync mặc định tắt để website GitHub Pages vẫn chạy như MVP v1.

File mới:

- `google-apps-script/Code.gs`
- `google-apps-script/README_Google_Apps_Script.md`
- `google-sheet-config.example.json`
- `specs/Google_Sheet_Lead_Phase2_Spec_v1.txt`

Google Sheet cần tạo:

```text
Brian_Numerologist_FREE_Leads
```

Tab bắt buộc:

- `leads`
- `config`
- `logs`

`Code.gs` có hàm `setupSheets()` để tạo header cho 3 tab và không xóa dữ liệu cũ.

## Cấu hình Google Sheet Sync

1. Tạo Google Sheet `Brian_Numerologist_FREE_Leads`.
2. Vào `Extensions > Apps Script`.
3. Dán nội dung `google-apps-script/Code.gs`.
4. Chạy `setupSheets()`.
5. Chạy `setSecretOnce()`.
6. Deploy Apps Script:
   - Type: `Web app`
   - Execute as: `Me`
   - Who has access: `Anyone`
7. Copy Web App URL.
8. Mở `app.js`, sửa object `GOOGLE_SHEET_CONFIG`:

```js
const GOOGLE_SHEET_CONFIG = {
  google_apps_script_web_app_url: "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE",
  google_sheet_url: "PASTE_YOUR_GOOGLE_SHEET_URL_HERE",
  google_sheet_name: "Brian_Numerologist_FREE_Leads",
  shared_secret: "CHANGE_ME_PHASE2_SECRET",
  enable_google_sheet_sync: true,
  fallback_to_local_storage: true
};
```

`google-sheet-config.example.json` chỉ là file mẫu. Không commit secret thật lên repo public nếu không muốn lộ.

## Fallback localStorage và pending sync

Website luôn lưu lead vào localStorage trước. Nếu `enable_google_sheet_sync = false`, app không gọi Apps Script và không báo lỗi.

Nếu sync bật nhưng Apps Script lỗi:

- Website vẫn tạo report, tải TXT và In/Lưu PDF.
- App hiển thị: `Hệ thống sẽ đồng bộ lại sau.`
- Payload lỗi được lưu vào localStorage key `brian_numerologist_pending_leads`.
- Vào `admin.html` bấm `Đồng bộ lại lead lỗi` để retry.

Không gửi `full_report_text` lên Google Sheet. Sheet chỉ nhận thông tin lead, chỉ số, trạng thái, gói quan tâm và log event.

## Admin Lead Sync Phase 2

`admin.html` có:

- Trạng thái sync enabled/disabled.
- Trạng thái Web App URL và Google Sheet URL.
- Số lead localStorage.
- Số pending lead lỗi.
- Nút mở Google Sheet.
- Nút tải CSV lead localStorage.
- Nút đồng bộ lại lead lỗi.

Admin hiện chưa có login thật. Không chia sẻ public nếu chưa có bảo mật.

## Test Phase 2

Sau mỗi lần sửa, chạy lại:

```bash
node -e "const app=require('./app.js'); console.log(app.runTestCase001().pass)"
```

Expected: `true`.

Checklist:

- Generate report không nhập phone vẫn tạo được báo cáo và lưu status `report_generated`.
- Bấm `Tải báo cáo TXT` vẫn tải được, status `txt_downloaded`.
- Bấm `In/Lưu PDF` gọi browser print, status `pdf_requested`.
- Chọn gói thiếu phone/consent thì báo lỗi và chưa ghi `paid_report_requested`.
- Chọn gói đủ phone/consent thì lưu `selected_package` và status `paid_report_requested`.
- Sync tắt thì website vẫn chạy localStorage.
- Sync lỗi thì payload vào pending queue.
- Admin retry sync làm pending queue giảm khi Web App URL đúng.
- Tab `logs` ghi event chính.

## Bảo mật shared_secret

`shared_secret` trong frontend chỉ là lớp bảo vệ cơ bản vì website GitHub Pages là public. Người có kỹ thuật vẫn có thể xem JS trong DevTools. Nếu cần bảo mật nghiêm túc, Phase 3 nên có backend riêng.

## Admin Phase 2 cũ

Admin placeholder đã được nâng cấp thành Admin Lead Sync Phase 2.

## Các lỗi cấm mắc

- Không tính `Y` là phụ âm.
- Không đếm `NGUYEN THANH TRI` thành 15 chữ cái.
- Không route birthday thành `BIRTHDAY_3`.
- Không bỏ Karmic Overlay.
- Không cộng cả chuỗi tên trước rồi mới rút gọn Sứ Mệnh.
- Không cộng toàn bộ nguyên âm trước rồi mới rút gọn Linh Hồn.
- Không viết nội dung hù dọa hoặc định mệnh hóa tuyệt đối.
