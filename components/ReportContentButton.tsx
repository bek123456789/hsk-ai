"use client";

import { Flag } from "lucide-react";
import { useState } from "react";
import { appendLocalItem } from "@/utils/localLearning";
import { useI18n } from "@/utils/i18n";

export function ReportContentButton({ itemId, itemType, hskLevel }: { itemId: string; itemType: string; hskLevel?: number }) {
  const { language } = useI18n();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const reportTypes =
    language === "ru"
      ? ["Ошибка в вопросе", "Неправильный перевод", "Аудио не работает", "Ответ отмечен неправильно", "Ошибка в пиньине", "Объяснение грамматики непонятно", "Другое"]
      : ["Savolda xato bor", "Tarjima noto‘g‘ri", "Audio ishlamadi", "Javob noto‘g‘ri belgilangan", "Pinyin xato", "Grammatik tushuntirish noaniq", "Boshqa"];
  const [reportType, setReportType] = useState(reportTypes[0]);

  function submit() {
    appendLocalItem("hsk-ai-content-reports", {
      id: `report-${Date.now()}`,
      itemId,
      itemType,
      hskLevel,
      reportType,
      message,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      createdAt: new Date().toISOString()
    });
    setSent(true);
    setMessage("");
  }

  return (
    <div>
      <button onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-black text-stone-600 shadow-soft hover:text-orange-deep">
        <Flag className="h-4 w-4 text-orange-brand" />
        {language === "ru" ? "Сообщить об ошибке" : "Xato haqida xabar berish"}
      </button>
      {open ? (
        <div className="mt-3 rounded-3xl border border-orange-soft bg-white/90 p-4 shadow-soft">
          <select value={reportType} onChange={(event) => setReportType(event.target.value)} className="w-full rounded-2xl bg-cream px-4 py-3 text-sm font-black text-ink outline-none">
            {reportTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={language === "ru" ? "Кратко опишите проблему" : "Muammoni qisqacha yozing"}
            className="mt-3 min-h-24 w-full resize-none rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-ink outline-none"
          />
          <button onClick={submit} className="mt-3 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-5 py-3 text-sm font-black text-white shadow-card">
            {language === "ru" ? "Отправить" : "Xabar yuborish"}
          </button>
          {sent ? <p className="mt-3 text-sm font-black text-orange-deep">{language === "ru" ? "Ваше сообщение отправлено" : "Xabaringiz yuborildi"}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
