interface ErrorStateProps {
  message: string;
  className?: string;
}

/**
 * Error state component for displaying error messages.
 * @param root0 - The props object
 * @param root0.message - The error message to display
 * @param root0.className - Additional CSS classes to apply
 * @returns The error state component JSX
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
