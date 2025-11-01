import React from "react";
import { cn } from "@/lib/utils";

export default function GradientBorder({ children, className }) {
  return (
    <div
      className={cn(
        "animate-border overflow-hidden rounded-xl border border-transparent [background:linear-gradient(45deg,transparent,transparent_50%,transparent)_padding-box,conic-gradient(from_var(--border-angle),transparent_80%,var(--color-indigo-500)_86%,var(--color-indigo-700)_90%,var(--color-indigo-500)_94%,--theme(--color-slate-600/.48))_border-box]",
        className
      )}
    >
      {children}
    </div>
  );
}
