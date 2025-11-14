type CardProps = React.ComponentPropsWithRef<"div">;

/**
 *
 * @param root0
 * @param root0.className
 */
function Card({
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-8 ${className}`}
      {...rest}
    />
  );
}

export type { CardProps };

export default Card;
