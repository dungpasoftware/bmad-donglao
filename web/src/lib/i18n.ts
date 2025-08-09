export const supportedLocales = ["vi", "en"] as const;
export type Locale = typeof supportedLocales[number];

export function isValidLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (supportedLocales as readonly string[]).includes(value)
  );
}

export const i18nStrings: Record<Locale, Record<string, string>> = {
  vi: {
    appTitle: "Bmad Donglao",
    appDescription: "Shadcn/ui + Tailwind v4 smoke test",
    primary: "Chính",
    secondary: "Phụ",
    language: "Ngôn ngữ",
    vi: "Tiếng Việt",
    en: "English",
    agentsLabel: "Agents",
    smName: "Scrum Master",
    smRole: "Điều phối và đảm bảo quy trình Scrum",
    smWhenToUse: "Khi cần điều phối Sprint/ceremonies hoặc rà soát tiến độ",
    smTopFunctions: "Chức năng chính",
    cmdHelpTitle: "Help",
    cmdHelpDesc: "Hiển thị trợ giúp và hướng dẫn",
    cmdDraftTitle: "Draft",
    cmdDraftDesc: "Tạo bản nháp tài liệu hoặc story",
    cmdChecklistTitle: "Story Checklist",
    cmdChecklistDesc: "Chạy checklist kiểm tra story",
    cmdCorrectCourseTitle: "Correct Course",
    cmdCorrectCourseDesc: "Đề xuất điều chỉnh khi lệch hướng",
    cmdExitTitle: "Exit",
    cmdExitDesc: "Thoát khỏi agent",
    headerTopFunctions: "Chức năng chính",
    viewDetails: "Xem chi tiết",
    backHome: "Quay về trang chính",
    openPalette: "Mở Command Palette",
    toggleChat: "Mở/Đóng Chat Drawer",
    chatDrawerTitle: "Ngăn chat",
    paletteTitle: "Bảng lệnh",
    searchPlaceholder: "Tìm agent, command, template",
    noResults: "Không có kết quả",
    close: "Đóng",
    done: "Hoàn tất",
    typeAgent: "agent",
    typeCommand: "command",
    typeTemplate: "template",
    tmplStory: "Mẫu Story",
  },
  en: {
    appTitle: "Bmad Donglao",
    appDescription: "Shadcn/ui + Tailwind v4 smoke test",
    primary: "Primary",
    secondary: "Secondary",
    language: "Language",
    vi: "Vietnamese",
    en: "English",
    agentsLabel: "Agents",
    smName: "Scrum Master",
    smRole: "Facilitates and safeguards Scrum process",
    smWhenToUse: "Use when coordinating Sprint/ceremonies or progress reviews",
    smTopFunctions: "Top functions",
    cmdHelpTitle: "Help",
    cmdHelpDesc: "Show help and guidance",
    cmdDraftTitle: "Draft",
    cmdDraftDesc: "Create document or story drafts",
    cmdChecklistTitle: "Story Checklist",
    cmdChecklistDesc: "Run story validation checklist",
    cmdCorrectCourseTitle: "Correct Course",
    cmdCorrectCourseDesc: "Propose adjustments when off-track",
    cmdExitTitle: "Exit",
    cmdExitDesc: "Exit the agent",
    headerTopFunctions: "Top functions",
    viewDetails: "View details",
    backHome: "Back to Home",
    openPalette: "Open Command Palette",
    toggleChat: "Toggle Chat Drawer",
    chatDrawerTitle: "Chat Drawer",
    paletteTitle: "Command Palette",
    searchPlaceholder: "Search agents, commands, templates",
    noResults: "No results",
    close: "Close",
    done: "Done",
    typeAgent: "agent",
    typeCommand: "command",
    typeTemplate: "template",
    tmplStory: "Story Template",
  },
};

export type I18nKey = keyof typeof i18nStrings["vi"];

export function t(key: I18nKey, locale: Locale): string {
  return i18nStrings[locale][key];
}


