import { useId } from "react";

interface InputProps extends React.ComponentPropsWithRef<"input"> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  disabled,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasError = !!error;

  const baseStyles = "w-full px-4 py-2 border rounded-lg text-gray-600";
  const stateStyles = disabled
    ? "bg-gray-50 border-gray-300"
    : hasError
      ? "bg-white border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
      : "bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${stateStyles} ${className}`}
        disabled={disabled}
        {...rest} />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export { type InputProps };

export default Input;