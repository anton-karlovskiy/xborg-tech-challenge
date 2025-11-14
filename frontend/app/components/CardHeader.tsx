interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Card header component with title, description, and optional action.
 * @param root0 - The props object
 * @param root0.title - The header title text
 * @param root0.description - Optional description text below the title
 * @param root0.action - Optional action element (e.g., button) to display on the right
 * @param root0.className - Additional CSS classes to apply
 * @returns The card header component JSX
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
