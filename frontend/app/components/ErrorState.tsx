// ninja focus touch <
interface ErrorStateProps {
  message: string;
  className?: string;
}

export function ErrorState({ message, className = "" }: ErrorStateProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-xl">Error: {message}</div>
    </div>
  );
}
// ninja focus touch >