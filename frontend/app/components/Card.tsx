type CardProps = React.ComponentPropsWithRef<"div">;

/**
 * Card component for displaying content in a styled container.
 * @param root0 - The props object
 * @param root0.className - Additional CSS classes to apply
 * @returns The card component JSX
 */
function Card({ className = "", ...rest }: CardProps) {
  return <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`} {...rest} />;
}

export type { CardProps };

export default Card;
