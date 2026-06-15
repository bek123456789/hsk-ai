"use client";

"use client";

import { PremiumLock } from "@/components/PremiumLock";
import { PracticeLevelSelector } from "@/components/PracticeLevelSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { isPremiumProfile } from "@/utils/premium";

export default function ExamCoachPage() {
  const user = useAuthStore((state) => state.user);
  const premium = isPremiumProfile(user);

  return (
    <ProtectedRoute>
      {premium ? (
        <PracticeLevelSelector
          basePath="/exam-coach"
          titleUz="Imtihon murabbiyi"
          titleRu="Экзаменационный наставник"
          subtitleUz="HSK uslubidagi testlarga tayyorgarlik, zaif ko‘nikmalar va 7 kunlik reja."
          subtitleRu="Подготовка к тренировочным тестам HSK, слабые навыки и план на 7 дней."
        />
      ) : (
        <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
          <PremiumLock featureKey="examCoach" />
        </section>
      )}
    </ProtectedRoute>
  );
}
