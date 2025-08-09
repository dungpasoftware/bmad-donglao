---
title: "BMAD Brainstorming Web UI Product Requirements Document (PRD)"
---

## Epic 3: Guided Flow Engine & KPI Telemetry

Goal
- Xây dựng động cơ “đường ray” (guided flow) dựa trên Loại dự án (Greenfield/Brownfield) và Quy mô (Nhỏ/Lớn), hỗ trợ rẽ nhánh có kiểm soát, quay về luồng chính, và telemetry KPI (no‑chat completion, time‑to‑doc‑out).

Stories

### Story 3.1: Flow configuration & mapping
Acceptance Criteria
1. UI chọn Greenfield/Brownfield + Nhỏ/Lớn và persist lựa chọn
2. Tự động đề xuất workflow mapping mặc định theo tổ hợp đã chọn
3. Nút “Hiểu quy trình” khả dụng ở bước lựa chọn, mở modal sơ đồ + mô tả

### Story 3.2: Flow Runner + breadcrumbs/progress
Acceptance Criteria
1. Hiển thị breadcrumbs + progress theo từng bước của lộ trình chuẩn
2. Hỗ trợ rẽ nhánh có kiểm soát và nút “Trở về luồng chính” luôn hiển thị
3. Persist tiến độ; reload trang không mất trạng thái

### Story 3.3: Branch options & guardrails
Acceptance Criteria
1. Cung cấp nhánh phụ (VD: research/benchmark) và giới hạn vòng lặp rẽ nhánh
2. Telemetry ghi sự kiện bắt đầu/kết thúc nhánh; đo thời lượng nhánh
3. Cảnh báo quay lại luồng chính nếu người dùng đi quá xa

### Story 3.4: KPI telemetry & dashboard stub
Acceptance Criteria
1. Ghi sự kiện: chat_opened, branch_entered, branch_exited, step_completed, doc_out
2. Tính no‑chat completion rate và time‑to‑first doc‑out (trên phiên)
3. Màn hình dashboard KPI tối giản (stub) hiển thị 2 chỉ số trên

### Story 3.5: Chat gating cho elicitation
Acceptance Criteria
1. Chỉ bật Chat Drawer khi bước yêu cầu elicitation (elicit:true)
2. Ép định dạng 1–9; kiểm tra và nhắc nếu không đúng
3. Telemetry đếm số lần mở/đóng chat; gợi ý quay về luồng chính sau khi xong

### Story 3.6: A11y & i18n cho Flow
Acceptance Criteria
1. Keyboard nav đầy đủ; aria/role đúng; focus management
2. i18n vi/en cho toàn bộ thành phần Flow; vi là mặc định
3. Nội dung kỹ thuật (code/API/tên file) giữ tiếng Anh, kèm diễn giải tiếng Việt

---

# Epic List (DRAFT)

- Epic 1: Foundation & Non‑Tech Guided Shell
  - Mục tiêu: Dựng Next.js 15 + TS, Tailwind + shadcn/ui, i18n (vi mặc định, en tùy chọn), Sidebar Agents, Command Palette cơ bản, Chat Drawer skeleton, Glossary/Tooltip thuật ngữ, Doc Preview + doc‑out.

- Epic 2: BMAD Orchestrator Integration & Artifacts
  - Mục tiêu: Map Action Cards → agents/tasks/templates BMAD; tạo Project Brief/PRD từ UI; ghi `docs/` và `.bmad-core/...`; validator compliance; xử lý lỗi căn bản.

- Epic 3: Guided Flow Engine & KPI Telemetry
  - Mục tiêu: Chọn Greenfield/Brownfield + Nhỏ/Lớn; modal “Hiểu quy trình” (sơ đồ + mô tả); breadcrumbs + progress; rẽ nhánh có kiểm soát và “Trở về luồng chính”; telemetry tính KPI (no‑chat completion, time‑to‑doc‑out).

---

# Epic Details (DRAFT)

## Epic 1: Foundation & Non‑Tech Guided Shell

Goal
- Dựng nền tảng Next.js fullstack với UI “đường ray” cho non‑tech: i18n (vi mặc định, en tuỳ chọn), Sidebar Agents + Action Cards (hiển thị role/chức năng), Command Palette, Chat Drawer skeleton, Glossary/Tooltip, Doc Preview + doc‑out stub.

Stories

### Story 1.1: Project scaffold & tooling
Acceptance Criteria
1. Next.js 15 + React 19 + TypeScript khởi tạo, build OK
2. TailwindCSS + shadcn/ui cài đặt, style hoạt động
3. ESLint + type‑check pass; cấu trúc repo giữ `docs/` và `.bmad-core/...`

