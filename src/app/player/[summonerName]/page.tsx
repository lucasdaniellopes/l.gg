import { 
  Card, 
  CardBody, 
  Chip,
  Progress,
  Image,
  Tooltip
} from "@heroui/react";
import { Trophy, Target, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  getSummonerByName,
  getAccountByRiotId,
  getSummonerByPuuid,
  getRankedInfo, 
  getMatchHistory, 
  getMatchDetails,
  getProfileIconUrl,
  getRankedEmblemUrl,
  calculateKDA,
  formatGameDuration,
  getItemImageUrl,
  getSummonerSpellImageUrl,
  getChampionSquareUrl,
  formatCS,
  formatGold,
  getSummonerSpellsData,
  getItemsData,
  getRunesData,
  getRuneImageUrl,
  getRuneStyleImageUrl,
  getRuneInfo,
  getRuneStyleName,
  getPrimaryRune,
  getSecondaryRuneStyle,
  getSecondaryRune,
  type Account,
  type Summoner, 
  type RankedInfo,
  type Match
} from "@/lib/riotServerApi";

interface PlayerPageProps {
  params: Promise<{
    summonerName: string;
  }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const resolvedParams = await params;
  const summonerName = decodeURIComponent(resolvedParams.summonerName);
  
  let summoner: Summoner | null = null;
  let rankedData: RankedInfo[] = [];
  let matches: Match[] = [];
  let error: string | null = null;
  let spellsData: any = {};
  let itemsData: any = {};
  let runesData: any = [];

  try {
    if (summonerName.includes('#')) {
      const [gameName, tagLine] = summonerName.split('#');
      const account = await getAccountByRiotId(gameName, tagLine);
      summoner = await getSummonerByPuuid(account.puuid);
    } else {
      summoner = await getSummonerByName(summonerName);
    }
    
    rankedData = await getRankedInfo(summoner.id);
    
    const matchIds = await getMatchHistory(summoner.puuid, 5);
    const matchPromises = matchIds.map(id => getMatchDetails(id));
    matches = await Promise.all(matchPromises);
    
    const [spells, items, runes] = await Promise.all([
      getSummonerSpellsData(),
      getItemsData(),
      getRunesData()
    ]);
    spellsData = spells;
    itemsData = items;
    runesData = runes;
    
  } catch (err) {
    error = err instanceof Error ? err.message : "Erro ao buscar jogador";
  }

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
      for (const slot of tree.slots || []) {
        for (const rune of slot.runes || []) {
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

  const getItemInfo = (itemId: number): { 
    name: string; 
    description: string; 
    stats: string[];
    cost: string;
  } => {
    const item = itemsData[itemId.toString()];
    
    if (item) {
      const cleanDescription = item.plaintext || item.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
      
      const stats: string[] = [];
      if (item.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          if (value && typeof value === 'number') {
            let statName = stat;
            const statTranslations: { [key: string]: string } = {
              'FlatHPPoolMod': 'Vida',
              'FlatMPPoolMod': 'Mana',
              'FlatArmorMod': 'Armadura',
              'FlatSpellBlockMod': 'Resistência Mágica',
              'FlatPhysicalDamageMod': 'Dano de Ataque',
              'FlatMagicDamageMod': 'Poder de Habilidade',
              'PercentAttackSpeedMod': 'Velocidade de Ataque',
              'PercentMovementSpeedMod': 'Velocidade de Movimento',
              'FlatCritChanceMod': 'Chance de Crítico',
              'PercentLifeStealMod': 'Roubo de Vida'
            };
            
            statName = statTranslations[stat] || stat;
            const formattedValue = stat.includes('Percent') ? `${(value * 100).toFixed(0)}%` : value.toString();
            stats.push(`${formattedValue} ${statName}`);
          }
        });
      }
      
      const cost = item.gold?.total ? `${item.gold.total} (${item.gold.base})` : '';
      
      return {
        name: item.name,
        description: cleanDescription,
        stats,
        cost
      };
    }
    
    return { 
      name: 'Item Desconhecido', 
      description: 'Informações não disponíveis',
      stats: [],
      cost: ''
    };
  };

