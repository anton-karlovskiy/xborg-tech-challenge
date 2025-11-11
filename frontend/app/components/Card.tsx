type CardProps = React.ComponentPropsWithRef<"div">;

function Card({
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-8 ${className}`}
      {...rest} />
  );
}

export type { CardProps };

export default Card;