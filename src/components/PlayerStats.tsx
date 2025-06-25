"use client";

import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { Target, Coins, Swords } from "lucide-react";
import { type Match } from "@/lib/riotServerApi";

interface PlayerStatsProps {
  matches: Match[];
  playerPuuid: string;
}

export default function PlayerStats({ matches, playerPuuid }: PlayerStatsProps) {
  const stats = matches.reduce((acc, match) => {
    const player = match.info.participants.find(p => p.puuid === playerPuuid);
    if (!player) return acc;

    const gameDurationMinutes = match.info.gameDuration / 60;
    const cs = (player.totalMinionsKilled || 0) + (player.neutralMinionsKilled || 0);
    const csPerMin = cs / gameDurationMinutes;

    acc.totalGames++;
    if (player.win) acc.wins++;
    acc.totalKills += player.kills;
    acc.totalDeaths += player.deaths;
    acc.totalAssists += player.assists;
    acc.totalCS += cs;
    acc.totalCSPerMin += csPerMin;
    acc.totalDamage += player.totalDamageDealtToChampions;
    acc.totalGold += player.goldEarned;
    acc.totalGameDuration += gameDurationMinutes;

    if (!acc.championStats[player.championName]) {
      acc.championStats[player.championName] = {
        games: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
      };
    }
    const champStats = acc.championStats[player.championName];
    champStats.games++;
    if (player.win) champStats.wins++;
    champStats.kills += player.kills;
    champStats.deaths += player.deaths;
    champStats.assists += player.assists;

    return acc;
  }, {
    totalGames: 0,
    wins: 0,
    totalKills: 0,
    totalDeaths: 0,
    totalAssists: 0,
    totalCS: 0,
    totalCSPerMin: 0,
    totalDamage: 0,
    totalGold: 0,
    totalGameDuration: 0,
    championStats: {} as Record<string, {
      games: number;
      wins: number;
      kills: number;
      deaths: number;
      assists: number;
    }>
  });

  const winRate = stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0;
  const avgKills = stats.totalGames > 0 ? stats.totalKills / stats.totalGames : 0;
  const avgDeaths = stats.totalGames > 0 ? stats.totalDeaths / stats.totalGames : 0;
  const avgAssists = stats.totalGames > 0 ? stats.totalAssists / stats.totalGames : 0;
  const avgKDA = stats.totalDeaths > 0 
    ? (stats.totalKills + stats.totalAssists) / stats.totalDeaths 
    : stats.totalKills + stats.totalAssists;
  const avgCSPerMin = stats.totalGames > 0 ? stats.totalCSPerMin / stats.totalGames : 0;
  const avgDamage = stats.totalGames > 0 ? stats.totalDamage / stats.totalGames : 0;
  const avgGold = stats.totalGames > 0 ? stats.totalGold / stats.totalGames : 0;

  const topChampions = Object.entries(stats.championStats)
    .sort((a, b) => b[1].games - a[1].games)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Win Rate Card */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-default-500">Win Rate</span>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary mb-2">
            {winRate.toFixed(1)}%
          </div>
          <Progress 
            value={winRate} 
            color={winRate >= 50 ? "success" : "danger"}
            className="mb-2"
          />
          <div className="text-xs text-default-500">
            {stats.wins}V {stats.totalGames - stats.wins}D
          </div>
        </CardBody>
      </Card>

      {/* KDA Card */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-default-500">Average KDA</span>
            <Swords className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mb-2">
            {avgKDA.toFixed(2)}
          </div>
          <div className="text-sm">
            {avgKills.toFixed(1)} / <span className="text-red-500">{avgDeaths.toFixed(1)}</span> / {avgAssists.toFixed(1)}
          </div>
          <div className="text-xs text-default-500 mt-1">
            Per match
          </div>
        </CardBody>
      </Card>

      {/* CS/min Card */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-default-500">CS/min</span>
            <Coins className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold mb-2">
            {avgCSPerMin.toFixed(1)}
          </div>
          <div className="text-sm text-default-500">
            {(avgGold / 1000).toFixed(1)}k gold/match
          </div>
          <div className="text-xs text-default-500 mt-1">
            {(avgDamage / 1000).toFixed(1)}k damage/match
          </div>
        </CardBody>
      </Card>

      {/* Top Champions Card */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <span className="text-sm text-default-500">Top Champions</span>
        </CardHeader>
        <CardBody className="pt-2 px-4 pb-4">
          {topChampions.map(([champName, champStats]) => {
            const champWinRate = (champStats.wins / champStats.games) * 100;
            const champKDA = champStats.deaths > 0 
              ? (champStats.kills + champStats.assists) / champStats.deaths 
              : champStats.kills + champStats.assists;
            
            return (
              <div key={champName} className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{champName}</span>
                  <span className="text-xs text-default-500">{champStats.games} games</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className={champWinRate >= 50 ? "text-green-500" : "text-red-500"}>
                    {champWinRate.toFixed(0)}% WR
                  </span>
                  <span className="text-default-400">
                    {champKDA.toFixed(2)} KDA
                  </span>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}