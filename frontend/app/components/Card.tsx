// ninja focus touch <
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {children}
    </div>
  );
}
// ninja focus touch >