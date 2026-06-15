import { HelpTopicPage } from "@/components/HelpTopicPage";

export default function AIHelpPage() {
  return <HelpTopicPage titleUz="AI yordamchi qanday ishlaydi?" titleRu="Как работает AI-наставник?" introUz="Yordamchi HSK darslari, zaif so‘zlar va xatolaringizdan ixcham kontekst oladi." introRu="Наставник получает краткий контекст из уроков HSK, слабых слов и ваших ошибок." stepsUz={["Savolingiz HSK va xitoy tili mavzusida bo‘lishi kerak.", "Javoblar Hanzi, pinyin va o‘zbekcha izoh bilan beriladi.", "Kunlik limit rejangizga qarab yangilanadi.", "Maxfiy API kaliti faqat serverda ishlaydi."]} stepsRu={["Вопрос должен относиться к HSK или китайскому языку.", "Ответы содержат иероглифы, пиньинь и объяснение на русском.", "Дневной лимит зависит от вашего плана.", "Секретный ключ API используется только на сервере."]} />;
}
