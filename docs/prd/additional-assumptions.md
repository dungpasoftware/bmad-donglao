# Additional Assumptions
- Files-only ở MVP; PROD cần FS persistent (self-host/VM/Git bot/S3); tránh FS ephemeral.
- LLM: ChatGPT; token lưu client-side; i18n vi/en (mặc định vi); code/API/tên file giữ tiếng Anh.
- Security: không lưu token server; rate limiting; sanitize markdown/mermaid; CORS same-origin.
- Performance: API TTFB (local) ≤ 200ms; LCP trang chính ≤ 2.5s.

---
