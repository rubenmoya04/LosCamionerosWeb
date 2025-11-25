// components/ui/ToastNotification.tsx
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function ToastNotification({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // desaparece en 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-500">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-80`}>
        <div className="flex-1 font-bold text-lg">{message}</div>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}