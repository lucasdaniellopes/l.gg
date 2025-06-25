"use client";

import { useState, useEffect, useMemo } from "react";
import { Champion } from "@/lib/types";
import { getChampions, getCurrentVersion, getChampionImageUrl } from "@/lib/championsApi";
import ChampionCard from "@/components/ChampionCard";
import { Search, Sparkles, BarChart3, Target } from "lucide-react";
import { 
  Button,
  Input,
  Chip,
  Spinner
} from "@heroui/react";

export default function HomePage() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredChampions = useMemo(() => 
    champions.filter(champion =>
      champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      champion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      champion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [champions, searchTerm]
  );

  useEffect(() => {
    async function fetchData() {
      if (champions.length === 0) {
        try {
          const [championsData, version] = await Promise.all([
            getChampions(),
            getCurrentVersion()
          ]);
          setChampions(championsData);
          setCurrentVersion(version);
          
          const imagePromises = championsData.map(champion => 
            getChampionImageUrl(champion.image.full)
          );
          Promise.all(imagePromises).catch(() => {});
          
        } catch {
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchData();
  }, [champions.length]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Spinner size="lg" color="primary" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Loading champions...</h2>
            <p className="text-sm text-default-500">Fetching League of Legends data</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Champions</h1>
            <p className="text-sm text-default-500">
              {searchTerm ? `${filteredChampions.length} of ${champions.length} champions` : `${champions.length} champions`}
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <Input
              classNames={{
                base: "w-64",
                inputWrapper: "h-9 bg-default-100/50 border-default-200",
              }}
              placeholder="Search champion..."
              size="sm"
              type="search"
              variant="bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className="w-4 h-4 text-default-400" />}
            />
          </div>
        </div>

        <div className="md:hidden mb-4">
          <Input
            classNames={{
              base: "w-full",
              inputWrapper: "h-10 bg-default-100/50 border-default-200",
            }}
            placeholder="Search champion..."
            size="sm"
            type="search"
            variant="bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="w-4 h-4 text-default-400" />}
          />
        </div>

        <div className="flex items-center gap-6 text-sm text-default-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Updated for Patch {currentVersion}
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            {champions.length} Champions
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Riot Games Data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {filteredChampions.map((champion) => (
          <ChampionCard 
            key={champion.id} 
            champion={champion}
          />
        ))}
      </div>

      {filteredChampions.length === 0 && !loading && searchTerm && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Chip color="warning" variant="flat" className="mb-4">
              Nenhum resultado
            </Chip>
            <h3 className="text-lg font-semibold mb-2">No champions found</h3>
            <p className="text-sm text-default-500 mb-4">
              Try searching for another name, title or role.
            </p>
            <Button 
              color="primary" 
              variant="bordered" 
              size="sm"
              onPress={() => setSearchTerm("")}
            >
              Limpar busca
            </Button>
          </div>
        </div>
      )}

      {champions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Chip color="danger" variant="flat" className="mb-4">
              Connection Error
            </Chip>
            <h3 className="text-lg font-semibold mb-2">Could not load champions</h3>
            <p className="text-sm text-default-500 mb-4">
              Check your internet connection and try again.
            </p>
            <Button color="primary" variant="bordered" size="sm">
              Recarregar
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}