# Epic 3: Guided Flow Engine & KPI Telemetry

Goal
- Xây dựng động cơ “đường ray” (guided flow) dựa trên Loại dự án (Greenfield/Brownfield) và Quy mô (Nhỏ/Lớn), hỗ trợ rẽ nhánh có kiểm soát, quay về luồng chính, và telemetry KPI (no‑chat completion, time‑to‑doc‑out).

Stories

## Story 3.1: Flow configuration & mapping
Acceptance Criteria
1. UI chọn Greenfield/Brownfield + Nhỏ/Lớn và persist lựa chọn
2. Tự động đề xuất workflow mapping mặc định theo tổ hợp đã chọn
3. Nút “Hiểu quy trình” khả dụng ở bước lựa chọn, mở modal sơ đồ + mô tả

## Story 3.2: Flow Runner + breadcrumbs/progress
Acceptance Criteria
1. Hiển thị breadcrumbs + progress theo từng bước của lộ trình chuẩn
2. Hỗ trợ rẽ nhánh có kiểm soát và nút “Trở về luồng chính” luôn hiển thị
3. Persist tiến độ; reload trang không mất trạng thái

## Story 3.3: Branch options & guardrails
Acceptance Criteria
1. Cung cấp nhánh phụ (VD: research/benchmark) và giới hạn vòng lặp rẽ nhánh
2. Telemetry ghi sự kiện bắt đầu/kết thúc nhánh; đo thời lượng nhánh
3. Cảnh báo quay lại luồng chính nếu người dùng đi quá xa

## Story 3.4: KPI telemetry & dashboard stub
Acceptance Criteria
1. Ghi sự kiện: chat_opened, branch_entered, branch_exited, step_completed, doc_out
2. Tính no‑chat completion rate và time‑to‑first doc‑out (trên phiên)
3. Màn hình dashboard KPI tối giản (stub) hiển thị 2 chỉ số trên

## Story 3.5: Chat gating cho elicitation
Acceptance Criteria
1. Chỉ bật Chat Drawer khi bước yêu cầu elicitation (elicit:true)
2. Ép định dạng 1–9; kiểm tra và nhắc nếu không đúng
3. Telemetry đếm số lần mở/đóng chat; gợi ý quay về luồng chính sau khi xong

## Story 3.6: A11y & i18n cho Flow
Acceptance Criteria
1. Keyboard nav đầy đủ; aria/role đúng; focus management
2. i18n vi/en cho toàn bộ thành phần Flow; vi là mặc định
3. Nội dung kỹ thuật (code/API/tên file) giữ tiếng Anh, kèm diễn giải tiếng Việt

---
