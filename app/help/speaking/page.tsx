import { HelpTopicPage } from "@/components/HelpTopicPage";

export default function SpeakingHelpPage() {
  return <HelpTopicPage titleUz="Talaffuz tekshiruvi ishlamasa" titleRu="Если не работает проверка произношения" introUz="Ovoz tanish brauzer va mikrofon ruxsatiga bog‘liq." introRu="Распознавание речи зависит от браузера и разрешения на микрофон." stepsUz={["Brauzer manzil satridagi qulf belgisini oching.", "Mikrofon ruxsatini Yoqilgan holatiga o‘tkazing.", "Sahifani yangilang va xitoycha so‘zni qayta ayting.", "Brauzer qo‘llamasa Chrome yoki Safari’ning yangi versiyasini sinang."]} stepsRu={["Откройте значок замка в адресной строке.", "Разрешите доступ к микрофону.", "Обновите страницу и повторите китайское слово.", "Если браузер не поддерживается, используйте новую версию Chrome или Safari."]} />;
}
