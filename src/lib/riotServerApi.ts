const RIOT_API_KEY = process.env.RIOT_API_KEY;
const PLATFORM_URL = 'https://br1.api.riotgames.com';
const REGIONAL_URL = 'https://americas.api.riotgames.com';

interface DataDragonSummonerSpell {
  id: string;
  name: string;
  description: string;
  key: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface DataDragonItem {
  name: string;
  description: string;
  plaintext?: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  stats?: Record<string, number>;
}

interface DataDragonRune {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
  longDesc: string;
}

interface DataDragonRuneSlot {
  runes: DataDragonRune[];
}

interface DataDragonRuneTree {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: DataDragonRuneSlot[];
}

export type SummonerSpellsData = Record<string, DataDragonSummonerSpell>;
export type ItemsData = Record<string, DataDragonItem>;
export type RunesData = DataDragonRuneTree[];

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 50;

export function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'PLAYER_NOT_FOUND': 'Player not found. Please check if the name/Riot ID is correct.',
    'API_KEY_EXPIRED': 'API key issue. Please check if your Personal API key is active.',
    'API_KEY_INVALID': 'API key is invalid. Please check your configuration.',
    'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a few seconds and try again.',
    'SUMMONER_DATA_INCOMPLETE': 'Incomplete summoner data. Please try again or contact support.',
    'PUUID_DECRYPTION_ERROR': 'PUUID decryption issue. Some data may not be available.',
  };
  
  if (errorCode.startsWith('API_ERROR_')) {
    const statusCode = errorCode.replace('API_ERROR_', '');
    return `Riot API error (${statusCode}). Please try again later.`;
  }
  
  return errorMessages[errorCode] || 'Unknown error. Please try again.';
}

export interface Account {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface Summoner {
  accountId: string | null;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string | null;
  puuid: string;
  summonerLevel: number;
}

export interface RankedInfo {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface Match {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameId: number;
    gameMode: string;
    gameType: string;
    participants: MatchParticipant[];
  };
}

export interface MatchParticipant {
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  puuid: string;
  summonerName: string;
  riotIdGameName: string;
  riotIdTagLine: string;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  champLevel: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  lane: string;
  role: string;
  perks: {
    statPerks: {
      defense: number;
      flex: number;
      offense: number;
    };
    styles: Array<{
      description: string;
      selections: Array<{
        perk: number;
        var1: number;
        var2: number;
        var3: number;
      }>;
      style: number;
    }>;
  };
}

async function makeRiotRequest(url: string) {
  if (!RIOT_API_KEY) {
    throw new Error('Riot API key not configured');
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();

  
  try {
    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    });

    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('PLAYER_NOT_FOUND');
      }
      if (response.status === 403) {
        throw new Error('API_KEY_EXPIRED');
      }
      if (response.status === 401) {
        throw new Error('API_KEY_INVALID');
      }
      if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.status?.message?.includes('Exception decrypting')) {
          throw new Error('PUUID_DECRYPTION_ERROR');
        }
        throw new Error('BAD_REQUEST');
      }
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(`API_ERROR_${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Connection error with Riot API');
    }
    throw error;
  }
}

export async function getAccountByRiotId(gameName: string, tagLine: string): Promise<Account> {
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(tagLine);
  const url = `${REGIONAL_URL}/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;
  return makeRiotRequest(url);
}

export async function getSummonerByName(summonerName: string): Promise<Summoner> {
  const encodedName = encodeURIComponent(summonerName);
  const url = `${PLATFORM_URL}/lol/summoner/v4/summoners/by-name/${encodedName}`;
  return makeRiotRequest(url);
}

