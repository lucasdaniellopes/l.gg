# L.gg - League of Legends Analytics Platform

Uma plataforma de análise e estatísticas para League of Legends inspirada em OP.GG e U.GG. Projeto iniciado como trabalho final da disciplina Web2 e evoluído para uma aplicação completa com arquitetura profissional.

## 🚀 Status do Projeto

### ✅ Funcionalidades Implementadas

#### **Sistema de Jogadores**
- Busca avançada por Riot ID (Nome#TAG) ou nome de invocador
- Perfil completo com nível, ícone e informações ranqueadas
- Histórico de partidas com carregamento progressivo (10 iniciais + carregar mais)
- Estatísticas detalhadas: KDA, CS/min, dano, ouro ganho, role/lane
- Sistema de builds com tooltips informativos
- Runas principais e secundárias com descrições completas
- Visualização das composições dos times
- Cálculo de win rate e estatísticas agregadas

#### **Sistema de Campeões**
- Grid responsivo com 168+ campeões
- Busca por nome, título ou função
- Página detalhada com habilidades, skins e lore
- Dicas estratégicas para aliados e inimigos
- Splash arts em alta qualidade

#### **Interface e Performance**
- Design responsivo otimizado para todos dispositivos
- Loading states e error handling robusto
- Tooltips ricos com informações detalhadas
- Carregamento progressivo de dados
- Cache inteligente para otimização

### 🚧 Arquitetura Preparada (Em Desenvolvimento)

#### **Backend & Database**
- **tRPC**: Endpoints configurados para API type-safe
- **Prisma ORM**: Schema completo com modelos para:
  - Autenticação de usuários
  - Cache de partidas
  - Analytics de jogadores
  - Sistema de tiers (FREE/PREMIUM)
- **PostgreSQL**: Banco de dados pronto (Supabase)

#### **Autenticação**
- **NextAuth.js**: Configurado para Google OAuth
- **Riot SSO**: Aguardando aprovação oficial da Riot Games

## 🛠️ Stack Tecnológica

### Core
- **Next.js 15.3** - App Router + Server Components
- **TypeScript** - Type safety completo
- **React 19** - Última versão estável

### UI/UX
- **Tailwind CSS** - Estilização utility-first
- **HeroUI** - Componentes modernos
- **Lucide Icons** - Ícones consistentes

### API & Data
- **Riot Games API** - Dados oficiais
- **Data Dragon** - Assets estáticos
- **tRPC v11** - API type-safe (configurado)
- **Prisma ORM** - Database toolkit (schema pronto)

### Infra (Preparada)
- **PostgreSQL** - Banco de dados relacional
- **Zustand** - State management
- **NextAuth.js** - Autenticação

## 📁 Estrutura do Projeto

```
src/
├── app/                          # Next.js 15 App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # NextAuth endpoints
│   │   ├── trpc/               # tRPC handler
│   │   └── matches/            # Endpoint customizado
│   ├── champions/              # Sistema de campeões
│   ├── player/                 # Sistema de jogadores
│   └── login/                  # Página de autenticação
├── components/                  # Componentes reutilizáveis
├── lib/                        # Lógica de negócio
│   ├── auth/                   # Configuração NextAuth
│   ├── prisma/                 # Cliente Prisma
│   ├── riotServerApi.ts        # Integração Riot API
│   └── championsApi.ts         # API dos campeões
├── server/                     # Backend
│   └── api/                    # tRPC routers
│       ├── routers/            # Rotas organizadas
│       └── trpc.ts             # Configuração tRPC
└── stores/                     # Zustand stores
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 18.17+
- Chave da API da Riot Games
- PostgreSQL (ou Supabase)

### Setup

1. **Clone o repositório**
```bash
git clone <repository-url>
cd l.gg
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o `.env.local`:
```env
# Riot API
RIOT_API_KEY=RGAPI-sua-chave-aqui

# Database (Prisma)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gerar-com-openssl"

# Google OAuth (opcional por enquanto)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

4. **Setup do banco de dados**
```bash
npx prisma generate
npx prisma db push
```

5. **Execute o projeto**
```bash
npm run dev
```

## 🎮 Como Usar

### Buscar Jogador
1. Acesse `/player`
2. Digite o Riot ID (ex: `Kami#BR1`) ou nome
3. Pressione Enter ou clique em Pesquisar

### Visualizar Estatísticas
- KDA e performance por partida
- CS/min e estatísticas de farm
- Dano causado e ouro obtido
- Composição dos times
- Carregar mais partidas dinamicamente

### Explorar Campeões
- Navegue pela homepage
- Use a busca para filtrar
- Clique para ver detalhes completos

## 🚀 Roadmap

### Fase 1 - Otimizações (Atual)
- [x] Carregamento progressivo de partidas
- [x] Estatísticas agregadas
- [ ] Sistema de cache no banco
- [ ] Workers para coleta de dados

### Fase 2 - Features Avançadas
- [ ] Riot SSO (aguardando aprovação)
- [ ] Gráficos e visualizações
- [ ] Análise de gameplay com IA
- [ ] Sistema de matchmaking para duos/times

### Fase 3 - Diferenciação
- [ ] "Mini Coach" - Assistente de melhoria
- [ ] Comparação entre jogadores
- [ ] Predição de partidas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Nota**: Este projeto não é afiliado à Riot Games. League of Legends é uma marca registrada da Riot Games, Inc.