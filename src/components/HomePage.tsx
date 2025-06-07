"use client";

import { useState, useEffect, useMemo } from "react";
import { Champion } from "@/lib/types";
import { getChampions, getCurrentVersion, getChampionImageUrl } from "@/lib/api";
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
            <h2 className="text-lg font-semibold text-foreground">Carregando campeões...</h2>
            <p className="text-sm text-default-500">Buscando dados do League of Legends</p>
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
            <h1 className="text-2xl font-bold text-foreground">Campeões</h1>
            <p className="text-sm text-default-500">
              {searchTerm ? `${filteredChampions.length} de ${champions.length} campeões` : `${champions.length} campeões`}
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <Input
              classNames={{
                base: "w-64",
                inputWrapper: "h-9 bg-default-100/50 border-default-200",
              }}
              placeholder="Buscar campeão..."
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
            placeholder="Buscar campeão..."
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
            Atualizado para Patch {currentVersion}
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            {champions.length} Campeões
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Dados da Riot Games
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
            <h3 className="text-lg font-semibold mb-2">Nenhum campeão encontrado</h3>
            <p className="text-sm text-default-500 mb-4">
              Tente buscar por outro nome, título ou função.
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
              Erro de Conexão
            </Chip>
            <h3 className="text-lg font-semibold mb-2">Não foi possível carregar os campeões</h3>
            <p className="text-sm text-default-500 mb-4">
              Verifique sua conexão com a internet e tente novamente.
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