export async function getSummonerByPuuid(puuid: string, gameName?: string): Promise<Summoner | null> {
  
  try {
    const url = `${PLATFORM_URL}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const data = await makeRiotRequest(url);
    
    
    return {
      puuid: data.puuid || puuid,
      id: data.id || null,
      accountId: data.accountId || null,
      name: gameName || data.name || "Name obtained via Riot ID",
      profileIconId: data.profileIconId || 0,
      revisionDate: data.revisionDate || Date.now(),
      summonerLevel: data.summonerLevel || 0
    };
  } catch {
    
    return {
      puuid: puuid,
      id: null,
      accountId: null,
      name: gameName || "Name obtained via Riot ID",
      profileIconId: 0,
      revisionDate: Date.now(),
      summonerLevel: 0
    };
  }
}

export async function getRankedInfo(summonerId: string | null): Promise<RankedInfo[]> {
  if (!summonerId) {
    return [];
  }
  
  const url = `${PLATFORM_URL}/lol/league/v4/entries/by-summoner/${summonerId}`;
  return makeRiotRequest(url);
}

export async function getRankedInfoByPuuid(puuid: string): Promise<RankedInfo[]> {
  const url = `${PLATFORM_URL}/lol/league/v4/entries/by-puuid/${puuid}`;
  return makeRiotRequest(url);
}

export async function getMatchHistory(puuid: string, count: number = 5, start: number = 0): Promise<string[]> {
  const url = `${REGIONAL_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
  return makeRiotRequest(url);
}

export async function getMatchDetails(matchId: string): Promise<Match> {
  const url = `${REGIONAL_URL}/lol/match/v5/matches/${matchId}`;
  return makeRiotRequest(url);
}

export function getProfileIconUrl(iconId: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${iconId}.png`;
}

export function getRankedEmblemUrl(tier: string): string {
  const formattedTier = tier.toLowerCase();
  
  const tierUrls: { [key: string]: string } = {
    'iron': 'https://static.bigbrain.gg/assets/lol/ranks/s13/iron.png',
    'bronze': 'https://static.bigbrain.gg/assets/lol/ranks/s13/bronze.png',
    'silver': 'https://static.bigbrain.gg/assets/lol/ranks/s13/silver.png',
    'gold': 'https://static.bigbrain.gg/assets/lol/ranks/s13/gold.png',
    'platinum': 'https://static.bigbrain.gg/assets/lol/ranks/s13/platinum.png',
    'emerald': 'https://static.bigbrain.gg/assets/lol/ranks/s13/emerald.png',
    'diamond': 'https://static.bigbrain.gg/assets/lol/ranks/s13/diamond.png',
    'master': 'https://static.bigbrain.gg/assets/lol/ranks/s13/master.png',
    'grandmaster': 'https://static.bigbrain.gg/assets/lol/ranks/s13/grandmaster.png',
    'challenger': 'https://static.bigbrain.gg/assets/lol/ranks/s13/challenger.png'
  };
  
  return tierUrls[formattedTier] || tierUrls['iron'];
}

export function formatGameDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function calculateKDA(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) {
    return 'Perfect';
  }
  return ((kills + assists) / deaths).toFixed(2);
}

export function getItemImageUrl(itemId: number): string {
  if (itemId === 0) return '';
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/${itemId}.png`;
}

export function getSummonerSpellImageUrl(spellId: number): string {
  const spellNames: { [key: number]: string } = {
    1: 'SummonerBoost',
    3: 'SummonerExhaust',
    4: 'SummonerFlash',
    6: 'SummonerHaste',
    7: 'SummonerHeal',
    11: 'SummonerSmite',
    12: 'SummonerTeleport',
    13: 'SummonerMana',
    14: 'SummonerDot',
    21: 'SummonerBarrier',
    32: 'SummonerSnowball'
  };
  
  const spellName = spellNames[spellId] || 'SummonerFlash';
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/spell/${spellName}.png`;
}

export function getChampionSquareUrl(championName: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${championName}.png`;
}

export function formatCS(minions: number, neutralMinions: number): string {
  return `${minions + neutralMinions} CS`;
}

export function formatGold(gold: number): string {
  if (gold >= 1000) {
    return `${(gold / 1000).toFixed(1)}k`;
  }
  return gold.toString();
}

export function getRuneImageUrl(runeId: number): string {
  const primaryCdn = 'https://static.bigbrain.gg/assets/lol/riot_static/15.11.1/img/small-perk-images';
  
  const runeMap: { [key: number]: string } = {
    8005: 'Styles/Precision/PressTheAttack/PressTheAttack.png',
    8008: 'Styles/Precision/PressTheAttack/PressTheAttack.png',
    8021: 'Styles/Precision/FleetFootwork/FleetFootwork.png',
    8010: 'Styles/Precision/Conqueror/Conqueror.png',
    8112: 'Styles/Domination/Electrocute/Electrocute.png',
    8124: 'Styles/Domination/Predator/Predator.png',
    8128: 'Styles/Domination/DarkHarvest/DarkHarvest.png',
    9923: 'Styles/Domination/HailOfBlades/HailOfBlades.png',
    8214: 'Styles/Sorcery/SummonAery/SummonAery.png',
    8229: 'Styles/Sorcery/ArcaneComet/ArcaneComet.png',
    8230: 'Styles/Sorcery/PhaseRush/PhaseRush.png',
    8437: 'Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png',
    8439: 'Styles/Resolve/Aftershock/Aftershock.png',
    8465: 'Styles/Resolve/Guardian/Guardian.png',
    8351: 'Styles/Inspiration/GlacialAugment/GlacialAugment.png',
    8360: 'Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png',
    8369: 'Styles/Inspiration/FirstStrike/FirstStrike.png'
  };
  
  const runePath = runeMap[runeId];
  if (runePath) {
    return `${primaryCdn}/${runePath}`;
  }
  
  return `${primaryCdn}/Styles/Precision/PressTheAttack/PressTheAttack.png`;
}

export function getRuneImageUrlWithFallback(runeId: number): { primary: string; fallback: string } {
  const primaryCdn = 'https://static.bigbrain.gg/assets/lol/riot_static/15.13.1/img/small-perk-images';
  const fallbackCdn = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images';
  
  const runeMap: { [key: number]: string } = {
    8005: 'Styles/Precision/PressTheAttack/PressTheAttack.png',
    8008: 'Styles/Precision/LethalTempo/LethalTempo.png', // Tentativa com nome original
    8021: 'Styles/Precision/FleetFootwork/FleetFootwork.png',
    8010: 'Styles/Precision/Conqueror/Conqueror.png',
    8112: 'Styles/Domination/Electrocute/Electrocute.png',
    8124: 'Styles/Domination/Predator/Predator.png',
    8128: 'Styles/Domination/DarkHarvest/DarkHarvest.png',
    9923: 'Styles/Domination/HailOfBlades/HailOfBlades.png',
    8214: 'Styles/Sorcery/SummonAery/SummonAery.png',
    8229: 'Styles/Sorcery/ArcaneComet/ArcaneComet.png',
    8230: 'Styles/Sorcery/PhaseRush/PhaseRush.png',
    8437: 'Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png',
    8439: 'Styles/Resolve/Aftershock/Aftershock.png',
    8465: 'Styles/Resolve/Guardian/Guardian.png',
    8351: 'Styles/Inspiration/GlacialAugment/GlacialAugment.png',
    8360: 'Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png',
    8369: 'Styles/Inspiration/FirstStrike/FirstStrike.png'
  };
  
  const fallbackRuneMap: { [key: number]: string } = {
    8005: 'styles/precision/presstheattack/presstheattack.png',
    8008: 'styles/precision/presstheattack/presstheattack.png',
    8021: 'styles/precision/fleetfootwork/fleetfootwork.png',
    8010: 'styles/precision/conqueror/conqueror.png',
    8112: 'styles/domination/electrocute/electrocute.png',
    8124: 'styles/domination/predator/predator.png',
    8128: 'styles/domination/darkharvest/darkharvest.png',
    9923: 'styles/domination/hailofblades/hailofblades.png',
    8214: 'styles/sorcery/summonaery/summonaery.png',
    8229: 'styles/sorcery/arcanecomet/arcanecomet.png',
    8230: 'styles/sorcery/phaserush/phaserush.png',
    8437: 'styles/resolve/graspoftheundying/graspoftheundying.png',
    8439: 'styles/resolve/aftershock/aftershock.png',
    8465: 'styles/resolve/guardian/guardian.png',
    8351: 'styles/inspiration/glacialaugment/glacialaugment.png',
    8360: 'styles/inspiration/unsealedspellbook/unsealedspellbook.png',
    8369: 'styles/inspiration/firststrike/firststrike.png'
  };
  
  const runePath = runeMap[runeId];
  const fallbackPath = fallbackRuneMap[runeId];
  const defaultPath = 'Styles/Precision/PressTheAttack/PressTheAttack.png';
  const defaultFallbackPath = 'styles/precision/presstheattack/presstheattack.png';
  
  return {
    primary: `${primaryCdn}/${runePath || defaultPath}`,
    fallback: `${fallbackCdn}/${fallbackPath || defaultFallbackPath}`
  };
}

export function getRuneStyleImageUrl(styleId: number): string {
  const styleMap: { [key: number]: string } = {
    8000: 'Styles/7201_Precision.png',
    8100: 'Styles/7200_Domination.png',
    8200: 'Styles/7202_Sorcery.png',
    8300: 'Styles/7203_Whimsy.png',
    8400: 'Styles/7204_Resolve.png'
  };
  
  const stylePath = styleMap[styleId];
  if (stylePath) {
    return `https://static.bigbrain.gg/assets/lol/riot_static/15.11.1/img/perk-images/${stylePath}`;
  }
  
  return `https://static.bigbrain.gg/assets/lol/riot_static/15.11.1/img/perk-images/Styles/7201_Precision.png`;
}

export async function getRuneInfo(runeId: number): Promise<{ name: string; description: string }> {
  try {
    const runes = await getRunesData();
    
    for (const tree of runes) {
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
  } catch {
    return { name: 'Unknown Rune', description: 'No information available' };
  }
}

export function getRuneStyleName(styleId: number): string {
  const styleNames: { [key: number]: string } = {
    8000: 'Precision',
    8100: 'Domination', 
    8200: 'Sorcery',
    8300: 'Inspiration',
    8400: 'Resolve'
  };
  
  return styleNames[styleId] || 'Unknown Style';
}

export function getPrimaryRune(participant: MatchParticipant): number {
  return participant.perks?.styles?.[0]?.selections?.[0]?.perk || 0;
}

export function getSecondaryRuneStyle(participant: MatchParticipant): number {
  return participant.perks?.styles?.[1]?.style || 0;
}

export function getSecondaryRune(participant: MatchParticipant): number {
  return participant.perks?.styles?.[1]?.selections?.[0]?.perk || 0;
}

const CACHE_DURATION = 1000 * 60 * 60;
let cachedSummonerSpells: SummonerSpellsData | null = null;
let cachedItems: ItemsData | null = null;
let cachedRunes: RunesData | null = null;
let cachedVersion: string | null = null;
let spellsCacheTime: number = 0;
let itemsCacheTime: number = 0;
let runesCacheTime: number = 0;
let versionCacheTime: number = 0;

export async function getLatestVersion(): Promise<string> {
  const now = Date.now();
  
  if (cachedVersion && (now - versionCacheTime) < CACHE_DURATION) {
    return cachedVersion;
  }

  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch versions');
    }
    
    const versions = await response.json();
    cachedVersion = versions[0];
    versionCacheTime = now;
    
    return cachedVersion;
  } catch {
    return '14.24.1';
  }
}

export async function getSummonerSpellsData(): Promise<SummonerSpellsData> {
  const now = Date.now();
  
  if (cachedSummonerSpells && (now - spellsCacheTime) < CACHE_DURATION) {
    return cachedSummonerSpells;
  }

  try {
    const version = await getLatestVersion();
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/summoner.json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch summoner spells');
    }
    
    const data = await response.json();
    cachedSummonerSpells = data.data;
    spellsCacheTime = now;
    
    return cachedSummonerSpells;
  } catch {
    return {};
  }
}

