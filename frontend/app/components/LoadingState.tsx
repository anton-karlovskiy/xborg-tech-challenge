interface LoadingStateProps {
  message?: string;
  className?: string;
}

function LoadingState({
  message = "Loading...",
  className = ""
}: LoadingStateProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-xl">{message}</div>
    </div>
  );
}

export { type LoadingStateProps };

export default LoadingState;