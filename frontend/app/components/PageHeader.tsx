interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function PageHeader({
  title,
  description,
  action,
  className = ""
}: PageHeaderProps) {
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

export type { PageHeaderProps };

export default PageHeader;