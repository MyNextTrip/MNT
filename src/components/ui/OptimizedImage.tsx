"use client";

import { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  fill,
  sizes,
  priority,
  quality,
  placeholder,
  blurDataURL,
  onLoadingComplete,
  unoptimized,
  fallbackSrc = "/images/placeholder.jpg",
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimize Cloudinary URLs
  let optimizedSrc = src;
  if (src && typeof src === 'string' && src.includes("res.cloudinary.com")) {
    if (!src.includes("q_auto")) {
      optimizedSrc = src.replace("/upload/", "/upload/q_auto,f_auto/");
    }
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        fill ? "absolute inset-0 w-full h-full" : "",
        !fill && !width && !height ? "w-full h-full" : ""
      )} 
      style={!fill ? { width, height } : undefined}
    >
      <img
        src={error ? fallbackSrc : optimizedSrc}
        alt={alt || "MyNextTrip Image"}
        loading={priority ? undefined : "lazy"}
        className={cn(
          "w-full h-full transition-opacity duration-700",
          error ? "object-contain" : "object-cover",
          fill ? "absolute inset-0" : "",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        suppressHydrationWarning
        {...(props as any)}
      />
      {/* Background placeholder while loading */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
    </div>
  );
}
