---
title: "Project Brief: BMAD Brainstorming Web UI"
---

# Executive Summary

- Product concept: Web UI điều khiển BMAD bằng nút/bảng chọn thay vì gõ lệnh; chat chỉ mở khi cần (drawer). Hỗ trợ chọn Agent/Task/Template, ánh xạ sang lệnh BMAD hợp lệ và sinh artifact vào `docs/` và `.bmad-core/...`. MVP dùng ChatGPT token.
- Primary problem: Vận hành BMAD qua lệnh/chat gây ma sát cho non‑tech; khó khám phá task/agent; dễ mất mạch ngữ cảnh; rào cản tiếp nhận.
- Target market: PM/PO/Stakeholder không kỹ thuật và Dev/QA/SM muốn dùng BMAD có hướng dẫn trực quan.
- Key value proposition: Zero‑command UI, tuân thủ BMAD, giảm thất lạc ngữ cảnh, tạo tài liệu nhanh, kiểm soát qua Git, chat on‑demand khi cần elicit/clarify.

---


# Change Log

| Date       | Version | Description                                                | Author |
|------------|---------|------------------------------------------------------------|--------|
| 2025-08-09 | 0.2     | Đồng bộ Technology Preferences: Next.js 15, React 19 (FE) | PO     |

---

# MVP Scope

## Core Features (Must Have)
- Guided flow: chọn Loại dự án (Greenfield/Brownfield) + Quy mô (Nhỏ/Lớn); nút “Hiểu quy trình” (modal + sơ đồ + mô tả); breadcrumbs + progress tracker; rẽ nhánh có kiểm soát và “Trở về luồng chính”.
- UI chính: Sidebar Agents + Action Cards + Command Palette (⌘K).
- Chat Drawer on‑demand: chỉ mở khi cần elicitation; tuân thủ định dạng 1–9.
- Orchestrator: map UI → BMAD (agents/tasks/templates), ghi artifacts vào `docs/` và `.bmad-core/...`.
- Doc Preview + `*doc-out`.
- Settings: nhập/kiểm tra ChatGPT token (client‑side).
- Telemetry: sự kiện flow (mở chat, rẽ nhánh, quay về, doc‑out) để tính KPI.
- Validator BMAD: chặn hành động không hợp lệ, bảo đảm compliance.

## Out of Scope (MVP)
- Cursor chat bridge (sẽ cân nhắc hậu kỳ)
- Multi‑provider LLM (ngoài ChatGPT)
- Đăng nhập/đa người dùng phức tạp, RBAC
- CI/CD, theo dõi sản xuất, A/B test
- Theming sâu, mobile app native

## MVP Success Criteria
- No‑chat completion rate ≥ 70%
- Time‑to‑first doc‑out ≤ 10 phút
- Artifact validity (validator BMAD) ≥ 95%
- Branch‑return compliance ≥ 90%
- Tất cả actions map đúng agents/tasks/templates, không preload trái quy định

Rationale (ngắn)
- Tập trung giải quyết discoverability + “đường ray” + compliance BMAD.
- Giữ phạm vi gọn để đạt KPI và thời gian triển khai ngắn.

---


# Post‑MVP Vision

## Phase 2 Features
- Cursor chat bridge làm provider tuỳ chọn (song song ChatGPT)
- Multi‑provider LLM + routing theo use‑case/chi phí/chất lượng
- Lưu trữ phiên + cộng tác nhiều người dùng (RBAC nhẹ)
- UX nâng cao: theming, accessibility, offline cache
- Tự động gợi ý epic/story từ PRD/Architecture (điều phối qua SM/PO)

## Long‑term Vision (1–2 năm)
- Plugin marketplace cho agents/tasks/templates tuỳ chỉnh
- Workflow composer trực quan (kéo‑thả) để cá nhân hoá “đường ray”
- Phân tích chất lượng quy trình (process mining) và đề xuất tối ưu
- Guardrails kiểm soát chi phí LLM và hiệu năng

## Expansion Opportunities
- Tích hợp kho mẫu domain‑specific (y tế/tài chính/giáo dục...)
- Bộ phân tích ROI cho sản phẩm/phiên bản
- Gợi ý tự động “next best action” dựa trên telemetries

---


# Technical Considerations

