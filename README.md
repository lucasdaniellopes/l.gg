# L.gg - League of Legends Player Stats

Uma aplicação web moderna para consultar estatísticas de jogadores do League of Legends, inspirada em sites como op.gg e u.gg.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Pesquisa de Jogadores**: Suporte para Riot ID (Nome#TAG) e nomes de invocador legados
- **Perfil do Jogador**: Informações detalhadas incluindo nível, ícone e dados ranqueados
- **Histórico de Partidas**: Últimas 5 partidas com informações completas
- **Estatísticas Detalhadas**: KDA, CS, gold, duração da partida
- **Itens e Builds**: Visualização de itens com tooltips informativos
- **Sistema de Runas**: Exibição das runas principais e secundárias com descrições
- **Feitiços de Invocador**: Ícones e nomes dos summoner spells
- **Dados Ranqueados**: Informações de Solo/Duo Queue com emblemas de tier
- **Interface Responsiva**: Design otimizado para diferentes tamanhos de tela

### 🔍 Detalhes Técnicas
- **APIs Oficiais**: Integração com Riot Games API e Data Dragon
- **Dados Reais**: Informações atualizadas diretamente da Riot Games
- **Cache Inteligente**: Sistema de cache para melhorar performance
- **Tooltips Informativos**: Descrições detalhadas de itens, runas e feitiços
- **Suporte Multilíngue**: Interface em português com dados da Data Dragon
- **Tratamento de Erros**: Mensagens de erro claras e fallbacks

## 🛠️ Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 18 + TypeScript
- **UI Library**: HeroUI (NextUI fork)
- **Styling**: Tailwind CSS
- **APIs**: Riot Games API + Data Dragon
- **Assets**: BigBrain.gg (tier emblems, rune icons)

## 🏗️ Arquitetura

```
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicial
│   ├── globals.css         # Estilos globais
│   └── player/
│       ├── page.tsx        # Busca de jogadores
│       └── [summonerName]/
│           └── page.tsx    # Perfil do jogador
├── components/
│   ├── Navbar.tsx          # Navegação
│   └── ChampionCard.tsx    # Card de campeão
└── lib/
    └── riotServerApi.ts    # API calls e utilitários
```

## ⚙️ Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Chave da API da Riot Games

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd l.gg
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local e adicione sua chave da API
RIOT_API_KEY=RGAPI-sua-chave-aqui
```

4. Execute o projeto:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🔑 API da Riot Games

### Obtendo uma Chave
1. Acesse [developer.riotgames.com](https://developer.riotgames.com)
2. Faça login com sua conta da Riot
3. Gere uma Development Key (válida por 24h)
4. Para uso em produção, solicite uma Production Key

### Endpoints Utilizados
- **Account-v1**: Busca por Riot ID
- **Summoner-v4**: Informações do invocador
- **League-v4**: Dados ranqueados
- **Match-v5**: Histórico e detalhes de partidas
- **Data Dragon**: Assets estáticos (itens, runas, campeões)

## 🔧 Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

### Obrigatórias:
- `RIOT_API_KEY`: Sua chave da API da Riot Games

### Opcionais:
- `RIOT_REGION`: Região da API (padrão: BR1)
- `RIOT_REGIONAL_ENDPOINT`: Endpoint regional (padrão: americas)
- `CACHE_DURATION`: Duração do cache em ms (padrão: 3600000)
- `NODE_ENV`: Ambiente de execução
- `NEXT_PUBLIC_APP_URL`: URL da aplicação

### Configuração:
1. Copie `.env.example` para `.env.local`
2. Adicione sua chave da API da Riot
3. Configure outras variáveis conforme necessário

## 🎮 Como Usar

### Buscar Jogador
1. Acesse a página inicial
2. Digite o Riot ID (ex: `kami#BR1`) ou nome de invocador
3. Clique em "Pesquisar"

### Visualizar Perfil
- **Informações Básicas**: Nível, ícone, rank atual
- **Estatísticas Ranqueadas**: LP, vitórias, derrotas, winrate
- **Histórico de Partidas**: KDA, itens, runas, resultado

### Tooltips Informativos
- **Itens**: Hover sobre itens para ver stats e descrição
- **Runas**: Informações detalhadas das runas principais e secundárias
- **Feitiços**: Nomes dos summoner spells

## 🚧 Limitações Atuais

- **Development Key**: Expira a cada 24 horas
- **Rate Limits**: 20 calls/segundo, 100 calls/2 minutos
- **Região**: Configurado para Brasil (BR1/Americas)
- **Histórico**: Limitado às últimas 5 partidas
- **CORS**: Requer Server Components para contornar restrições

## 🔄 Próximas Funcionalidades

- [ ] Histórico estendido de partidas
- [ ] Estatísticas de campeões
- [ ] Gráficos de performance
- [ ] Comparação entre jogadores
- [ ] Sistema de favoritos
- [ ] Suporte a outras regiões
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro/claro

## 🐛 Problemas Conhecidos

- Development keys expiram frequentemente
- Alguns nomes de invocador legados podem não funcionar
- Rate limits podem causar erros temporários

## 📱 Screenshots

### Página Inicial
Interface limpa para busca de jogadores com suporte a Riot ID.

### Perfil do Jogador
- Informações ranqueadas com emblemas oficiais
- Histórico de partidas estilo op.gg
- Tooltips detalhados para todos os elementos

### Histórico de Partidas
- Layout similar aos sites populares de stats
- Informações completas de build (itens + runas)
- Indicadores visuais de vitória/derrota

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar problemas:

1. Verifique se sua API key está válida
2. Confirme que as variáveis de ambiente estão configuradas
3. Teste com diferentes nomes de jogadores
4. Verifique os logs do console para erros detalhados

---

**Nota**: Este projeto não é afiliado à Riot Games. League of Legends é uma marca registrada da Riot Games, Inc.