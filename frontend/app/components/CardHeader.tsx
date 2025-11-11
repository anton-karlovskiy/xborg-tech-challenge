interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function CardHeader({
  title,
  description,
  action,
  className = ""
}: CardHeaderProps) {
  const flexJustify = action ? "justify-between" : "justify-center";
  
  return (
    <div className={`flex ${flexJustify} items-center ${className}`}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export type { CardHeaderProps };

export default CardHeader;