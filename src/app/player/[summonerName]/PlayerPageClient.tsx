"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import PlayerProfile from "@/components/PlayerProfile";
import MatchHistory from "@/components/MatchHistory";
import PlayerStats from "@/components/PlayerStats";
import { 
  type Summoner, 
  type RankedInfo,
  type Match,
  type SummonerSpellsData,
  type ItemsData,
  type RunesData
} from "@/lib/riotServerApi";

interface PlayerPageClientProps {
  summoner: Summoner;
  rankedData: RankedInfo[];
  initialMatches: Match[];
  spellsData: SummonerSpellsData;
  itemsData: ItemsData;
  runesData: RunesData;
}

export default function PlayerPageClient({ 
  summoner, 
  rankedData, 
  initialMatches, 
  spellsData, 
  itemsData, 
  runesData 
}: PlayerPageClientProps) {
  const [allMatches, setAllMatches] = useState<Match[]>(initialMatches);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextOffset = allMatches.length;
    
    try {
      const response = await fetch(
        `/api/matches?puuid=${summoner.puuid}&count=10&start=${nextOffset}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to load matches');
      }
      
      const newMatches: Match[] = await response.json();
      
      if (newMatches && newMatches.length > 0) {
        setAllMatches(prev => [...prev, ...newMatches]);
      }
    } catch {
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/player" 
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>
      </div>

      <PlayerStats matches={allMatches} playerPuuid={summoner.puuid} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlayerProfile summoner={summoner} rankedData={rankedData} />
        </div>

        <div className="lg:col-span-2">
          <MatchHistory 
            matches={allMatches}
            summoner={summoner}
            spellsData={spellsData}
            itemsData={itemsData}
            runesData={runesData}
          />
          
          <div className="mt-4 text-center">
            <Button
              onPress={handleLoadMore}
              isLoading={isLoadingMore}
              color="primary"
              variant="flat"
              startContent={!isLoadingMore && <Loader2 className="w-4 h-4" />}
            >
              {isLoadingMore ? "Loading..." : "Load more matches"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}