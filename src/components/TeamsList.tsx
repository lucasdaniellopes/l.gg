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
      <div className="grid grid-cols-2 gap-x-2 text-xs">
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
                className="w-4 h-4 rounded flex-shrink-0 object-cover"
                width={16}
                height={16}
                style={{ aspectRatio: '1/1' }}
              />
              <span className="truncate text-[11px] max-w-[85px]">
                {participant.riotIdGameName || participant.summonerName || 'Jogador'}
              </span>
            </div>
          ))}
        </div>
        
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
                className="w-4 h-4 rounded flex-shrink-0 object-cover"
                width={16}
                height={16}
                style={{ aspectRatio: '1/1' }}
              />
              <span className="truncate text-[11px] max-w-[85px]">
                {participant.riotIdGameName || participant.summonerName || 'Jogador'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}