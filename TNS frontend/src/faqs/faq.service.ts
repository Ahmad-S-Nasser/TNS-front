import { FAQContent } from "./faq.types";
import { getAllContent, createContent, updateContent } from "@/content-management/cms.service";

class FAQService {
  async getFAQs() {
    return getAllContent("faqs") as FAQContent[];
  }

  async saveFAQ(id: string | "new", data: Partial<FAQContent>) {
    if (id === "new") {
      return createContent({
        ...data,
        section: "faqs",
        status: "published",
      } as any);
    }
    return updateContent(id, data);
  }
}

export const faqService = new FAQService();
