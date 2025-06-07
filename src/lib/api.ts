import { ChampionsResponse, ChampionDetailResponse, Champion, ChampionDetail } from './types';

const DDragon_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn';
const VERSIONS_API = 'https://ddragon.leagueoflegends.com/api/versions.json';

let cachedVersion: string | null = null;
let versionCacheTime: number = 0;
let cachedChampions: Champion[] | null = null;
let championsCacheTime: number = 0;
const imageUrlCache = new Map<string, string>();
const CACHE_DURATION = 3600000;

async function getLatestVersion(): Promise<string> {
  const now = Date.now();
  
  if (cachedVersion && (now - versionCacheTime) < CACHE_DURATION) {
    return cachedVersion;
  }

  try {
    const response = await fetch(VERSIONS_API, {
      ...(typeof window === 'undefined' ? { next: { revalidate: 3600 } } : {})
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch versions');
    }
    
    const versions: string[] = await response.json();
    const latestVersion = versions[0];
    
    cachedVersion = latestVersion;
    versionCacheTime = now;
    
    return latestVersion;
  } catch {
    return '14.24.1';
  }
}

export async function getChampions(): Promise<Champion[]> {
  const now = Date.now();
  
  if (cachedChampions && (now - championsCacheTime) < CACHE_DURATION) {
    return cachedChampions;
  }

  try {
    const version = await getLatestVersion();
    const response = await fetch(
      `${DDragon_BASE_URL}/${version}/data/pt_BR/champion.json`,
      { 
        ...(typeof window === 'undefined' ? { next: { revalidate: 3600 } } : {})
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch champions');
    }
    
    const data: ChampionsResponse = await response.json();
    const champions = Object.values(data.data);
    
    cachedChampions = champions;
    championsCacheTime = now;
    
    return champions;
  } catch {
    return cachedChampions || [];
  }
}

export async function getChampionById(id: string): Promise<ChampionDetail | null> {
  try {
    const version = await getLatestVersion();
    const response = await fetch(
      `${DDragon_BASE_URL}/${version}/data/pt_BR/champion/${id}.json`,
      { 
        ...(typeof window === 'undefined' ? { next: { revalidate: 3600 } } : {})
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch champion ${id}`);
    }
    
    const data: ChampionDetailResponse = await response.json();
    return data.data[id] || null;
  } catch {
    return null;
  }
}

export async function getChampionByKey(key: string): Promise<ChampionDetail | null> {
  try {
    const champions = await getChampions();
    const champion = champions.find(c => c.key === key);
    
    if (!champion) {
      return null;
    }
    
    return await getChampionById(champion.id);
  } catch {
    return null;
  }
}

export async function getChampionImageUrl(imageName: string): Promise<string> {
  if (imageUrlCache.has(imageName)) {
    return imageUrlCache.get(imageName)!;
  }
  
  const version = await getLatestVersion();
  const url = `${DDragon_BASE_URL}/${version}/img/champion/${imageName}`;
  imageUrlCache.set(imageName, url);
  return url;
}

export async function getSpellImageUrl(imageName: string): Promise<string> {
  const version = await getLatestVersion();
  return `${DDragon_BASE_URL}/${version}/img/spell/${imageName}`;
}

export async function getPassiveImageUrl(imageName: string): Promise<string> {
  const version = await getLatestVersion();
  return `${DDragon_BASE_URL}/${version}/img/passive/${imageName}`;
}

export function getChampionSplashUrl(championId: string, skinNum: number = 0): string {
  return `${DDragon_BASE_URL}/img/champion/splash/${championId}_${skinNum}.jpg`;
}

export function getChampionLoadingUrl(championId: string, skinNum: number = 0): string {
  return `${DDragon_BASE_URL}/img/champion/loading/${championId}_${skinNum}.jpg`;
}

export async function getCurrentVersion(): Promise<string> {
  return await getLatestVersion();
}