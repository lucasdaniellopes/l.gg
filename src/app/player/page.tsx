"use client";

import { useState } from "react";
import { 
  Card, 
  CardBody, 
  Input, 
  Button
} from "@heroui/react";
import { Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function PlayerPage() {
  const [summonerName, setSummonerName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchPlayer = async () => {
    if (!summonerName.trim()) return;
    
    setLoading(true);
    
    router.push(`/player/${encodeURIComponent(summonerName.trim())}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Pesquisar Jogador
          </h1>
          <p className="text-default-500">
            Digite o Riot ID (ex: NomeJogador#TAG) ou nome de invocador
          </p>
        </div>

        <Card className="mb-8">
          <CardBody className="p-6">
            <div className="flex gap-4 items-end">
              <Input
                label="Riot ID ou Nome do Invocador"
                placeholder="Ex: kami#BR1 ou mrkirito13#365"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchPlayer()}
                startContent={<User className="w-4 h-4 text-default-400" />}
                className="flex-1"
              />
              <Button
                color="primary"
                onPress={searchPlayer}
                isLoading={loading}
                startContent={!loading ? <Search className="w-4 h-4" /> : undefined}
              >
                {loading ? "Buscando..." : "Pesquisar"}
              </Button>
            </div>
          </CardBody>
        </Card>

      </main>
    </div>
  );
}