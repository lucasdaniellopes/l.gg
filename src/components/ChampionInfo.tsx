"use client";

import { Image, Tooltip } from "@heroui/react";
import {
  getSummonerSpellImageUrl,
  getChampionSquareUrl,
  getRuneImageUrl,
  getRuneStyleName,
  getPrimaryRune,
  getSecondaryRuneStyle,
  getSecondaryRune,
  type SummonerSpellsData,
  type RunesData
} from "@/lib/riotServerApi";

interface PlayerData {
  championName: string;
  champLevel: number;
  summoner1Id: number;
  summoner2Id: number;
  perks?: {
    styles?: Array<{
      style: number;
      selections: Array<{ perk: number }>;
    }>;
  };
}

interface ChampionInfoProps {
  playerData: PlayerData;
  spellsData: SummonerSpellsData;
  runesData: RunesData;
}

export default function ChampionInfo({ playerData, spellsData, runesData }: ChampionInfoProps) {
  const getSummonerSpellName = (spellId: number): string => {
    for (const spellKey in spellsData) {
      const spell = spellsData[spellKey];
      if (spell.key === spellId.toString()) {
        return spell.name;
      }
    }
    return 'Desconhecido';
  };

  const getRuneInfoLocal = (runeId: number): { name: string; description: string } => {
    for (const tree of runesData) {
      for (const slot of tree.slots) {
        for (const rune of slot.runes) {
          if (rune.id === runeId) {
            const cleanDescription = rune.longDesc?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') || 
                                   rune.shortDesc?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') || 
                                   'No description available';
            
            return {
              name: rune.name,
              description: cleanDescription
            };
          }
        }
      }
    }
    
    return { name: 'Unknown Rune', description: 'No information available' };
  };

  return (
    <div className="flex items-center gap-2">
      {/* Champion Icon with Level */}
      <Tooltip content={`${playerData.championName} - Nível ${playerData.champLevel || 1}`}>
        <div className="relative cursor-help w-12 h-12 overflow-hidden rounded">
          <Image
            src={getChampionSquareUrl(playerData.championName)}
            alt={playerData.championName}
            className="w-12 h-12 object-cover"
            width={48}
            height={48}
          />
          <div className="absolute bottom-0.5 left-0.5 bg-black/70 text-white text-xs font-medium leading-none px-1 py-0.5 rounded text-center min-w-[16px] z-10">
            {playerData.champLevel || 1}
          </div>
        </div>
      </Tooltip>

      {/* Summoner Spells */}
      <div className="flex flex-col gap-0.5">
        <Tooltip content={getSummonerSpellName(playerData.summoner1Id)}>
          <Image
            src={getSummonerSpellImageUrl(playerData.summoner1Id)}
            alt="Spell 1"
            className="w-5 h-5 rounded cursor-help"
            width={20}
            height={20}
          />
        </Tooltip>
        <Tooltip content={getSummonerSpellName(playerData.summoner2Id)}>
          <Image
            src={getSummonerSpellImageUrl(playerData.summoner2Id)}
            alt="Spell 2"
            className="w-5 h-5 rounded cursor-help"
            width={20}
            height={20}
          />
        </Tooltip>
      </div>

      {/* Runes */}
      <div className="flex flex-col gap-0.5">
        {(() => {
          const primaryRuneId = getPrimaryRune(playerData);
          const secondaryStyleId = getSecondaryRuneStyle(playerData);
          
          return (
            <>
              <Tooltip 
                content={
                  <div className="max-w-xs p-2">
                    {(() => {
                      const runeInfo = getRuneInfoLocal(primaryRuneId);
                      return (
                        <>
                          <div className="font-semibold text-primary mb-1">{runeInfo.name}</div>
                          <div className="text-xs text-default-600 mb-2">Runa Principal</div>
                          <div className="text-xs text-foreground leading-relaxed">
                            {runeInfo.description}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                }
              >
                <div className="w-5 h-5 bg-black/20 rounded cursor-help flex items-center justify-center">
                  {primaryRuneId ? (
                    <Image
                      src={getRuneImageUrl(primaryRuneId)}
                      alt="Primary Rune"
                      className="w-4 h-4 object-contain"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <div className="w-4 h-4 bg-default-300 rounded"></div>
                  )}
                </div>
              </Tooltip>
              <Tooltip 
                content={
                  <div className="max-w-xs p-2">
                    {(() => {
                      const secondaryRuneId = getSecondaryRune(playerData);
                      const runeInfo = getRuneInfoLocal(secondaryRuneId);
                      return (
                        <>
                          <div className="font-semibold text-primary mb-1">{runeInfo.name}</div>
                          <div className="text-xs text-default-600 mb-2">Runa Secundária - {getRuneStyleName(secondaryStyleId)}</div>
                          <div className="text-xs text-foreground leading-relaxed">
                            {runeInfo.description}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                }
              >
                <div className="w-5 h-5 bg-black/20 rounded cursor-help flex items-center justify-center">
                  {(() => {
                    const secondaryRuneId = getSecondaryRune(playerData);
                    return secondaryRuneId ? (
                      <Image
                        src={getRuneImageUrl(secondaryRuneId)}
                        alt="Secondary Rune"
                        className="w-4 h-4 object-contain"
                        width={16}
                        height={16}
                      />
                    ) : (
                      <div className="w-4 h-4 bg-default-300 rounded"></div>
                    );
                  })()}
                </div>
              </Tooltip>
            </>
          );
        })()}
      </div>
    </div>
  );
}