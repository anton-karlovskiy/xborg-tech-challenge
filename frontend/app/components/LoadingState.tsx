interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 *
 * @param root0
 * @param root0.message
 * @param root0.className
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
