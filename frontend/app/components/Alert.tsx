interface AlertProps extends React.ComponentPropsWithRef<"div"> {
  variant?: "error" | "success" | "info" | "warning";
}

/**
 *
 * @param root0
 * @param root0.variant
 * @param root0.className
 */
function Alert({
  variant = "error",
  className = "",
  ...rest
}: AlertProps) {
  const variantStyles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  };

  return (
    <div
      className={`p-3 border rounded-lg text-sm ${variantStyles[variant]} ${className}`}
      {...rest}
    />
  );
}

export { type AlertProps };

export default Alert;