## Platform Requirements
- Target: Web responsive (desktop‑first, mobile‑friendly)
- Browsers: Chrome/Edge/Safari last 2 versions
- Performance: API TTFB ≤ 200ms (local), LCP ≤ 2.5s (trang chính), RUM tối giản

## Technology Preferences
- Frontend: Next.js 15 (App Router), React 19, TypeScript, UI: TailwindCSS + shadcn/ui, Command Palette, Drawer Chat
- Backend: Node 20, Next.js API routes (hoặc Express trong Next), Orchestrator service map UI → BMAD (agents/tasks/templates), ghi files
- Database: Không dùng DB cho MVP; “files‑only” (docs/, .bmad‑core/...). Phase 2: SQLite/Postgres cho session/telemetry
- Hosting/Infra: Dev cục bộ. Prod: container/VM. Lưu ý nền tảng ephemeral FS (VD: Vercel) không phù hợp “files‑only” → cân nhắc self‑host/Git commit bot/S3

## Architecture Considerations
- Repository Structure: Monorepo (FE+BE cùng repo BMAD); giữ cấu trúc docs/, .bmad‑core/...
- Service Architecture: Monolith (Next fullstack); module Orchestrator tách lớp
- Integration Requirements: Quyền ghi FS; LLM Provider abstraction (ChatGPT token client‑side); endpoints: run task, doc‑out, validate

## Security/Compliance
- Token chỉ lưu client‑side; CORS same‑origin; log tối thiểu, tránh rò rỉ secrets
- Kiểm tra nội dung nhập (chặn mã độc trong mermaid/markdown preview)

Rationale (ngắn)
- “Files‑only” bám chuẩn BMAD và Git, giảm độ phức tạp MVP
- Next.js fullstack rút ngắn triển khai, dễ thêm provider LLM/Cursor bridge hậu kỳ
- Monolith đơn giản hóa orchestration/telemetry

---


# Constraints & Assumptions

## Constraints
- Budget: MVP tối giản; chi phí LLM (ChatGPT) theo mức tiêu thụ; đặt ngưỡng cảnh báo/throttle.
- Timeline: MVP ≤ 4 tuần; bàn giao guided flow, mapping UI→BMAD, `doc-out`, telemetry cơ bản.
- Resources: 1 Full‑stack dev (chính), 1 PM/Analyst bán thời gian, 1 QA bán thời gian.
- Technical: Files‑only (không DB); chỉ ChatGPT provider ở MVP; self‑host/VM để ghi file; tránh platform FS ephemeral.

## Key Assumptions
- Người dùng non‑tech có thể vận hành qua UI với chat hạn chế; Chat Drawer chỉ mở khi cần elicitation.
- Tổ chức chấp nhận chuẩn BMAD: artifacts tại `docs/` và `.bmad-core/...` và quản lý qua Git.
- Token LLM do người dùng cung cấp, lưu client‑side, BE không lưu trữ.
- Thuật ngữ kỹ thuật, tên file/lệnh/code giữ tiếng Anh; phản hồi hội thoại tiếng Việt.
- Có thể mở rộng đa provider LLM và Cursor bridge sau MVP mà không phá cấu trúc.
- Quyết định Greenfield/Brownfield và Nhỏ/Lớn được chọn sớm và cố định “đường ray” mặc định; vẫn cho phép rẽ nhánh và quay về.

---


# Risks & Open Questions

## Key Risks
- Lẫn lộn trục Quy mô (Nhỏ/Lớn) với Loại dự án (Greenfield/Brownfield) → chọn sai “đường ray” mặc định
- Nền tảng lưu trữ có FS ephemeral (VD: Vercel) gây lỗi khi ghi `docs/` và `.bmad-core/...`
- Bảo mật token (client‑side) và chia sẻ máy/phiên làm rò rỉ khóa
- Lạm dụng rẽ nhánh (branch) dẫn tới quá nhiều ngã rẽ, khó quay về trục chính nếu UI/telemetry không đủ mạnh
- Chất lượng artifacts nếu người dùng bỏ qua elicitation 1–9 hoặc ép YOLO quá sớm
- Phụ thuộc một provider LLM (ChatGPT) ở MVP: rủi ro chi phí/giới hạn tốc độ

