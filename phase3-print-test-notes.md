# Phase 3 Print/PDF Beauty Test Notes

## Environment

- Browser:
- Date:
- Tester:
- Source version: Brian_Numerologist_FREE_MVP_PHASE3_PRINT_BEAUTY_FIXED_v1
- Apps Script Web App URL configured: yes/no
- Google Sheet Sync enabled: yes/no

## Functional Tests

- [ ] `runTestCase001()` PASS
- [ ] Generate report thành công
- [ ] Google Sheet có `report_generated`
- [ ] Tải TXT vẫn hoạt động
- [ ] Google Sheet có `txt_downloaded`
- [ ] Bấm In/Lưu PDF mở browser print
- [ ] Google Sheet có `pdf_requested`
- [ ] Bấm gói chuyên sâu vẫn hoạt động
- [ ] Google Sheet có `paid_report_requested`

## Content Load / Fallback Tests

- [ ] Không mở bằng `file://` khi test chính thức.
- [ ] Chạy local server bằng `python3 -m http.server 8000`.
- [ ] `libraryStatus` hiển thị đã tải content blocks từ file TXT.
- [ ] Nếu `libraryStatus` báo fallback, không in PDF chính thức.
- [ ] Bước 2 hiển thị nội dung đầy đủ, không chỉ fallback ngắn.
- [ ] Bước 3 hiển thị nội dung đầy đủ, không chỉ fallback ngắn.
- [ ] Bước 7 hiển thị nội dung đầy đủ, không chỉ fallback ngắn.
- [ ] In/Lưu PDF bị chặn khi đang dùng fallback content.

## Print Layout Tests

- [ ] Cover page xuất hiện
- [ ] Cover có BRIAN-NUMEROLOGIST
- [ ] Cover có tên khách
- [ ] Cover có ngày sinh
- [ ] Cover có ngày tạo báo cáo
- [ ] Cover có Zalo 0948909983
- [ ] Cover có disclaimer
- [ ] Mục lục có đủ 11 bước
- [ ] Core summary có đủ chỉ số
- [ ] Mỗi bước bắt đầu trang mới
- [ ] Nội dung accordion in đầy đủ
- [ ] CTA cuối xuất hiện
- [ ] CTA cuối có ưu đãi 20%
- [ ] CTA cuối có đủ 6 gói dịch vụ
- [ ] Footer thương hiệu xuất hiện
- [ ] Footer không còn `Trang 0`
- [ ] PDF không có header/footer browser sau khi tắt `Headers and footers`
- [ ] Trang core summary không bị tách tiêu đề và nội dung
- [ ] Form/nút/test/debug không bị in

## Responsive / Regression Tests

- [ ] Desktop layout ổn
- [ ] Mobile layout ổn
- [ ] Report viewer web đẹp hơn nhưng không đổi flow
- [ ] Không lỗi console nghiêm trọng
- [ ] GitHub Pages deploy được

## Notes

- Issues found:
- Fixes applied:
- Final status:

## Codex Local Check Summary

- `runTestCase001()`: PASS
- `app.js` syntax check: PASS
- Browser local content load: PASS, 77 content blocks from 6 TXT files
- Print layout DOM: PASS, cover/toc/core summary/final CTA rendered
- Report sections: PASS, 11 accordion sections with print section class
- TXT download: PASS
- Print mock: PASS, `window.print()` called
- PDF status: PASS, lead status changed to `pdf_requested`
- Sync error fallback: PASS, pending queue captured `pdf_requested`
- Package CTA flow: PASS
- Phase 2 preserved: Google Sheet config and pending sync remain in `app.js`
- Forbidden changes: no content library edits, no calculation edits, no `html2pdf` or `jsPDF`
