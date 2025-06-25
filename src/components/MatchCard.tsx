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
  
  const gameDurationMinutes = match.info.gameDuration / 60;
  const totalCS = (playerData.totalMinionsKilled || 0) + (playerData.neutralMinionsKilled || 0);
  const csPerMin = (totalCS / gameDurationMinutes).toFixed(1);
  const damageFormatted = (playerData.totalDamageDealtToChampions / 1000).toFixed(1) + 'k';
  const goldFormatted = (playerData.goldEarned / 1000).toFixed(1) + 'k';
  
  const roleMap: Record<string, string> = {
    'TOP': 'Top',
    'JUNGLE': 'Jungle',
    'MIDDLE': 'Mid',
    'BOTTOM': 'ADC',
    'UTILITY': 'Support'
  };
  const displayRole = roleMap[playerData.role] || playerData.lane || 'N/A';

  return (
    <Card className={`border-l-4 ${playerData.win ? 'border-l-green-500' : 'border-l-red-500'} overflow-hidden`}>
      <CardBody className="p-2 overflow-hidden">
        <div className="flex items-center gap-1 md:gap-2 min-w-0">
          
          <div className="w-16 md:w-20 flex-shrink-0 text-center">
            <div className="text-xs font-medium text-default-600">
              {match.info.gameMode === 'CLASSIC' ? 'Ranked Solo' : match.info.gameMode}
            </div>
            <div className={`text-xs font-semibold ${playerData.win ? 'text-green-600' : 'text-red-600'}`}>
              {playerData.win ? 'VICTORY' : 'DEFEAT'}
            </div>
            <div className="text-xs text-default-500">
              {formatGameDuration(match.info.gameDuration)}
            </div>
            <div className="text-xs text-primary-600 font-medium">
              {displayRole}
            </div>
          </div>
          
          <ChampionInfo 
            playerData={playerData}
            spellsData={spellsData}
            runesData={runesData}
          />
          
          <div className="flex-shrink-0 w-12 md:w-14 text-center">
            <div className="text-sm font-semibold">
              {playerData.kills} / <span className="text-red-500">{playerData.deaths}</span> / {playerData.assists}
            </div>
            <div className="text-xs text-default-500">
              {kda} KDA
            </div>
          </div>
          
          <div className="hidden md:block flex-shrink-0 w-14 text-center">
            <div className="text-sm font-medium">
              {totalCS}
            </div>
            <div className="text-xs text-default-500">{csPerMin} CS/min</div>
          </div>
          
          <div className="hidden lg:block flex-shrink-0 w-14 text-center">
            <div className="text-sm font-medium text-orange-600">
              {damageFormatted}
            </div>
            <div className="text-xs text-default-500">Damage</div>
          </div>
          
          <div className="hidden lg:block flex-shrink-0 w-14 text-center">
            <div className="text-sm font-medium text-yellow-600">
              {goldFormatted}
            </div>
            <div className="text-xs text-default-500">Gold</div>
          </div>
          
          <div className="flex-shrink-0">
            <ItemsDisplay 
              items={items}
              itemsData={itemsData}
            />
          </div>
          
          <div className="hidden lg:block flex-shrink-0 min-w-[200px]">
            <TeamsList 
              participants={match.info.participants}
              currentPlayerPuuid={summoner.puuid}
            />
          </div>
          
        </div>
      </CardBody>
    </Card>
  );
}