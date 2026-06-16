# Brian-Numerologist Google Apps Script Setup

## 1. Tạo Google Sheet

Tạo Google Sheet tên:

```text
Brian_Numerologist_FREE_Leads
```

## 2. Mở Apps Script

Trong Google Sheet, vào `Extensions > Apps Script`.

## 3. Dán Code.gs

Copy toàn bộ nội dung trong `google-apps-script/Code.gs` và dán vào file `Code.gs` trong Apps Script.

## 4. Chạy setupSheets()

Trong Apps Script, chọn hàm `setupSheets()` rồi bấm `Run`.

Hàm này tạo hoặc kiểm tra 3 tab:

- `leads`
- `config`
- `logs`

Hàm không xóa dữ liệu cũ.

## 5. Set shared_secret

Chọn hàm `setSecretOnce()` rồi bấm `Run`.

Mặc định hàm set placeholder:

```text
CHANGE_ME_PHASE2_SECRET
```

Khi dùng thật, đổi chuỗi này trong `Code.gs` và đổi cùng giá trị trong `GOOGLE_SHEET_CONFIG.shared_secret` ở `app.js`. Không commit secret thật lên repo public nếu không muốn lộ.

## 6. Deploy Web App

Vào `Deploy > New deployment`.

- Type: `Web app`
- Execute as: `Me`
- Who has access: `Anyone`

Bấm deploy và copy Web App URL.

## 7. Bật sync trên website

Trong `app.js`, sửa:

```js
const GOOGLE_SHEET_CONFIG = {
  google_apps_script_web_app_url: "WEB_APP_URL_CUA_BRIAN",
  google_sheet_url: "GOOGLE_SHEET_URL_CUA_BRIAN",
  google_sheet_name: "Brian_Numerologist_FREE_Leads",
  shared_secret: "CHANGE_ME_PHASE2_SECRET",
  enable_google_sheet_sync: true,
  fallback_to_local_storage: true
};
```

## 8. Test

1. Mở website.
2. Bấm `Run Test Case 001` và xác nhận PASS.
3. Tạo report với `Nguyễn Thanh Trí`, `21/04/1986`.
4. Kiểm tra tab `leads` có dòng `report_generated`.
5. Bấm `Tải báo cáo TXT`, kiểm tra `logs` có `txt_downloaded`.
6. Bấm chọn một gói khi đã nhập Zalo + tick consent, kiểm tra `paid_package_clicked`.

## 9. Test lỗi sync

1. Dán sai Web App URL hoặc tạm tắt quyền deploy.
2. Tạo report.
3. Website vẫn phải tạo report.
4. LocalStorage key `brian_numerologist_pending_leads` sẽ có payload chờ sync.
5. Sửa URL đúng.
6. Vào `admin.html`, bấm `Đồng bộ lại lead lỗi`.

## 10. Cảnh báo bảo mật

`shared_secret` trong frontend chỉ là lớp bảo vệ cơ bản vì GitHub Pages là website public. Người có kỹ thuật vẫn có thể xem JS trong DevTools. Nếu cần bảo mật nghiêm túc, Phase 3 nên dùng backend riêng.
