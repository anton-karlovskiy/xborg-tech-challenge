// ninja focus touch <
import { InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isDisabled = props.disabled;
  const hasError = !!error;

  const baseStyles = "w-full px-4 py-2 border rounded-lg text-gray-600";
  const stateStyles = isDisabled
    ? "bg-gray-50 border-gray-300"
    : hasError
    ? "bg-white border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
    : "bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${stateStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
// ninja focus touch >
