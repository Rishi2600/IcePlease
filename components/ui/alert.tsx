import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  error: {
    wrapper: "border-danger/30 bg-danger-soft text-danger",
    Icon: AlertCircle,
  },
  success: {
    wrapper: "border-mint-deep/25 bg-mint/15 text-mint-deep",
    Icon: CheckCircle2,
  },
  info: {
    wrapper: "border-line bg-surface-sunken text-ink-soft",
    Icon: Info,
  },
} as const;

/**
 * Status messaging. The icon plus wording carry the meaning, so the message
 * still reads correctly without colour.
 */
export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: keyof typeof TONES;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { wrapper, Icon } = TONES[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        wrapper,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={title ? "mt-0.5" : ""}>{children}</div> : null}
      </div>
    </div>
  );
}
