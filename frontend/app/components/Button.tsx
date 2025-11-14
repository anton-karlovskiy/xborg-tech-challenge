interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

/**
 * Button component with multiple variants and styling options.
 * @param root0 - The props object
 * @param root0.variant - The button variant (primary, secondary, danger)
 * @param root0.children - The button content
 * @param root0.fullWidth - Whether the button should take full width
 * @param root0.className - Additional CSS classes to apply
 * @returns The button component JSX
 */
function Button({
  variant = "primary",
  children,
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  const baseStyles = "cursor-pointer px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-600",
    secondary: "bg-gray-300 text-gray-700 hover:bg-gray-400",
    danger: "bg-red-400 text-white hover:bg-red-500",
  };

  const widthStyles = fullWidth ? "flex-1 w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export { type ButtonProps };

export default Button;
