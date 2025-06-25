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

  const searchPlayer = () => {
    const trimmedName = summonerName.trim();
    if (!trimmedName || loading) return;
    
    setLoading(true);
    
    const url = `/player/${encodeURIComponent(trimmedName)}`;
    router.push(url);
  };
  

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search Player
          </h1>
          <p className="text-default-500">
            Enter Riot ID (e.g., PlayerName#TAG) or summoner name
          </p>
        </div>

        <Card className="mb-8">
          <CardBody className="p-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                searchPlayer();
              }}
              className="flex gap-4 items-end"
            >
              <Input
                label="Riot ID or Summoner Name"
                placeholder="Ex: kami#BR1 ou mrkirito13#365"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                startContent={<User className="w-4 h-4 text-default-400" />}
                className="flex-1"
                isDisabled={loading}
                autoFocus
              />
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                isDisabled={!summonerName.trim()}
                startContent={!loading ? <Search className="w-4 h-4" /> : undefined}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardBody>
        </Card>

      </main>
    </div>
  );
}