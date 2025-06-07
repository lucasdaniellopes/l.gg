import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import PlayerProfile from "@/components/PlayerProfile";
import MatchHistory from "@/components/MatchHistory";
import PlayerNotFound from "@/components/PlayerNotFound";
import { 
  getSummonerByName,
  getAccountByRiotId,
  getSummonerByPuuid,
  getRankedInfo, 
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
        <PlayerNotFound title="Erro inesperado" />
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
            <PlayerProfile summoner={summoner} rankedData={rankedData} />
          </div>

          <div className="lg:col-span-2">
            <MatchHistory 
              matches={matches}
              summoner={summoner}
              spellsData={spellsData}
              itemsData={itemsData}
              runesData={runesData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}