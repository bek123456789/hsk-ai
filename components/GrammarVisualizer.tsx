import type { AppLanguage } from "@/types";

type GrammarPart = {
  text: string;
  role: "subject" | "time" | "place" | "verb" | "object" | "question" | "negation" | "modifier";
};

const roleStyles: Record<GrammarPart["role"], string> = {
  subject: "bg-orange-soft text-orange-deep border-orange-soft",
  time: "bg-amber-100 text-amber-800 border-amber-200",
  place: "bg-skysoft text-sky-800 border-sky-100",
  verb: "bg-emerald-50 text-emerald-800 border-emerald-100",
  object: "bg-white text-ink border-orange-soft",
  question: "bg-violet-50 text-violet-800 border-violet-100",
  negation: "bg-rose-50 text-rose-800 border-rose-100",
  modifier: "bg-cream text-stone-700 border-stone-200"
};

const roleLabels: Record<AppLanguage, Record<GrammarPart["role"], string>> = {
  uz: {
    subject: "Ega",
    time: "Vaqt",
    place: "Joy",
    verb: "Fe’l",
    object: "To‘ldiruvchi",
    question: "Savol yuklamasi",
    negation: "Inkor",
    modifier: "Aniqlovchi"
  },
  ru: {
    subject: "Подлежащее",
    time: "Время",
    place: "Место",
    verb: "Глагол",
    object: "Дополнение",
    question: "Вопросительная частица",
    negation: "Отрицание",
    modifier: "Определение"
  },
  en: {
    subject: "Subject",
    time: "Time",
    place: "Place",
    verb: "Verb",
    object: "Object",
    question: "Question particle",
    negation: "Negation",
    modifier: "Modifier"
  }
};

function inferParts(sentence: string): GrammarPart[] {
  const clean = sentence.replace(/[。！？?]/g, "");
  const tokens = clean.match(/我觉得|我们|你们|他们|她们|今天|明天|昨天|现在|学校|商店|家|图书馆|不|没|是|有|在|学习|买|要|去|看|听|说|写|喝|吃|吗|呢|了|[\u3400-\u9fff]/g) ?? Array.from(clean);
  return tokens.map((text, index) => {
    if (["我", "你", "他", "她", "我们", "你们", "他们", "她们"].includes(text) && index <= 1) return { text, role: "subject" };
    if (["今天", "明天", "昨天", "现在"].includes(text)) return { text, role: "time" };
    if (["学校", "商店", "家", "图书馆"].includes(text)) return { text, role: "place" };
    if (["不", "没"].includes(text)) return { text, role: "negation" };
    if (["是", "有", "在", "学习", "买", "要", "去", "看", "听", "说", "写", "喝", "吃", "觉得"].includes(text)) return { text, role: "verb" };
    if (["吗", "呢"].includes(text)) return { text, role: "question" };
    if (["的", "很", "太", "也", "都"].includes(text)) return { text, role: "modifier" };
    return { text, role: "object" };
  });
}

export function GrammarVisualizer({
  sentence,
  language,
  parts,
  className = ""
}: {
  sentence: string;
  language: AppLanguage;
  parts?: GrammarPart[];
  className?: string;
}) {
  const resolvedParts = parts ?? inferParts(sentence);
  const usedRoles = Array.from(new Set(resolvedParts.map((part) => part.role)));

  return (
    <div className={`rounded-[1.75rem] border border-orange-soft/70 bg-white/85 p-4 shadow-soft ${className}`}>
      <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Структура предложения" : language === "en" ? "Sentence structure" : "Gap tuzilishi"}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {resolvedParts.map((part, index) => (
          <span key={`${part.text}-${index}`} className={`inline-flex flex-col rounded-2xl border px-3 py-2 ${roleStyles[part.role]}`}>
            <span className="text-lg font-black leading-none">{part.text}</span>
            <span className="mt-1 text-[10px] font-black">{roleLabels[language][part.role]}</span>
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {usedRoles.map((role) => (
          <span key={role} className={`rounded-full border px-3 py-1 text-[10px] font-black ${roleStyles[role]}`}>
            {roleLabels[language][role]}
          </span>
        ))}
      </div>
    </div>
  );
}
