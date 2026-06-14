# Phase 2 Test Notes

Ngày test: 2026-06-15

## Node checks

```bash
node --check app.js
node -e "const app=require('./app.js'); console.log(app.runTestCase001())"
node --check /tmp/Code.gs.js
```

Kết quả:

- `app.js` syntax OK.
- `runTestCase001()` PASS.
- `Code.gs` syntax OK khi copy tạm sang `.js` để Node parser đọc.

## Browser checks

Local server:

```bash
python3 -m http.server 8001
```

Kết quả kiểm tra bằng Chrome headless:

- Load được 77 content blocks từ 6 file TXT.
- `Run Test Case 001` PASS.
- Generate report không nhập phone: report vẫn tạo, status `report_generated`.
- Chọn gói thiếu phone/consent: bị chặn, chưa ghi `paid_report_requested`.
- Chọn gói đủ phone/consent: status `paid_report_requested`, lưu `selected_package`.
- Tải TXT: tải file `brian-numerologist-free-nguyen-thanh-tri.txt`, status `txt_downloaded`.
- In/Lưu PDF: gọi `window.print()`, status `pdf_requested`.
- Sync lỗi với URL sai: website không crash, payload vào `brian_numerologist_pending_leads`, toast `Hệ thống sẽ đồng bộ lại sau.`
- Admin hiển thị đúng local lead count và pending count.
