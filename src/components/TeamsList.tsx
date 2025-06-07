"use client";

import { Image } from "@heroui/react";
import { getChampionSquareUrl } from "@/lib/riotServerApi";

interface Participant {
  puuid: string;
  championName: string;
  riotIdGameName?: string;
  summonerName?: string;
}

interface TeamsListProps {
  participants: Participant[];
  currentPlayerPuuid: string;
}

export default function TeamsList({ participants, currentPlayerPuuid }: TeamsListProps) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 gap-x-4 text-xs">
        {/* Team 1 (0-4) */}
        <div className="space-y-0.5">
          {participants.slice(0, 5).map((participant, pIndex) => (
            <div 
              key={pIndex} 
              className={`flex items-center gap-1 ${
                participant.puuid === currentPlayerPuuid ? 'font-semibold text-primary' : ''
              }`}
            >
              <Image
                src={getChampionSquareUrl(participant.championName)}
                alt={participant.championName}
                className="w-4 h-4 rounded flex-shrink-0"
                width={16}
                height={16}
              />
              <span className="truncate text-xs max-w-[80px]">
                {participant.riotIdGameName || participant.summonerName || 'Jogador'}
              </span>
            </div>
          ))}
        </div>
        
        {/* Team 2 (5-9) */}
        <div className="space-y-0.5">
          {participants.slice(5, 10).map((participant, pIndex) => (
            <div 
              key={pIndex} 
              className={`flex items-center gap-1 ${
                participant.puuid === currentPlayerPuuid ? 'font-semibold text-primary' : ''
              }`}
            >
              <Image
                src={getChampionSquareUrl(participant.championName)}
                alt={participant.championName}
                className="w-4 h-4 rounded flex-shrink-0"
                width={16}
                height={16}
              />
              <span className="truncate text-xs max-w-[80px]">
                {participant.riotIdGameName || participant.summonerName || 'Jogador'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}