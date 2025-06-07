"use client";

import { Image, Spinner } from "@heroui/react";
import { Champion } from "@/lib/types";
import Link from "next/link";
import { useState, useEffect, memo, useCallback } from "react";
import { getChampionImageUrl } from "@/lib/championsApi";

interface ChampionCardProps {
  champion: Champion;
}

const imageCache = new Map<string, string>();

const ChampionCard = memo(function ChampionCard({ champion }: ChampionCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(() => {
    return imageCache.get(champion.image.full) || null;
  });

  const loadImage = useCallback(async () => {
    if (!imageUrl && !imageCache.has(champion.image.full)) {
      const url = await getChampionImageUrl(champion.image.full);
      imageCache.set(champion.image.full, url);
      setImageUrl(url);
    }
  }, [champion.image.full, imageUrl]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return (
    <Link href={`/champions/${champion.key}`} className="group" prefetch={true}>
      <div className="relative bg-default-100/50 rounded-lg overflow-hidden border border-default-200/50 hover:border-primary/50 transition-all duration-200 hover:scale-105 hover:shadow-lg">
        <div className="aspect-square relative overflow-hidden">
          {imageUrl ? (
            <Image
              width="100%"
              height="100%"
              alt={champion.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              src={imageUrl}
              loading="eager"
              removeWrapper
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-default-100">
              <Spinner size="sm" color="primary" />
            </div>
          )}
          
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
            <h3 className="text-white text-xs font-semibold truncate leading-tight">
              {champion.name}
            </h3>
            <p className="text-white/70 text-[10px] truncate leading-tight">
              {champion.title}
            </p>
          </div>

          <div className="absolute top-1 right-1">
            <div className="bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5">
              <span className="text-white text-[9px] font-medium">
                {champion.tags[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ChampionCard;