## Open Questions
- Hạ tầng production: self‑host/VM hay tích hợp Git commit bot/S3 để đảm bảo persistence?
- Lịch tích hợp Cursor bridge: pha nào? có bật song song với ChatGPT ở Phase 2?
- Chính sách logging/telemetry: ẩn danh và mức chi tiết nào là chấp nhận được?
- Chuẩn review artifacts: checklist nào cho PM/Architect/PO trước khi doc‑out?
- Ngưỡng KPI được chấp nhận cho go‑live MVP (ví dụ no‑chat ≥ 70% có đủ?)

## Areas Needing Further Research
- RUM tối giản để đo LCP/TTFB chính xác trong môi trường dev/prod
- Mẫu UI “guided flow” tốt nhất cho non‑tech (so sánh wizard vs cards + palette)
- Chiến lược lưu trữ phiên/telemetry (files‑only vs DB nhẹ ở Phase 2)

---

# Problem Statement

- Current state & pain points: Vận hành BMAD qua chat/command thiếu “đường ray” dẫn hướng; không có bước chọn quy mô dự án (lớn/nhỏ) để cấu hình lộ trình phù hợp; khi rẽ nhánh không có nút quay về luồng chính → người dùng (đặc biệt non‑tech) dễ lan man và mất mạch.
- Impact: Tỷ lệ hoàn tất flow không cần chat thấp, thời gian hoàn thành tài liệu dài, gánh nặng nhận thức cao; đầu ra thiếu nhất quán giữa các lần chạy.
- Why existing solutions fall short: Công cụ chat/CLI không hỗ trợ flow‑gated theo quy mô dự án và không có cơ chế “branch‑then‑return”; UI (nếu có) chưa map chặt vào agents/tasks/templates của BMAD.
- Urgency: Cần một UI‑first nhưng “BMAD‑compliant” để đưa người dùng đi đúng lộ trình, cho phép rẽ nhánh có kiểm soát và luôn đảm bảo đường về “trục chính”.

---


# Proposed Solution

- Core concept: UI điều hướng theo “đường ray” (guided flow) dựa trên hai trục độc lập: Loại dự án (Greenfield/Brownfield) và Quy mô (Nhỏ/Lớn). Hệ thống sinh “lộ trình chuẩn” theo BMAD cho từng tổ hợp, cho phép rẽ nhánh có kiểm soát và luôn có nút “Trở về luồng chính”.
- Guided flow (ví dụ mặc định):
  - Greenfield + Nhỏ (MVP): Brief → PRD (lite) → Architecture (gọn) → Epic/Story → Dev/QA → doc-out
  - Greenfield + Lớn: Brief → PRD (full) → Architecture (FS/FE/BE) → Epic roadmap → Sharding Story → Dev/QA → doc-out
  - Brownfield + Nhỏ: Brief → PRD (lite) → (brownfield-ui|brownfield-service) → Epic/Story → Dev/QA → doc-out
  - Brownfield + Lớn: Brief → PRD (full) → brownfield-fullstack → Impact/Migration/Regression → Epic roadmap → Sharding → Dev/QA → doc-out
- Nút “Hiểu quy trình”: hiển thị modal khi người dùng chọn Loại dự án và Quy mô, gồm sơ đồ luồng + mô tả ngắn; luôn có nút “Trở về luồng chính”.
  - Dự án nhỏ (MVP): 1–2 epics, 5–15 stories; go‑live ≤ 4 tuần; PRD/Architecture tối giản; mục tiêu: hoàn tất flow không cần chat.
  - Dự án lớn (Enterprise): 3+ epics, 30–100 stories; chia phase; yêu cầu bảo mật/hiệu năng/tuân thủ; Architecture FS/FE/BE đầy đủ.
  - Greenfield: sản phẩm mới, ít ràng buộc legacy.
  - Brownfield: tích hợp/tái cấu trúc vào hệ thống hiện có; cần đánh giá ảnh hưởng, migration, regression.

```mermaid
graph TD
  A[Chọn Loại dự án] -->|Greenfield| B[Chọn Quy mô]
  A -->|Brownfield| C[Chọn Quy mô]

  B -->|Nhỏ| GF_S[GF+Nhỏ: Brief → PRD (lite) → Arch (gọn) → Epic/Story → Dev/QA → Doc-out]
  B -->|Lớn| GF_L[GF+Lớn: Brief → PRD (full) → Arch (FS/FE/BE) → Epic roadmap → Sharding → Dev/QA → Doc-out]

  C -->|Nhỏ| BF_S[BF+Nhỏ: Brief → PRD (lite) → (brownfield-ui|service) → Epic/Story → Dev/QA → Doc-out]
  C -->|Lớn| BF_L[BF+Lớn: Brief → PRD (full) → brownfield-fullstack → Impact/Migration → Epic roadmap → Sharding → Dev/QA → Doc-out]

  %% Rẽ nhánh có kiểm soát
  GF_S --> R[Branch (research/benchmark)]
  GF_L --> R
  BF_S --> R
  BF_L --> R
  R --> RT[Trở về luồng chính]
```

