import { useState, useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import type { Question } from "@/hooks/queries/useQA";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Clock, CheckCircle2, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useT, useI18n } from "@/i18n/i18n.context";

const questions = [
  {
    id: 1, user: "منى أحمد", avatar: "من", time: "منذ ساعتين",
    status: "Answered", category: "التطور اللغوي",
    question: "طفلي عمره 5 سنوات ولا يتكلم بطلاقة. هل هذا طبيعي؟",
    reply: "التطور اللغوي يختلف من طفل لآخر. في عمر 3 سنوات، يجب أن يكون الطفل قادراً على تكوين جمل من 3-4 كلمات. إذا كان طفلك لا يتكلم بطلاقة، ننصح بمراجعة أخصائي نطق وتخاطب للتقييم.",
  },
  {
    id: 2, user: "أم مجهولة", avatar: "أم", time: "منذ 4 ساعات",
    status: "Answered", category: "السلوك",
    question: "كيف أتعامل مع نوبات الغضب المتكررة لطفلي؟",
    reply: "نوبات الغضب جزء طبيعي من التطور. ننصح بالهدوء التام عند حدوثها، وتجنب الصراخ، وتوفير بيئة آمنة للطفل حتى يهدأ.",
  },
  {
    id: 3, user: "سارة خالد", avatar: "سا", time: "منذ 6 ساعات",
    status: "Pending", category: "التغذية",
    question: "ابني عمره سنة ونصف ويرفض الأكل الصلب. ماذا أفعل؟",
  },
  {
    id: 4, user: "فاطمة علي", avatar: "فا", time: "منذ يوم",
    status: "Pending", category: "النوم",
    question: "طفلتي عمرها 8 أشهر ولا تنام طوال الليل، هل هذا طبيعي؟",
  },
  {
    id: 5, user: "هدى محمد", avatar: "هد", time: "منذ يومين",
    status: "Answered", category: "التطور الحركي",
    question: "متى يجب أن يبدأ طفلي بالمشي؟ عمره 14 شهر ولم يمش بعد.",
    reply: "معظم الأطفال يبدأون المشي بين 11-15 شهراً. 14 شهراً لا يزال ضمن النطاق الطبيعي، لكن يمكنك تشجيعه بتمارين بسيطة.",
  },
];

import { useQuestions, useAnswerQuestion } from "@/hooks/queries/useQA";
import { toast } from "sonner";