  const getSoloQueueData = () => {
    return rankedData.find(r => r.queueType === "RANKED_SOLO_5x5");
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link 
              href="/player" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para pesquisa
            </Link>
          </div>
          
          <Card>
            <CardBody className="p-6">
              <div className="text-center">
                <Chip color="danger" variant="flat" className="mb-4">
                  Erro
                </Chip>
                <h3 className="text-lg font-semibold mb-2">Jogador não encontrado</h3>
                <p className="text-sm text-default-500">
                  {error}
                </p>
              </div>
            </CardBody>
          </Card>
        </main>
      </div>
    );
  }

  if (!summoner) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-danger mb-4">
              Erro inesperado
            </h1>
            <Link href="/player" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Voltar para pesquisa
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/player" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para pesquisa
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
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
                    Nível {summoner.summonerLevel}
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
                                <span>Vitórias: {soloQ.wins}</span>
                                <span>Derrotas: {soloQ.losses}</span>
                              </div>
                              <Progress value={winRate} color="primary" />
                              <div className="text-center text-sm">
                                {winRate}% de vitórias
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
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Histórico de Partidas
                </h3>
                
                {matches.length > 0 ? (
                  <div className="space-y-3">
                    {matches.map((match, index) => {
                      const playerData = match.info.participants.find(
                        p => p.puuid === summoner.puuid
                      );
                      
                      if (!playerData) return null;
                      
                      const kda = calculateKDA(playerData.kills, playerData.deaths, playerData.assists);
                      const cs = formatCS(playerData.totalMinionsKilled || 0, playerData.neutralMinionsKilled || 0);
                      const items = [playerData.item0, playerData.item1, playerData.item2, playerData.item3, playerData.item4, playerData.item5, playerData.item6];
                      
                      return (
                        <Card key={match.metadata.matchId} variant="bordered" className={`${playerData.win ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
                          <CardBody className="p-3">
                            <div className="flex items-center gap-3">
                              
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
                              
                              <div className="flex items-center gap-2">
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
                              
                              <div className="w-16 text-center">
                                <div className="text-sm font-semibold">
                                  {playerData.kills} / <span className="text-red-500">{playerData.deaths}</span> / {playerData.assists}
                                </div>
                                <div className="text-xs text-default-500">
                                  {kda} KDA
                                </div>
                              </div>
                              
                              <div className="w-12 text-center">
                                <div className="text-sm font-medium">
                                  {(playerData.totalMinionsKilled || 0) + (playerData.neutralMinionsKilled || 0)}
                                </div>
                                <div className="text-xs text-default-500">CS</div>
                              </div>
                              
                              <div className="flex gap-1">
                                {items.slice(0, 6).map((itemId, itemIndex) => (
                                  <div key={itemIndex} className="w-7 h-7 bg-default-100 rounded border overflow-hidden">
                                    {itemId > 0 ? (
                                      <Tooltip 
                                        content={
                                          <div className="max-w-xs p-2">
                                            {(() => {
                                              const itemInfo = getItemInfo(itemId);
                                              return (
                                                <>
                                                  <div className="font-semibold text-primary mb-2">{itemInfo.name}</div>
                                                  <div className="text-xs text-default-600 mb-2">
                                                    {itemInfo.description}
                                                  </div>
                                                  {itemInfo.stats.length > 0 && (
                                                    <div className="mb-2">
                                                      {itemInfo.stats.map((stat, index) => (
                                                        <div key={index} className="text-xs text-foreground">
                                                          {stat}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                  {itemInfo.cost && (
                                                    <div className="text-xs text-warning">
                                                      Custo: {itemInfo.cost}
                                                    </div>
                                                  )}
                                                </>
                                              );
                                            })()} 
                                          </div>
                                        }
                                      >
                                        <Image
                                          src={getItemImageUrl(itemId)}
                                          alt={`Item ${itemId}`}
                                          className="w-full h-full object-cover cursor-help"
                                          width={28}
                                          height={28}
                                        />
                                      </Tooltip>
                                    ) : null}
                                  </div>
                                ))}
                                <div className="w-7 h-7 bg-default-100 rounded border overflow-hidden">
                                  {items[6] > 0 && (
                                    <Tooltip 
                                      content={
                                        <div className="max-w-xs p-2">
                                          {(() => {
                                            const itemInfo = getItemInfo(items[6]);
                                            return (
                                              <>
                                                <div className="font-semibold text-primary mb-2">{itemInfo.name}</div>
                                                <div className="text-xs text-default-600 mb-2">
                                                  {itemInfo.description}
                                                </div>
                                                {itemInfo.stats.length > 0 && (
                                                  <div className="mb-2">
                                                    {itemInfo.stats.map((stat, index) => (
                                                      <div key={index} className="text-xs text-foreground">
                                                        {stat}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                                {itemInfo.cost && (
                                                  <div className="text-xs text-warning">
                                                    Custo: {itemInfo.cost}
                                                  </div>
                                                )}
                                              </>
                                            );
                                          })()} 
                                        </div>
                                      }
                                    >
                                      <Image
                                        src={getItemImageUrl(items[6])}
                                        alt={`Trinket ${items[6]}`}
                                        className="w-full h-full object-cover cursor-help"
                                        width={28}
                                        height={28}
                                      />
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="grid grid-cols-2 gap-x-4 text-xs">
                                  <div className="space-y-0.5">
                                    {match.info.participants.slice(0, 5).map((participant, pIndex) => (
                                      <div key={pIndex} className={`flex items-center gap-1 ${participant.puuid === summoner.puuid ? 'font-semibold text-primary' : ''}`}>
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
                                  <div className="space-y-0.5">
                                    {match.info.participants.slice(5, 10).map((participant, pIndex) => (
                                      <div key={pIndex} className={`flex items-center gap-1 ${participant.puuid === summoner.puuid ? 'font-semibold text-primary' : ''}`}>
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
                              
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-default-500">Nenhuma partida encontrada</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}