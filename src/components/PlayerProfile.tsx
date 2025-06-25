"use client";

import { Card, CardBody, Chip, Progress, Image } from "@heroui/react";
import { Trophy } from "lucide-react";
import { Summoner, RankedInfo } from "@/lib/riotServerApi";
import { getProfileIconUrl, getRankedEmblemUrl } from "@/lib/riotServerApi";

interface PlayerProfileProps {
  summoner: Summoner;
  rankedData: RankedInfo[];
}

export default function PlayerProfile({ summoner, rankedData }: PlayerProfileProps) {
  const getSoloQueueData = () => {
    return rankedData.find(r => r.queueType === "RANKED_SOLO_5x5");
  };

  return (
    <Card>
      <CardBody className="p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src={getProfileIconUrl(summoner.profileIconId)}
              alt="Profile Icon"
              className="w-20 h-20 rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold mb-1">{summoner.name}</h2>
          <Chip color="primary" variant="flat" className="mb-4">
            Level {summoner.summonerLevel}
          </Chip>
          
          {getSoloQueueData() && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 justify-center">
                <Trophy className="w-4 h-4" />
                Solo/Duo Queue
              </h3>
              {(() => {
                const soloQ = getSoloQueueData()!;
                const winRate = Math.round((soloQ.wins / (soloQ.wins + soloQ.losses)) * 100);
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 justify-center">
                      <div className="flex-shrink-0">
                        <Image
                          src={getRankedEmblemUrl(soloQ.tier)}
                          alt={`${soloQ.tier} ${soloQ.rank}`}
                          className="w-16 h-16 object-contain"
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">
                          {soloQ.tier} {soloQ.rank}
                        </div>
                        <div className="text-sm text-default-500">
                          {soloQ.leaguePoints} LP
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Wins: {soloQ.wins}</span>
                        <span>Losses: {soloQ.losses}</span>
                      </div>
                      <Progress value={winRate} color="primary" />
                      <div className="text-center text-sm">
                        {winRate}% win rate
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}