const QuestionsPage = () => {
  const t = useT();
  const { isRTL } = useI18n();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const { data: initialQuestions, isLoading } = useQuestions();
  const [questions, setQuestions] = useState<Question[]>([]);
  const answerMutation = useAnswerQuestion();

  // SignalR integration
  const { connection } = useSignalR("/hubs/qa");

  useEffect(() => {
    if (initialQuestions) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  useEffect(() => {
    if (!connection) return;

    const handleSubmitted = (q: Question) => {
      setQuestions(prev => [q, ...prev]);
    };
    const handleAnswered = (q: Question) => {
      setQuestions(prev => prev.map(item => item.id === q.id ? q : item));
    };

    connection.on("QuestionSubmitted", handleSubmitted);
    connection.on("QuestionAnswered", handleAnswered);

    return () => {
      connection.off("QuestionSubmitted", handleSubmitted);
      connection.off("QuestionAnswered", handleAnswered);
    };
  }, [connection]);

  const handleReply = async (id: string) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;

    try {
      await answerMutation.mutateAsync({
        id,
        doctorId: "doc-1", // Should come from auth context
        answerText: text
      });
      toast.success(isRTL ? "تم إرسال الرد بنجاح" : "Reply sent successfully");
      setReplyTexts(prev => ({ ...prev, [id]: "" }));
    } catch (error) {
      toast.error(isRTL ? "فشل إرسال الرد" : "Failed to send reply");
    }
  };

  const tabs = [
    { key: "All",      label: t("questions_tabAll")      },
    { key: "Pending",  label: t("questions_tabPending")  },
    { key: "Answered", label: t("questions_tabAnswered") },
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesTab = activeTab === "All" || q.status === activeTab;
    const matchesSearch = q.questionTextAr.toLowerCase().includes(search.toLowerCase()) || 
                         (q.questionTextEn?.toLowerCase().includes(search.toLowerCase())) ||
                         (q.id.includes(search));
    return matchesTab && matchesSearch;
  });

  const totalAnswered = questions.filter(q => q.status === "Answered").length;
  const totalPending  = questions.filter(q => q.status === "Pending" || q.status === "pending").length;

  if (isLoading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={isRTL ? "text-right" : ""}>
        <h1 className="text-3xl font-bold text-[#1a2e2a]">{t("questions_title")}</h1>
        <p className="text-[#64748b] mt-1 text-lg">{t("questions_subtitle")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t("questions_total"),   value: questions.length, icon: MessageSquare, bg: "bg-teal-50",   ic: "text-teal-600" },
          { label: t("questions_pending"), value: totalPending,     icon: Clock,         bg: "bg-orange-50", ic: "text-orange-600" },
          { label: t("questions_answered"),value: totalAnswered,    icon: CheckCircle2,  bg: "bg-green-50",  ic: "text-green-600" },
        ].map((k) => (
          <Card key={k.label} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl ${k.bg} flex items-center justify-center`}>
                <k.icon className={`h-6 w-6 ${k.ic}`} />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className="text-3xl font-bold text-[#1a2e2a]">{k.value}</p>
                <p className="text-sm font-medium text-[#64748b]">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Bar */}
      <div className={`flex flex-col md:flex-row gap-4 items-center`}>
        <div className="relative w-full max-w-md">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]`} />
          <input
            placeholder={t("questions_searchPlaceholder")}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isRTL ? "pr-10" : "pl-10"}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="flex bg-[#f1f5f9] p-1 rounded-lg" dir={isRTL ? "rtl" : "ltr"}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#1a2e2a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          const isAnswered = q.status === "Answered";

          return (
            <Card key={q.id} className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group">
              <CardContent className="p-0">
                <div className={`p-6 cursor-pointer ${isRTL ? "text-right" : "text-left"}`} onClick={() => setExpandedId(isExpanded ? null : q.id)}>
                  <div className={`flex justify-between items-start ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`space-y-3 ${isRTL ? "items-start" : "items-end"}`}>
                      <Badge
                        className={`rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider border-none ${
                          isAnswered ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {isAnswered ? `✓ ${isRTL ? "تم الرد" : t("questions_badgeAnswered")}` : `🕒 ${isRTL ? "قيد الانتظار" : t("questions_badgePending")}`}
                      </Badge>
                      <Badge variant="outline" className="text-teal-600 border-teal-100 bg-teal-50/30 font-medium px-3 flex items-center gap-1 w-fit">
                        {q.category}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
                      <div className="text-right">
                        <p className="font-bold text-[#1a2e2a] text-[15px]">{isRTL ? "مستخدم" : "User"} #{q.id.slice(0, 4)}</p>
                        <p className="text-xs text-[#94a3b8] font-medium">{new Date(q.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <Avatar className="h-10 w-10 border-none bg-slate-100">
                        <AvatarFallback className="text-slate-500 font-bold bg-[#f1f5f9] text-[13px]">U</AvatarFallback>
                      </Avatar>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-[#94a3b8]" /> : <ChevronDown className="h-5 w-5 text-[#94a3b8]" />}
                    </div>
                  </div>

                  <div className={`mt-8 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                    <p className="text-[17px] font-medium text-[#334155] leading-relaxed">{q.questionTextAr}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-6">
                      {q.answer && (
                        <div className={`bg-[#f0f9f9] border border-teal-50 rounded-xl p-5 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                          <p className="text-[13px] font-bold text-teal-700 mb-2">{t("questions_adminReply")}</p>
                          <p className="text-[15px] text-[#475569] leading-relaxed">{q.answer.answerText}</p>
                        </div>
                      )}
                      <div className="space-y-4">
                        <Textarea
                          placeholder={t("questions_writeReply")}
                          value={replyTexts[q.id] || ""}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className={`min-h-[120px] bg-white border-[#e2e8f0] rounded-xl p-4 focus-visible:ring-teal-500/20 focus-visible:border-teal-500 ${isRTL ? "text-right" : "text-left"}`}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                        <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                          <Button 
                            onClick={() => handleReply(q.id)}
                            disabled={answerMutation.isPending || !replyTexts[q.id]?.trim()}
                            className="bg-[#0f9d8c] hover:bg-[#0c8a7b] text-white px-6 h-11 rounded-xl flex gap-2 items-center font-bold"
                          >
                            <Send className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                            {answerMutation.isPending ? "..." : t("questions_sendReply")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionsPage;
