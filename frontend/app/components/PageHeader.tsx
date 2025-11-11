// ninja focus touch <
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className = "" }: PageHeaderProps) {
  const flexJustify = action ? "justify-between" : "justify-center";
  
  return (
    <div className={`flex ${flexJustify} items-center mb-8 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-2">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
// ninja focus touch >