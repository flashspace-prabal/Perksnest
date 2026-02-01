import { useEffect, useMemo, useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

const SafeImage = ({ src, alt, className = "", fallbackClassName = "" }: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);

  const fallbackChar = useMemo(() => {
    const normalized = (alt ?? "").trim();
    return normalized ? normalized.charAt(0).toUpperCase() : "?";
  }, [alt]);

  // If the image source changes, allow re-trying the load.
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const shouldShowFallback = hasError || !src;

  if (shouldShowFallback) {
    return (
      <div className={`flex items-center justify-center bg-secondary text-muted-foreground font-bold ${fallbackClassName || className}`}>
        {fallbackChar}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};

export default SafeImage;
