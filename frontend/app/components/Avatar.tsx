import Image, { type ImageProps } from "next/image";

interface AvatarProps extends ImageProps {
  size?: number;
}

/**
 *
 * @param root0
 * @param root0.alt
 * @param root0.size
 * @param root0.className
 */
function Avatar({
  alt = "Profile",
  size,
  className = "",
  ...rest
}: AvatarProps) {
  return (
    <Image
      alt={alt}
      width={size}
      height={size}
      priority
      className={`rounded-full border-4 border-indigo-500 ${className}`}
      {...rest}
    />
  );
}

export { type AvatarProps };

export default Avatar;
