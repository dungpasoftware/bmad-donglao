---
title: "Story NFR2: Files-only persistence (MVP) & ephemeral FS guardrails"
---

# Status

Draft

# Story

As a platform owner,
I want the system to persist artifacts via files-only and block ephemeral FS in production,
so that `doc-out` and BMAD artifacts are durable and Git-manageable without data loss.

# Acceptance Criteria

1. Files-only writer
   - Tất cả hành động ghi artifact (ví dụ `doc-out`) phải ghi vào `docs/` và `.bmad-core/...`; tự tạo thư mục nếu thiếu; trả về đường dẫn đã ghi.
2. Health check & gating (server start)
   - `persistenceHealthCheck` thử ghi/xóa file test trong `docs/` và `.bmad-core/`. Nếu thất bại ở `NODE_ENV=production`, tự động vô hiệu hóa `doc-out` và trả thông báo lỗi “ephemeral FS”.
3. Ephemeral FS detection (heuristics)
   - Nếu phát hiện môi trường phổ biến có FS ephemeral (ví dụ qua biến môi trường runtime), ở `production` phải chặn `doc-out` theo NFR; cho phép override có kiểm soát ở `development`.
4. Path safety
   - Chỉ cho phép whitelist base dirs: `docs/`, `.bmad-core/`; chặn path traversal (`..`, absolute path) và sanitize filename.
5. Tests & Telemetry
   - Unit + integration test pass cho writer/health-check/doc-out. Telemetry ghi `artifact_written`, `persistence_check_failed` (không chứa secrets/PII).

# Tasks / Subtasks

- [ ] Implement `persistenceHealthCheck` (fs write/read/delete vào `docs/` và `.bmad-core/`)
- [ ] Implement `writeArtifact` (files-only, atomic-ish, auto-mkdir, path whitelist)
- [ ] Áp dụng vào endpoint `POST /api/bmad/doc-out` (trả đường dẫn đã ghi + lỗi thân thiện khi bị chặn)
- [ ] Add ephemeral detection heuristics + config flags an toàn cho `development`
- [ ] Telemetry events: `artifact_written`, `persistence_check_failed`
- [ ] Tài liệu hoá lưu ý hosting: self-host/VM/Git bot/S3 (post-MVP), tránh Vercel/Netlify FS ephemeral cho `production`
- [ ] Tests: unit + integration theo AC

# Dev Notes

- Liên kết PRD: NFR2, “Additional Assumptions” (files-only ở MVP; tránh FS ephemeral prod).
- Bảo mật: sanitize đường dẫn; không log token; không ghi secrets vào artifact.
- Gợi ý flags: `BMAD_PERSISTENCE_STRATEGY=files-only` (MVP), chặn nếu `production` và check fail.

## Testing

- Unit: `persistenceHealthCheck`, `writeArtifact` (mkdir, sanitize, atomic-ish write)
- Integration: `POST /api/bmad/doc-out` ghi file mẫu; xác nhận tồn tại và nội dung
- Negative: mô phỏng FS read-only/không tồn tại, xác minh lỗi “ephemeral FS” và `doc-out` bị chặn

# Change Log

| Date       | Version | Description                          | Author |
|------------|---------|--------------------------------------|--------|
| 2025-08-09 | 0.1     | Khởi tạo bản nháp từ PRD (NFR2)      | PO TBD |

# QA Results


