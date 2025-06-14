"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastNotificationProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: Check,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const toastStyles = {
  success: "bg-success text-success-foreground border-success/20",
  error: "bg-destructive text-destructive-foreground border-destructive/20",
  info: "bg-primary text-primary-foreground border-primary/20",
  warning: "bg-accent text-accent-foreground border-accent/20",
};

export default function ToastNotificationComponent({
  notification,
  onClose,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { id, title, description, type, duration = 5000 } = notification;

  const Icon = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed top-20 right-4 z-50 min-w-[300px] max-w-[400px] rounded-lg border shadow-lg p-4",
            toastStyles[type]
          )}
        >
          <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{title}</p>
              {description && (
                <p className="text-sm opacity-90 mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
