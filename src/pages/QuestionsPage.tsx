import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Clock, CheckCircle2, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const questions = [
  {
    id: 1,
    user: "منى أحمد",
    avatar: "من",
    time: "منذ ساعتين",
    status: "Answered",
    category: "التطور اللغوي",
    question: "طفلي عمره 5 سنوات ولا يتكلم بطلاقة. هل هذا طبيعي؟",
    reply: "التطور اللغوي يختلف من طفل لآخر. في عمر 3 سنوات، يجب أن يكون الطفل قادراً على تكوين جمل من 3-4 كلمات. إذا كان طفلك لا يتكلم بطلاقة، ننصح بمراجعة أخصائي نطق وتخاطب للتقييم.",
  },
  {
    id: 2,
    user: "أم مجهولة",
    avatar: "أم",
    time: "منذ 4 ساعات",
    status: "Answered",
    category: "السلوك",
    question: "كيف أتعامل مع نوبات الغضب المتكررة لطفلي؟",
    reply: "نوبات الغضب جزء طبيعي من التطور. ننصح بالهدوء التام عند حدوثها، وتجنب الصراخ، وتوفير بيئة آمنة للطفل حتى يهدأ.",
  },
  {
    id: 3,
    user: "سارة خالد",
    avatar: "سا",
    time: "منذ 6 ساعات",
    status: "Pending",
    category: "التغذية",
    question: "ابني عمره سنة ونصف ويرفض الأكل الصلب. ماذا أفعل؟",
  },
  {
    id: 4,
    user: "فاطمة علي",
    avatar: "فا",
    time: "منذ يوم",
    status: "Pending",
    category: "النوم",
    question: "طفلتي عمرها 8 أشهر ولا تنام طوال الليل، هل هذا طبيعي؟",
  },
  {
    id: 5,
    user: "هدى محمد",
    avatar: "هد",
    time: "منذ يومين",
    status: "Answered",
    category: "التطور الحركي",
    question: "متى يجب أن يبدأ طفلي بالمشي؟ عمره 14 شهر ولم يمش بعد.",
    reply: "معظم الأطفال يبدأون المشي بين 11-15 شهراً. 14 شهراً لا يزال ضمن النطاق الطبيعي، لكن يمكنك تشجيعه بتمارين بسيطة.",
  },
];

const QuestionsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesTab = activeTab === "All" || q.status === activeTab;
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) || q.user.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a2e2a]">Questions & Replies</h1>
        <p className="text-[#64748b] mt-1 text-lg">Review and respond to parent questions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a2e2a]">5</p>
              <p className="text-sm font-medium text-[#64748b]">Total Questions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a2e2a]">2</p>
              <p className="text-sm font-medium text-[#64748b]">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a2e2a]">3</p>
              <p className="text-sm font-medium text-[#64748b]">Answered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
          <Input 
            placeholder="Search questions..." 
            className="h-10 pl-10 bg-white border-[#e2e8f0] rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-[#f1f5f9] p-1 rounded-lg">
          {["All", "Pending", "Answered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "bg-teal-600 text-white shadow-sm" 
                  : "text-[#64748b] hover:text-[#1a2e2a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <Card key={q.id} className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group">
              <CardContent className="p-0">
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(q.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <Badge 
                        className={`rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider border-none ${
                          q.status === "Answered" 
                            ? "bg-green-50 text-green-700" 
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {q.status === "Answered" ? "✓ Answered" : "🕒 Pending"}
                      </Badge>
                      <div>
                        <Badge variant="outline" className="text-teal-600 border-teal-100 bg-teal-50/30 font-medium px-3 flex items-center gap-1 w-fit">
                          {q.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-[#94a3b8]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#94a3b8]" />
                      )}
                      <div>
                        <p className="font-bold text-[#1a2e2a] text-[15px]">{q.user}</p>
                        <p className="text-xs text-[#94a3b8] font-medium">{q.time}</p>
                      </div>
                      <Avatar className="h-10 w-10 border-none bg-slate-100">
                        <AvatarFallback className="text-slate-500 font-bold bg-[#f1f5f9] text-[13px]">{q.avatar}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <div className="mt-8 text-right" dir="rtl">
                    <p className="text-[17px] font-medium text-[#334155] leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-6">
                      {/* Admin Reply */}
                      {q.reply && (
                        <div className="bg-[#f0f9f9] border border-teal-50 rounded-xl p-5" dir="rtl">
                          <p className="text-[13px] font-bold text-teal-700 mb-2">رد الإدارة:</p>
                          <p className="text-[15px] text-[#475569] leading-relaxed">
                            {q.reply}
                          </p>
                        </div>
                      )}

                      {/* Reply Input */}
                      <div className="space-y-4">
                        <div className="relative">
                          <Textarea 
                            placeholder="...Write your reply"
                            className="min-h-[120px] bg-white border-[#e2e8f0] rounded-xl p-4 text-right focus-visible:ring-teal-500/20 focus-visible:border-teal-500"
                            dir="rtl"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button className="bg-[#0f9d8c] hover:bg-[#0c8a7b] text-white px-6 h-11 rounded-xl flex gap-2 items-center font-bold">
                            <Send className="h-4 w-4" />
                            Send Reply
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

