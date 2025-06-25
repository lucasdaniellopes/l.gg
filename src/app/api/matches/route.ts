import { NextRequest, NextResponse } from 'next/server';
import { getMatchHistory, getMatchDetails } from '@/lib/riotServerApi';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const puuid = searchParams.get('puuid');
    const count = parseInt(searchParams.get('count') || '10');
    const start = parseInt(searchParams.get('start') || '0');

    if (!puuid) {
      return NextResponse.json({ error: 'PUUID is required' }, { status: 400 });
    }

    const matchIds = await getMatchHistory(puuid, count, start);
    const matches = await Promise.all(
      matchIds.map(id => getMatchDetails(id))
    );

    return NextResponse.json(matches);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch matches' }, 
      { status: 500 }
    );
  }
}