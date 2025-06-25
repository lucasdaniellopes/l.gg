"use client";

import { Image, Tooltip } from "@heroui/react";
import RuneImage from "./RuneImage";
import {
  getSummonerSpellImageUrl,
  getChampionSquareUrl,
  getRuneStyleImageUrl,
  getRuneStyleName,
  getPrimaryRune,
  getSecondaryRuneStyle,
  type SummonerSpellsData,
  type RunesData,
  type MatchParticipant
} from "@/lib/riotServerApi";

interface ChampionInfoProps {
  playerData: MatchParticipant;
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

  const getRuneInfoLocal = (runeId: number): { 
    name: string; 
    description: string; 
    treeName: string; 
    slotType: string;
    shortDesc: string;
  } => {
    for (const tree of runesData) {
      for (let slotIndex = 0; slotIndex < tree.slots.length; slotIndex++) {
        const slot = tree.slots[slotIndex];
        for (const rune of slot.runes) {
          if (rune.id === runeId) {
            const cleanDescription = rune.longDesc?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') || 
                                   rune.shortDesc?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') || 
                                   'Description not available';
            
            const cleanShortDesc = rune.shortDesc?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') || '';
            
            let slotType = '';
            if (slotIndex === 0) {
              slotType = 'Runa Principal';
            } else if (slotIndex === 1 || slotIndex === 2) {
              slotType = 'Runa Maior';
            } else {
              slotType = 'Runa Menor';
            }
            
            return {
              name: rune.name,
              description: cleanDescription,
              treeName: tree.name,
              slotType: slotType,
              shortDesc: cleanShortDesc
            };
          }
        }
      }
    }
    
    return { 
      name: 'Unknown Rune', 
      description: 'Information not available',
      treeName: 'Unknown Tree',
      slotType: 'Unknown Type',
      shortDesc: ''
    };
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Tooltip content={`${playerData.championName} - Level ${playerData.champLevel || 1}`}>
        <div className="relative cursor-help flex-shrink-0 overflow-hidden rounded">
          <Image
            src={getChampionSquareUrl(playerData.championName)}
            alt={playerData.championName}
            className="w-12 h-12 object-cover"
            width={48}
            height={48}
            style={{ aspectRatio: '1/1' }}
          />
          <div className="absolute bottom-0.5 left-0.5 bg-black/70 text-white text-xs font-medium leading-none px-1 py-0.5 rounded text-center min-w-[16px] z-10">
            {playerData.champLevel || 1}
          </div>
        </div>
      </Tooltip>

      <div className="flex flex-col gap-0.5 flex-shrink-0">
        <Tooltip content={getSummonerSpellName(playerData.summoner1Id)}>
          <div className="w-5 h-5 flex-shrink-0">
            <Image
              src={getSummonerSpellImageUrl(playerData.summoner1Id)}
              alt="Spell 1"
              className="w-5 h-5 rounded cursor-help object-cover"
              width={20}
              height={20}
              style={{ aspectRatio: '1/1' }}
            />
          </div>
        </Tooltip>
        <Tooltip content={getSummonerSpellName(playerData.summoner2Id)}>
          <div className="w-5 h-5 flex-shrink-0">
            <Image
              src={getSummonerSpellImageUrl(playerData.summoner2Id)}
              alt="Spell 2"
              className="w-5 h-5 rounded cursor-help object-cover"
              width={20}
              height={20}
              style={{ aspectRatio: '1/1' }}
            />
          </div>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-0.5">
        {(() => {
          const primaryRuneId = getPrimaryRune(playerData);
          const secondaryStyleId = getSecondaryRuneStyle(playerData);
          
          return (
            <>
              <Tooltip 
                content={
                  <div className="max-w-xs p-3">
                    {(() => {
                      const runeInfo = getRuneInfoLocal(primaryRuneId);
                      return (
                        <>
                          <div className="font-semibold text-primary mb-2">{runeInfo.name}</div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-xs text-default-600 bg-default-100 px-2 py-1 rounded">
                              {runeInfo.slotType}
                            </div>
                            <div className="text-xs text-default-600 bg-default-100 px-2 py-1 rounded">
                              {runeInfo.treeName}
                            </div>
                          </div>

                          {runeInfo.shortDesc && (
                            <div className="text-xs text-foreground font-medium mb-2 p-2 bg-default-50 rounded">
                              {runeInfo.shortDesc}
                            </div>
                          )}
                          
                          <div className="text-xs text-default-700 leading-relaxed">
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
                    <RuneImage
                      runeId={primaryRuneId}
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
                    <div className="font-semibold text-primary mb-1">
                      Secondary Tree
                    </div>
                    <div className="text-xs text-default-600">
                      {getRuneStyleName(secondaryStyleId)}
                    </div>
                  </div>
                }
              >
                <div className="w-5 h-5 bg-black/20 rounded cursor-help flex items-center justify-center">
                  {secondaryStyleId ? (
                    <Image
                      src={getRuneStyleImageUrl(secondaryStyleId)}
                      alt="Secondary Rune Tree"
                      className="w-4 h-4 object-contain"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <div className="w-4 h-4 bg-default-300 rounded"></div>
                  )}
                </div>
              </Tooltip>
            </>
          );
        })()}
      </div>
    </div>
  );
}