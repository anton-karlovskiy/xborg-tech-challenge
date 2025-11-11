// ninja focus touch <
import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "error" | "success" | "info" | "warning";
  className?: string;
}

export function Alert({ children, variant = "error", className = "" }: AlertProps) {
  const variantStyles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700"
  };

  return (
    <div className={`p-3 border rounded-lg text-sm ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
// ninja focus touch >