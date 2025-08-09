import { type Locale } from "@/lib/i18n";

export type AgentId = "sm";

export type AgentCommandId =
  | "sm:help"
  | "sm:draft"
  | "sm:story-checklist"
  | "sm:correct-course"
  | "sm:exit";

export type AgentCommand = {
  id: AgentCommandId;
  titleKey: "cmdHelpTitle" | "cmdDraftTitle" | "cmdChecklistTitle" | "cmdCorrectCourseTitle" | "cmdExitTitle";
  descKey: "cmdHelpDesc" | "cmdDraftDesc" | "cmdChecklistDesc" | "cmdCorrectCourseDesc" | "cmdExitDesc";
};

export type Agent = {
  id: AgentId;
  nameKey: "smName";
  roleKey: "smRole";
  whenToUseKey: "smWhenToUse";
  topFunctionsKey: "smTopFunctions";
  commands: AgentCommand[];
};

export const agents: Agent[] = [
  {
    id: "sm",
    nameKey: "smName",
    roleKey: "smRole",
    whenToUseKey: "smWhenToUse",
    topFunctionsKey: "smTopFunctions",
    commands: [
      { id: "sm:help", titleKey: "cmdHelpTitle", descKey: "cmdHelpDesc" },
      { id: "sm:draft", titleKey: "cmdDraftTitle", descKey: "cmdDraftDesc" },
      { id: "sm:story-checklist", titleKey: "cmdChecklistTitle", descKey: "cmdChecklistDesc" },
      { id: "sm:correct-course", titleKey: "cmdCorrectCourseTitle", descKey: "cmdCorrectCourseDesc" },
      { id: "sm:exit", titleKey: "cmdExitTitle", descKey: "cmdExitDesc" },
    ],
  },
];

export function getAgentById(id: AgentId): Agent | undefined {
  return agents.find((a) => a.id === id);
}


