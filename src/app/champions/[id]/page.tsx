"use client";

import { 
  Card, 
  CardBody, 
  Image, 
  Chip, 
  Progress, 
  Divider,
  Tabs,
  Tab,
  Spinner
} from "@heroui/react";
import { getChampionByKey, getChampionImageUrl, getChampionSplashUrl, getSpellImageUrl, getPassiveImageUrl } from "@/lib/championsApi";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { ChampionDetail } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function formatHtmlDescription(description: string): JSX.Element {
  let formatted = description
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  formatted = formatted.replace(/<[^>]*>/g, '');

  const gameTerms = {
    'physical damage': '<span class="text-red-500 font-semibold">physical damage</span>',
    'magic damage': '<span class="text-blue-500 font-semibold">magic damage</span>',
    'true damage': '<span class="text-purple-500 font-semibold">true damage</span>',
    'armor': '<span class="text-yellow-600 font-semibold">armor</span>',
    'magic resist': '<span class="text-purple-500 font-semibold">magic resist</span>',
    'health': '<span class="text-green-500 font-semibold">health</span>',
    'escudo': '<span class="text-gray-400 font-semibold">escudo</span>',
    'dano de ataque': '<span class="text-orange-500 font-semibold">dano de ataque</span>',
    'poder de habilidade': '<span class="text-blue-500 font-semibold">poder de habilidade</span>',
    'attack speed': '<span class="text-yellow-500 font-semibold">attack speed</span>',
    'critical chance': '<span class="text-red-400 font-semibold">critical chance</span>',
    'movement speed': '<span class="text-cyan-400 font-semibold">movement speed</span>',
    'dash': '<span class="text-cyan-300 font-semibold">dash</span>',
    'teleporte': '<span class="text-purple-400 font-semibold">teleporte</span>',
    'stun': '<span class="text-yellow-400 font-semibold">stun</span>',
    'silence': '<span class="text-purple-300 font-semibold">silence</span>',
    'slow': '<span class="text-blue-300 font-semibold">slow</span>',
    'blind': '<span class="text-gray-500 font-semibold">blind</span>',
    'medo': '<span class="text-purple-600 font-semibold">medo</span>',
    'charm': '<span class="text-pink-400 font-semibold">charm</span>',
    'taunt': '<span class="text-red-600 font-semibold">taunt</span>',
    'suppression': '<span class="text-red-700 font-semibold">suppression</span>',
    'disarm': '<span class="text-orange-400 font-semibold">disarm</span>',
    'raiz': '<span class="text-green-600 font-semibold">raiz</span>',
    'enraizamento': '<span class="text-green-600 font-semibold">enraizamento</span>',
    'heal': '<span class="text-green-400 font-semibold">heal</span>',
    'regeneration': '<span class="text-green-300 font-semibold">regeneration</span>',
    'life steal': '<span class="text-red-300 font-semibold">life steal</span>',
    'vampirismo': '<span class="text-red-300 font-semibold">vampirismo</span>',
    'mana': '<span class="text-blue-400 font-semibold">mana</span>',
    'energy': '<span class="text-yellow-300 font-semibold">energy</span>',
    'fury': '<span class="text-red-500 font-semibold">fury</span>',
    'courage': '<span class="text-orange-300 font-semibold">courage</span>',
    'range': '<span class="text-gray-300 font-medium">range</span>',
    'duration': '<span class="text-gray-300 font-medium">duration</span>',
    'cooldown': '<span class="text-gray-400 font-medium">cooldown</span>',
    'cast time': '<span class="text-gray-400 font-medium">cast time</span>',
    '%': '<span class="text-yellow-300">%</span>',
  };

  Object.entries(gameTerms).forEach(([term, replacement]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    formatted = formatted.replace(regex, replacement);
  });

  formatted = formatted.replace(/(\d+(?:\.\d+)?)\s*%/g, '<span class="text-yellow-300 font-medium">$1%</span>');
  
  formatted = formatted.replace(/(\d+(?:\.\d+)?)\s*(de dano|pontos de vida|de mana|de energia)/gi, 
    '<span class="text-white font-semibold">$1</span> $2');

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}

