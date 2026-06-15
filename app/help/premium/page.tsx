import { HelpTopicPage } from "@/components/HelpTopicPage";

export default function PremiumHelpPage() {
  return <HelpTopicPage titleUz="Premium qanday ishlaydi?" titleRu="Как работает Premium?" introUz="Premium test Stripe obunasi yoki yoqilgan bo‘lsa 3 kunlik sinov orqali faollashadi." introRu="Premium активируется через тестовую подписку Stripe или трёхдневный пробный доступ, если он включён." stepsUz={["Premium sahifasida oylik yoki yillik rejani tanlang.", "Stripe test to‘lov sahifasini yakunlang.", "Webhook profil holatini yangilashini kuting.", "Obunani Profil sahifasidan boshqaring."]} stepsRu={["Выберите ежемесячный или ежегодный план.", "Завершите тестовую оплату Stripe.", "Подождите обновления профиля через webhook.", "Управляйте подпиской со страницы профиля."]} />;
}
