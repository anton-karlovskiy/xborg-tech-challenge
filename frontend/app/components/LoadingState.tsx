interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Loading state component for displaying loading messages.
 * @param root0 - The props object
 * @param root0.message - The loading message to display
 * @param root0.className - Additional CSS classes to apply
 * @returns The loading state component JSX
 */
function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-xl">{message}</div>
    </div>
  );
}

export { type LoadingStateProps };

export default LoadingState;
