import { HelpTopicPage } from "@/components/HelpTopicPage";

export default function PaymentHelpPage() {
  return <HelpTopicPage titleUz="To‘lov test rejimi nima?" titleRu="Что такое тестовый режим оплаты?" introUz="Hozirgi Stripe integratsiyasi sandbox rejimida. Real pul yechilmaydi." introRu="Текущая интеграция Stripe работает в тестовом режиме. Реальные деньги не списываются." stepsUz={["Stripe server kaliti va narx ID’lari serverda sozlangan bo‘lishi kerak.", "Test karta bilan to‘lov oqimini yakunlang.", "Premium ochilmasa muvaffaqiyat sahifasida statusni yangilang.", "Muammo qolsa development diagnostika kodini tekshiring."]} stepsRu={["Серверный ключ Stripe и цены должны быть настроены на сервере.", "Завершите оплату тестовой картой.", "Если Premium не открылся, обновите статус на странице успеха.", "Если проблема остаётся, проверьте код диагностики в режиме разработки."]} />;
}
