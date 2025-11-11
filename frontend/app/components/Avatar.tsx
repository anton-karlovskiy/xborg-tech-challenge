// ninja focus touch <
import Image from "next/image";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt = "Profile", size = 128, className = "" }: AvatarProps) {
  return (
    <div className="flex justify-center">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority
        className={`rounded-full border-4 border-indigo-500 ${className}`}
      />
    </div>
  );
}
// ninja focus touch >