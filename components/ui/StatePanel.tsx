import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function StatePanel({
  kind = "empty",
  title,
  description,
  action
}: {
  kind?: "empty" | "loading" | "error";
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const Icon = kind === "loading" ? Loader2 : kind === "error" ? AlertCircle : Inbox;
  return (
    <div className={`rounded-[2rem] border p-8 text-center shadow-soft ${kind === "error" ? "border-rose-200 bg-rose-50" : "border-orange-soft/70 bg-white/88"}`}>
      <Icon className={`mx-auto h-9 w-9 text-orange-brand ${kind === "loading" ? "animate-spin" : ""}`} />
      <h2 className="mt-4 text-2xl font-black text-ink">{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-xl font-semibold leading-7 text-stone-600">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
