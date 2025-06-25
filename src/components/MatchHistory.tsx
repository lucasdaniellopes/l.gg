"use client";

import { Card, CardBody } from "@heroui/react";
import { Target } from "lucide-react";
import { 
  Match, 
  Summoner, 
  type SummonerSpellsData,
  type ItemsData,
  type RunesData
} from "@/lib/riotServerApi";
import MatchCard from "./MatchCard";

interface MatchHistoryProps {
  matches: Match[];
  summoner: Summoner;
  spellsData: SummonerSpellsData;
  itemsData: ItemsData;
  runesData: RunesData;
}

export default function MatchHistory({ matches, summoner, spellsData, itemsData, runesData }: MatchHistoryProps) {
  return (
    <Card>
      <CardBody className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Match History
        </h3>
        
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchCard 
                key={match.metadata.matchId}
                match={match}
                summoner={summoner}
                spellsData={spellsData}
                itemsData={itemsData}
                runesData={runesData}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-default-500">Nenhuma partida encontrada</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}