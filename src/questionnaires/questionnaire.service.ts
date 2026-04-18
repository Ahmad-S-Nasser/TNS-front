import { QuestionnaireContent } from "./questionnaire.types";
import { getAllContent, createContent, updateContent } from "@/content-management/cms.service";

class QuestionnaireService {
  async getQuestionnaires() {
    return getAllContent("questionnaires") as QuestionnaireContent[];
  }

  async saveQuestionnaire(id: string | "new", data: Partial<QuestionnaireContent>) {
    if (id === "new") {
      return createContent({
        ...data,
        section: "questionnaires",
        status: "draft",
        requires_doctor_approval: true,
      } as any);
    }
    return updateContent(id, data);
  }

  async toggleActive(id: string, active: boolean) {
    return updateContent(id, { is_active: active });
  }
}

export const questionnaireService = new QuestionnaireService();
