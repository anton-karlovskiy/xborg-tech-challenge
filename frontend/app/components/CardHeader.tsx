interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 *
 * @param root0
 * @param root0.title
 * @param root0.description
 * @param root0.action
 * @param root0.className
 */
function CardHeader({
  title,
  description,
  action,
  className = "",
}: CardHeaderProps) {
  const flexJustify = action ? "justify-between" : "justify-center";

  return (
    <div className={`flex ${flexJustify} items-center ${className}`}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {description ? <p className="text-gray-600">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export type { CardHeaderProps };

export default CardHeader;
