interface ErrorStateProps {
  message: string;
  className?: string;
}

/**
 *
 * @param root0
 * @param root0.message
 * @param root0.className
 */
function ErrorState({
  message,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-xl">Error: {message}</div>
    </div>
  );
}

export { type ErrorStateProps };

export default ErrorState;
