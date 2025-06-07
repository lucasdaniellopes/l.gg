"use client";

import { Card, CardBody } from "@heroui/react";
import { 
  Match, 
  Summoner,
  calculateKDA, 
  formatGameDuration,
  type SummonerSpellsData,
  type ItemsData,
  type RunesData
} from "@/lib/riotServerApi";
import ChampionInfo from "./ChampionInfo";
import ItemsDisplay from "./ItemsDisplay";
import TeamsList from "./TeamsList";

interface MatchCardProps {
  match: Match;
  summoner: Summoner;
  spellsData: SummonerSpellsData;
  itemsData: ItemsData;
  runesData: RunesData;
}

export default function MatchCard({ match, summoner, spellsData, itemsData, runesData }: MatchCardProps) {
  const playerData = match.info.participants.find(p => p.puuid === summoner.puuid);
  
  if (!playerData) return null;
  
  const kda = calculateKDA(playerData.kills, playerData.deaths, playerData.assists);
  const items = [
    playerData.item0, 
    playerData.item1, 
    playerData.item2, 
    playerData.item3, 
    playerData.item4, 
    playerData.item5, 
    playerData.item6
  ];

  return (
    <Card className={`border-l-4 ${playerData.win ? 'border-l-green-500' : 'border-l-red-500'}`}>
      <CardBody className="p-3">
        <div className="flex items-center gap-3">
          
          {/* Game Info */}
          <div className="w-24 text-center">
            <div className="text-xs font-medium text-default-600">
              {match.info.gameMode === 'CLASSIC' ? 'Ranked Solo' : match.info.gameMode}
            </div>
            <div className={`text-xs font-semibold ${playerData.win ? 'text-green-600' : 'text-red-600'}`}>
              {playerData.win ? 'VITÓRIA' : 'DERROTA'}
            </div>
            <div className="text-xs text-default-500">
              {formatGameDuration(match.info.gameDuration)}
            </div>
          </div>
          
          {/* Champion, Spells, Runes */}
          <ChampionInfo 
            playerData={playerData}
            spellsData={spellsData}
            runesData={runesData}
          />
          
          {/* KDA */}
          <div className="w-16 text-center">
            <div className="text-sm font-semibold">
              {playerData.kills} / <span className="text-red-500">{playerData.deaths}</span> / {playerData.assists}
            </div>
            <div className="text-xs text-default-500">
              {kda} KDA
            </div>
          </div>
          
          {/* CS */}
          <div className="w-12 text-center">
            <div className="text-sm font-medium">
              {(playerData.totalMinionsKilled || 0) + (playerData.neutralMinionsKilled || 0)}
            </div>
            <div className="text-xs text-default-500">CS</div>
          </div>
          
          {/* Items */}
          <ItemsDisplay 
            items={items}
            itemsData={itemsData}
          />
          
          {/* Team Lists */}
          <TeamsList 
            participants={match.info.participants}
            currentPlayerPuuid={summoner.puuid}
          />
          
        </div>
      </CardBody>
    </Card>
  );
}