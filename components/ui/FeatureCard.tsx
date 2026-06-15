import type { LucideIcon } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft">
        <Icon className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-stone-600">{description}</p>
      <AppButton href={href} variant="secondary" className="mt-6 w-full">
        {action}
      </AppButton>
    </Card>
  );
}
