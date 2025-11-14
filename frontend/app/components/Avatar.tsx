import Image, { type ImageProps } from "next/image";

interface AvatarProps extends ImageProps {
  size?: number;
}

/**
 * Avatar component for displaying user profile pictures.
 * @param root0 - The props object
 * @param root0.alt - Alt text for the image
 * @param root0.size - Optional size for width and height
 * @param root0.className - Additional CSS classes to apply
 * @returns The avatar component JSX
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