### Story 1.2: i18n (vi/en) + Language toggle
Acceptance Criteria
1. Tiếng Việt là mặc định; có toggle sang tiếng Anh
2. Lang attribute/aria cập nhật theo ngôn ngữ; keyboard nav hoạt động
3. Lựa chọn ngôn ngữ được persist (local storage)

### Story 1.3: Sidebar Agents + Action Cards (role/chức năng)
Acceptance Criteria
1. Header hiển thị tên agent, role, when‑to‑use, chức năng chính
2. Action Cards map đến command id (placeholder, chưa nối BE)
3. Điều hướng hiển thị chi tiết agent

### Story 1.4: Command Palette + Chat Drawer skeleton
Acceptance Criteria
1. Command Palette mở bằng ⌘K; tìm agent/command/template (stub)
2. Chat Drawer toggle; khung elicitation 1–9 (UI) chưa nối BE
3. Focus management & keyboard navigation cơ bản

### Story 1.5: Glossary/Tooltip thuật ngữ
Acceptance Criteria
1. Tooltip/Popover giải thích thuật ngữ kỹ thuật phổ biến
2. Glossary Drawer có tìm kiếm; liên kết chéo từ tooltip

### Story 1.6: Document Preview + doc‑out stub
Acceptance Criteria
1. Preview markdown từ mẫu/tệp giả lập
2. `doc‑out` hiển thị placeholder (sẽ nối BE ở Epic 2)

---

# Epic 2: BMAD Orchestrator Integration & Artifacts

Goal
- Tích hợp Orchestrator để map UI → BMAD (agents/tasks/templates), sinh artifacts đúng `docs/` và `.bmad-core/...`, kết nối LLM (ChatGPT), validator compliance và xử lý lỗi/telemetry cơ bản.

Stories

### Story 2.1: Orchestrator API routes & mapping
Acceptance Criteria
1. Cung cấp endpoints (ví dụ) `POST /api/bmad/task`, `POST /api/bmad/doc-out`, `POST /api/bmad/validate`
2. Bảng ánh xạ UI action → agent/task/template cấu hình hoá, dễ mở rộng
3. Unit tests cho mapping và quyền truy cập tài nguyên

### Story 2.2: Template registry + create-doc (Brief/PRD)
Acceptance Criteria
1. FE gọi create-doc với `templateId` (ví dụ: project-brief-tmpl.yaml, prd-tmpl.yaml)
2. BE resolve template từ `.bmad-core/templates/` và ghi đúng file đích (docs/brief.md, docs/prd.md)
3. Xử lý trường hợp thiếu template/đường dẫn; trả thông báo lỗi rõ ràng

### Story 2.3: File writer + `doc-out`
Acceptance Criteria
1. `doc-out` ghi file ra đích; tự tạo thư mục nếu chưa có
2. Trả về đường dẫn/tên file đã tạo/cập nhật
3. Bắt và trả lỗi FS (permission, path invalid) với thông điệp thân thiện

### Story 2.4: Compliance validator (BMAD)
Acceptance Criteria
1. Chặn preload tài nguyên/KB trái quy định; chỉ cho phép tasks/templates hợp lệ
2. Báo lỗi khi gọi task/template không tồn tại hoặc không được phép
3. Ghi sự kiện `validation_failed` (không chứa secrets)

### Story 2.5: LLM provider integration (ChatGPT)
Acceptance Criteria
1. FE quản lý token ở client-side; BE không lưu token; gọi LLM an toàn
2. Chat Drawer gửi/nhận theo định dạng elicitation 1–9; timeout/retry hợp lý
3. Rate limiting cơ bản và thông báo lỗi thân thiện

### Story 2.6: Error handling & telemetry
Acceptance Criteria
1. Chuẩn hóa error envelope (mã, thông điệp, gợi ý)
2. Telemetry sự kiện: task_executed, artifact_written, doc_out, validation_failed
3. Không log token hoặc secrets; PII‑safe

---

# Goals and Background Context

## Goals
- Cung cấp guided UI bám sát BMAD (agents/tasks/templates) để giảm phụ thuộc chat
- Rút ngắn thời gian tạo Brief/PRD/Architecture và thực hiện `doc-out`
- Chuẩn hoá artifact vào `docs/` và `.bmad-core/...` để quản lý bằng Git
- Hỗ trợ rẽ nhánh có kiểm soát và nút “Trở về luồng chính”
- Đảm bảo tuân thủ BMAD qua command mapper và validator

## Background Context
Dựa trên Project Brief, người dùng (đặc biệt non‑tech) gặp khó khi vận hành BMAD qua chat/CLI vì thiếu “đường ray” và dễ lan man. Giải pháp đề xuất là UI‑first nhưng tuân thủ BMAD: hỏi Loại dự án (Greenfield/Brownfield) và Quy mô (Nhỏ/Lớn) để sinh lộ trình chuẩn; cho phép rẽ nhánh có kiểm soát; chat chỉ mở khi cần elicitation.

