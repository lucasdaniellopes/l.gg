"use client";

import { Image } from "@heroui/react";
import { useState } from "react";
import { getRuneImageUrlWithFallback } from "@/lib/riotServerApi";

interface RuneImageProps {
  runeId: number;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function RuneImage({ runeId, alt, className, width = 16, height = 16 }: RuneImageProps) {
  const [hasErrored, setHasErrored] = useState(false);
  const urls = getRuneImageUrlWithFallback(runeId);

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true);
    }
  };

  const currentSrc = hasErrored ? urls.fallback : urls.primary;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      fallbackSrc={urls.fallback}
    />
  );
}