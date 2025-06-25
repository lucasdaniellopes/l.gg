import Navbar from "@/components/Navbar";
import PlayerNotFound from "@/components/PlayerNotFound";
import PlayerPageClient from "./PlayerPageClient";
import { 
  getSummonerByName,
  getAccountByRiotId,
  getSummonerByPuuid,
  getRankedInfoByPuuid, 
  getMatchHistory, 
  getMatchDetails,
  getSummonerSpellsData,
  getItemsData,
  getRunesData,
  getErrorMessage,
  type Summoner, 
  type RankedInfo,
  type Match,
  type SummonerSpellsData,
  type ItemsData,
  type RunesData
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
  let spellsData: SummonerSpellsData = {};
  let itemsData: ItemsData = {};
  let runesData: RunesData = [];

  try {
    if (summonerName.includes('#')) {
      const [gameName, tagLine] = summonerName.split('#');
      const account = await getAccountByRiotId(gameName, tagLine);
      summoner = await getSummonerByPuuid(account.puuid, account.gameName);
    } else {
      summoner = await getSummonerByName(summonerName);
    }
    
    
    if (!summoner) {
      throw new Error('PLAYER_NOT_FOUND');
    }
    
    try {
      rankedData = await getRankedInfoByPuuid(summoner.puuid);
    } catch {
    }
    
    const matchIds = await getMatchHistory(summoner.puuid, 10);
    
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
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    error = getErrorMessage(errorMessage);
  }


  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <PlayerNotFound error={error} />
      </div>
    );
  }

  if (!summoner) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <PlayerNotFound title="Unexpected error" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <PlayerPageClient
        summoner={summoner}
        rankedData={rankedData}
        initialMatches={matches}
        spellsData={spellsData}
        itemsData={itemsData}
        runesData={runesData}
      />
    </div>
  );
}