## Change Log
| Date       | Version | Description                                      | Author  |
|------------|---------|--------------------------------------------------|---------|
| 2025-08-09 | 0.1     | Khởi tạo PRD skeleton từ Project Brief           | PM TBD  |

---

# Requirements (DRAFT – sẽ hoàn thiện qua elicitation 1–9)

## Functional (FR)
- FR1: Người dùng chọn Loại dự án (Greenfield/Brownfield) và Quy mô (Nhỏ/Lớn); hệ thống đề xuất lộ trình chuẩn tương ứng
- FR2: Cung cấp nút “Hiểu quy trình” hiển thị modal với sơ đồ và mô tả; luôn có nút “Trở về luồng chính”
- FR3: Chat Drawer mở theo yêu cầu; khi elicitation, áp dụng định dạng 1–9 bắt buộc
- FR4: Map hành động UI → BMAD (agents/tasks/templates) và ghi artifacts vào `docs/` và `.bmad-core/...`
- FR5: Hiển thị Doc Preview và hỗ trợ `*doc-out`

## Non‑Functional (NFR)
- NFR1: API TTFB (local) ≤ 200ms; LCP trang chính ≤ 2.5s
- NFR2: “Files‑only” persistence ở MVP; tránh môi trường FS ephemeral cho sản xuất
- NFR3: Bảo mật token LLM ở client‑side; CORS same‑origin; log tối thiểu
- NFR4: Mục tiêu “no‑chat completion rate” ≥ 70% (theo dõi qua telemetry)

---

# UI Design Goals (DRAFT)

## UX Vision
- Guided flow thân thiện non‑tech; hiển thị rõ Agent đang hoạt động (tên, role, when‑to‑use, chức năng chính)
- Chat on‑demand; language toggle vi/en (mặc định vi); plain‑language cho mô tả, giữ code/API/tên file tiếng Anh
- Tooltip/Popover giải thích thuật ngữ kỹ thuật; Glossary Drawer để tra cứu nhanh

## Interaction Paradigms
- Sidebar Agents + Action Cards (liệt kê tác vụ map tới agents/tasks/templates BMAD)
- Command Palette (⌘K) để tìm nhanh agent/command/template
- Chat Drawer (elicitation 1–9); breadcrumbs + progress tracker; “Trở về luồng chính”

## Core Screens and Views
- Start: chọn Greenfield/Brownfield + Nhỏ/Lớn; nút “Hiểu quy trình” (sơ đồ + mô tả); Language toggle
- Dashboard theo Agent: header hiển thị role + chức năng; Action Cards theo lệnh `*`
- Flow Runner: trình tự các bước theo lộ trình chuẩn; rẽ nhánh có kiểm soát và quay lại
- Document Preview + Doc‑out: xem và xuất artifact
- Settings & Help: nhập token ChatGPT; bật/tắt ngôn ngữ; Glossary Drawer

## Accessibility
- Mục tiêu WCAG AA, aria theo ngôn ngữ; keyboard navigation đầy đủ; focus management

## Branding
- TailwindCSS + shadcn/ui; theming nhẹ; giữ nhất quán visual với mức AA

---

# Technical Assumptions (DRAFT)

## Repository Structure
- Monorepo (FE+BE cùng repo BMAD); giữ chuẩn thư mục `docs/` và `.bmad-core/...`.

## Service Architecture
- Next.js fullstack monolith.
- Lớp Orchestrator: map UI → BMAD (agents/tasks/templates), ghi file artifacts, validator compliance, telemetry tối giản.
- Abstraction cho LLM provider.

## Testing Requirements
- Unit + Integration (BE Orchestrator, UI components); type-check + lint.
- E2E sau MVP.

## Additional Assumptions
- Files-only ở MVP; PROD cần FS persistent (self-host/VM/Git bot/S3); tránh FS ephemeral.
- LLM: ChatGPT; token lưu client-side; i18n vi/en (mặc định vi); code/API/tên file giữ tiếng Anh.
- Security: không lưu token server; rate limiting; sanitize markdown/mermaid; CORS same-origin.
- Performance: API TTFB (local) ≤ 200ms; LCP trang chính ≤ 2.5s.

---

# Next Steps (PM Handoff)
- PM khởi chạy chế độ tạo PRD theo template `prd-tmpl.yaml` (interactive, elicitation 1–9)
- Rà soát và cập nhật các phần: Requirements (FR/NFR), UI Design Goals (nếu có), Technical Assumptions, Epic List, Epic Details, Checklists, Next Steps
- Khi cần, tham chiếu Project Brief tại `docs/brief.md`


