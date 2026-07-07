"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl",
      "animate-in slide-in-from-bottom-4 fade-in duration-300",
      type === "success" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      type === "error" && "bg-destructive/10 border-destructive/20 text-destructive",
      type === "warning" && "bg-amber-500/10 border-amber-500/20 text-amber-400",
    )}>
      {type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
      {type === "error" && <AlertCircle className="h-4 w-4 shrink-0" />}
      {type === "warning" && <AlertTriangle className="h-4 w-4 shrink-0" />}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