export async function getItemsData(): Promise<ItemsData> {
  const now = Date.now();
  
  if (cachedItems && (now - itemsCacheTime) < CACHE_DURATION) {
    return cachedItems;
  }

  try {
    const version = await getLatestVersion();
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/item.json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    
    const data = await response.json();
    cachedItems = data.data;
    itemsCacheTime = now;
    
    return cachedItems;
  } catch {
    return {};
  }
}

export async function getSummonerSpellName(spellId: number): Promise<string> {
  try {
    const spells = await getSummonerSpellsData();
    
    for (const spellKey in spells) {
      const spell = spells[spellKey];
      if (spell.key === spellId.toString()) {
        return spell.name;
      }
    }
    
    return 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export async function getRunesData(): Promise<RunesData> {
  const now = Date.now();
  
  if (cachedRunes && (now - runesCacheTime) < CACHE_DURATION) {
    return cachedRunes;
  }

  try {
    const version = await getLatestVersion();
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/runesReforged.json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch runes');
    }
    
    const data = await response.json();
    cachedRunes = data;
    runesCacheTime = now;
    
    return cachedRunes;
  } catch {
    return [];
  }
}


export async function getItemInfo(itemId: number): Promise<{ name: string; description: string }> {
  try {
    const items = await getItemsData();
    const item = items[itemId.toString()];
    
    if (item) {
      const cleanDescription = item.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
      
      return {
        name: item.name,
        description: cleanDescription
      };
    }
    
    return { name: 'Unknown Item', description: 'Information not available' };
  } catch {
    return { name: 'Unknown Item', description: 'Information not available' };
  }
}