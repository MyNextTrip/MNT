"use client";

import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  fallbackSrc = "/images/placeholder.jpg",
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  // Optimize Cloudinary URLs
  let optimizedSrc = src;
  if (src.includes("res.cloudinary.com")) {
    // Ensure q_auto,f_auto is present
    if (!src.includes("q_auto")) {
      optimizedSrc = src.replace("/upload/", "/upload/q_auto,f_auto/");
    }
  }

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width, height }}>
      <Image
        src={error ? fallbackSrc : optimizedSrc}
        alt={alt || "MyNextTrip Image"}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn(
          "duration-700 ease-in-out",
          error ? "object-contain" : "object-cover"
        )}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