interface ChampionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ChampionPage({ params }: ChampionPageProps) {
  const [champion, setChampion] = useState<ChampionDetail | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [passiveImageUrl, setPassiveImageUrl] = useState<string | null>(null);
  const [spellImageUrls, setSpellImageUrls] = useState<string[]>([]);
  const [splashUrl, setSplashUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChampion() {
      try {
        const resolvedParams = await params;
        const championData = await getChampionByKey(resolvedParams.id);
        
        if (championData) {
          setChampion(championData);
          
          const imagePromises = [
            getChampionImageUrl(championData.image.full),
            getPassiveImageUrl(championData.passive.image.full),
            ...championData.spells.map(spell => getSpellImageUrl(spell.image.full))
          ];
          
          const [imgUrl, passiveUrl, ...spellUrls] = await Promise.all(imagePromises);
          
          setImageUrl(imgUrl);
          setPassiveImageUrl(passiveUrl);
          setSpellImageUrls(spellUrls);
          setSplashUrl(getChampionSplashUrl(championData.id));
        } else {
          setError("Champion not found");
        }
      } catch {
        setError("Error loading champion data");
      } finally {
        setLoading(false);
      }
    }

    fetchChampion();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-lg text-default-500">Loading champion...</p>
        </div>
      </div>
    );
  }

  if (error || !champion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">
            {error || "Champion not found"}
          </h1>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to champions
          </Link>
        </div>

        <div className="relative w-full h-[500px] rounded-lg overflow-hidden mb-8">
          {splashUrl && (
            <Image
              src={splashUrl}
              alt={`${champion.name} splash art`}
              className="w-full h-full object-cover object-top"
              removeWrapper
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
            <div className="flex items-center gap-4 mb-4">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={champion.name}
                  className="w-20 h-20 rounded-lg border-2 border-white flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold">{champion.name}</h1>
                <p className="text-xl text-gray-200">{champion.title}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {champion.tags?.map((tag, index) => (
                    <Chip key={index} size="sm" variant="solid" color="primary" className="text-white">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-4">Statistics</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ataque</span>
                      <span>{champion.info.attack}/10</span>
                    </div>
                    <Progress value={champion.info.attack * 10} color="danger" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Defesa</span>
                      <span>{champion.info.defense}/10</span>
                    </div>
                    <Progress value={champion.info.defense * 10} color="warning" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Magia</span>
                      <span>{champion.info.magic}/10</span>
                    </div>
                    <Progress value={champion.info.magic * 10} color="secondary" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dificuldade</span>
                      <span>{champion.info.difficulty}/10</span>
                    </div>
                    <Progress value={champion.info.difficulty * 10} color="primary" />
                  </div>
                </div>

                <Divider className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vida:</span>
                    <span>{champion.stats.hp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mana:</span>
                    <span>{champion.stats.mp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Armadura:</span>
                    <span>{champion.stats.armor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Magic Resist:</span>
                    <span>{champion.stats.spellblock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Velocidade:</span>
                    <span>{champion.stats.movespeed}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs aria-label="Champion information" color="primary">
              <Tab key="overview" title="Overview">
                <Card>
                  <CardBody className="p-6">
                    <h3 className="text-xl font-bold mb-4">Lore</h3>
                    <p className="text-default-700 leading-relaxed">
                      {champion.lore || champion.blurb}
                    </p>
                  </CardBody>
                </Card>
              </Tab>
              
              <Tab key="abilities" title="Habilidades">
                <div className="space-y-4">
                  <Card>
                    <CardBody className="p-4">
                      <div className="flex gap-4">
                        {passiveImageUrl && (
                          <Image
                            src={passiveImageUrl}
                            alt={champion.passive.name}
                            className="w-12 h-12 rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-primary">
                            Passiva: {champion.passive.name}
                          </h4>
                          <div className="text-sm text-default-700 mt-1">
                            {formatHtmlDescription(champion.passive.description)}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {champion.spells.map((spell, index) => (
                    <Card key={spell.id}>
                      <CardBody className="p-4">
                        <div className="flex gap-4">
                          {spellImageUrls[index] && (
                            <Image
                              src={spellImageUrls[index]}
                              alt={spell.name}
                              className="w-12 h-12 rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold">
                              {['Q', 'W', 'E', 'R'][index]}: {spell.name}
                            </h4>
                            <div className="text-sm text-default-700 mt-1">
                              {formatHtmlDescription(spell.description)}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </Tab>

              <Tab key="tips" title="Dicas">
                <div className="space-y-4">
                  {champion.allytips.length > 0 && (
                    <Card>
                      <CardBody className="p-6">
                        <h4 className="font-bold text-green-600 mb-3">Dicas de Aliado</h4>
                        <ul className="space-y-2">
                          {champion.allytips.map((tip, index) => (
                            <li key={index} className="text-sm text-default-700 flex">
                              <span className="text-green-600 mr-2 flex-shrink-0">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  )}

                  {champion.enemytips.length > 0 && (
                    <Card>
                      <CardBody className="p-6">
                        <h4 className="font-bold text-red-600 mb-3">Dicas contra Inimigo</h4>
                        <ul className="space-y-2">
                          {champion.enemytips.map((tip, index) => (
                            <li key={index} className="text-sm text-default-700 flex">
                              <span className="text-red-600 mr-2 flex-shrink-0">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  )}

                  {champion.allytips.length === 0 && champion.enemytips.length === 0 && (
                    <Card>
                      <CardBody className="p-6 text-center">
                        <p className="text-default-500">No tips available for this champion.</p>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}