- BMAD compliance: Mọi hành động UI map tới agent/task/template hợp lệ (ví dụ `create-doc` + `prd-tmpl.yaml`), artifacts ghi vào `docs/` và `.bmad-core/...`, không preload ngoài quy định; bám sát hướng dẫn BMad Method [tham chiếu](https://github.com/bmad-code-org/BMAD-METHOD/tree/main?tab=readme-ov-file).
- KPI support: Ghi nhận tỉ lệ hoàn tất flow không cần chat; số lần rẽ nhánh/quay lại; thời gian tới doc-out đầu tiên.

---


# Target Users

- Primary User Segment: PM/PO/Stakeholder không kỹ thuật
  - Hồ sơ: Quản lý sản phẩm/kinh doanh, ra quyết định, không quen CLI.
  - Hành vi: Ưa giao diện theo bước và nút; muốn có “đường ray” rõ ràng; xem/duyệt tài liệu.
  - Nhu cầu/điểm đau: Khó khám phá agent/task; sợ lan man; cần rẽ nhánh có kiểm soát và “Trở về luồng chính”; muốn đo KPI; hạn chế phải chat.
  - Mục tiêu: Tạo Brief/PRD/Architecture nhanh, nhất quán; kiểm soát bằng Git; tối thiểu tương tác chat.

- Secondary User Segment: Dev/QA/SM (kỹ thuật)
  - Hồ sơ: Làm việc trong IDE/Cursor; thực thi task/story; kiểm thử/chất lượng.
  - Hành vi: Ưa tác vụ rõ ràng; cần mapping UI→BMAD (agent/task/template) chuẩn; ít đổi ngữ cảnh.
  - Nhu cầu/điểm đau: Muốn UI sinh artifact đúng chỗ (`docs/`, `.bmad-core/...`); không phá workflow BMAD; có checklist/validation.
  - Mục tiêu: Nâng tốc độ và chất lượng; giảm tải nhận thức; giữ quy trình nhất quán.

---


# Goals & Success Metrics

## Business Objectives
- Cung cấp guided UI bám sát BMAD (agents/tasks/templates) để giảm phụ thuộc chat
- Rút ngắn thời gian tạo Brief/PRD/Architecture và xuất `doc-out`
- Chuẩn hoá artifact vào `docs/` và `.bmad-core/...` để quản lý Git
- Hỗ trợ rẽ nhánh có kiểm soát và “Trở về luồng chính” nhằm tránh lan man
- Đảm bảo tuân thủ quy trình/chuẩn BMAD qua command mapper và validator

## User Success Metrics
- Điểm dễ sử dụng (SUS/CSAT) của non‑tech ≥ 4/5
- Khả năng khám phá task/agent (self‑reported) ≥ 4/5
- Số lần mở Chat/phiên hoàn tất ≤ 1 (trung vị)
- Tỷ lệ hoàn tất flow “không cần chat” tăng dần theo phiên bản
- Thời gian onboarding non‑tech tới doc đầu tiên ≤ 10 phút

## KPIs (đề xuất với mục tiêu MVP)
- No‑chat completion rate: ≥ 70%
- Median time‑to‑first doc‑out: ≤ 10 phút
- Artifact validity rate (qua validator BMAD): ≥ 95%
- Branch‑return compliance (quay về trục chính ≤ 2 bước): ≥ 90%
- UX satisfaction (CSAT của primary segment): ≥ 4/5

Rationale (tóm tắt)
- Gắn trực tiếp với mục tiêu giảm ma sát và tăng hoàn tất flow không cần chat.
- Sử dụng chỉ số có thể đo trong UI/BE (telemetry) và review được bằng Git.
- Mục tiêu MVP thực tế để đo lường sớm, có thể nâng dần ở các phiên bản sau.

---


