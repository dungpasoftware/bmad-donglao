# Epic 1: Foundation & Non‑Tech Guided Shell

Goal
- Dựng nền tảng Next.js fullstack với UI “đường ray” cho non‑tech: i18n (vi mặc định, en tuỳ chọn), Sidebar Agents + Action Cards (hiển thị role/chức năng), Command Palette, Chat Drawer skeleton, Glossary/Tooltip, Doc Preview + doc‑out stub.

Stories

## Story 1.1: Project scaffold & tooling
Acceptance Criteria
1. Next.js 15 + React 19 + TypeScript khởi tạo, build OK
2. TailwindCSS + shadcn/ui cài đặt, style hoạt động
3. ESLint + type‑check pass; cấu trúc repo giữ `docs/` và `.bmad-core/...`

## Story 1.2: i18n (vi/en) + Language toggle
Acceptance Criteria
1. Tiếng Việt là mặc định; có toggle sang tiếng Anh
2. Lang attribute/aria cập nhật theo ngôn ngữ; keyboard nav hoạt động
3. Lựa chọn ngôn ngữ được persist (local storage)

## Story 1.3: Sidebar Agents + Action Cards (role/chức năng)
Acceptance Criteria
1. Header hiển thị tên agent, role, when‑to‑use, chức năng chính
2. Action Cards map đến command id (placeholder, chưa nối BE)
3. Điều hướng hiển thị chi tiết agent

## Story 1.4: Command Palette + Chat Drawer skeleton
Acceptance Criteria
1. Command Palette mở bằng ⌘K; tìm agent/command/template (stub)
2. Chat Drawer toggle; khung elicitation 1–9 (UI) chưa nối BE
3. Focus management & keyboard navigation cơ bản

## Story 1.5: Glossary/Tooltip thuật ngữ
Acceptance Criteria
1. Tooltip/Popover giải thích thuật ngữ kỹ thuật phổ biến
2. Glossary Drawer có tìm kiếm; liên kết chéo từ tooltip

## Story 1.6: Document Preview + doc‑out stub
Acceptance Criteria
1. Preview markdown từ mẫu/tệp giả lập
2. `doc‑out` hiển thị placeholder (sẽ nối BE ở Epic 2)

---
