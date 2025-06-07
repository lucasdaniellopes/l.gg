# L.gg - League of Legends Statistics Platform

Uma aplicação web para consultar estatísticas de jogadores e campeões do League of Legends, inspirada em sites como op.gg e u.gg. Projeto desenvolvido com arquitetura profissional e componentes reutilizáveis.

## 🚀 Funcionalidades Implementadas

### 🏠 **Sistema de Campeões**
- **Grid de Campeões**: 168+ campeões em layout responsivo (2-8 colunas)
- **Busca Inteligente**: Filtros por nome, título e função/tag
- **Página de Detalhes**: Informações completas de cada campeão
- **Splash Arts**: Imagens oficiais em alta qualidade
- **Habilidades**: Passiva + Q/W/E/R com descrições
- **Dicas Estratégicas**: Tips de aliado e inimigo
- **Pré-carregamento**: Cache otimizado para performance

### 👤 **Sistema de Jogadores**
- **Busca Avançada**: Suporte para Riot ID (Nome#TAG) e nomes legados
- **Perfil Completo**: Nível, ícone, dados ranqueados com emblemas oficiais
- **Histórico Detalhado**: Últimas 5 partidas com informações completas
- **Estatísticas**: KDA, CS, gold, duração, resultado
- **Sistema de Builds**: Itens completos com tooltips informativos
- **Runas Detalhadas**: Principal e secundária com descrições
- **Feitiços**: Summoner spells com nomes e ícones
- **Times**: Lista completa dos 10 jogadores da partida

### 🔐 **Sistema de Autenticação**
- **Página de Login**: Interface moderna com animações
- **Simulação Completa**: Aceita qualquer email/senha válidos
- **Estados Visuais**: Loading states e feedback interativo

### 🎨 **Interface e UX**
- **Design Responsivo**: Otimizado para mobile, tablet e desktop
- **Loading States**: Spinners e skeletons contextuais
- **Error Handling**: Páginas 404 e tratamento de erros
- **Tooltips Ricos**: Informações detalhadas em hover
- **Performance**: Cache inteligente e otimizações de carregamento

## 🏗️ Arquitetura do Projeto

```
src/
├── app/                           # Next.js 15 App Router
│   ├── layout.tsx                # Layout principal + metadata
│   ├── page.tsx                  # Homepage com grid de campeões
│   ├── loading.tsx               # Loading global
│   ├── not-found.tsx             # Página 404 customizada
│   ├── providers.tsx             # HeroUI + Theme providers
│   ├── globals.css               # Estilos globais + Tailwind
│   ├── champions/[id]/           # Sistema de Campeões
│   │   ├── page.tsx             # Detalhes do campeão
│   │   └── loading.tsx          # Loading específico
│   ├── login/                    # Sistema de Autenticação
│   │   ├── page.tsx             # Página de login
│   │   └── icons.tsx            # Ícones customizados
│   └── player/                   # Sistema de Jogadores
│       ├── page.tsx             # Busca de jogadores
│       └── [summonerName]/
│           └── page.tsx         # Perfil do jogador
├── components/                   # Componentes Reutilizáveis
│   ├── ChampionCard.tsx         # Card individual de campeão
│   ├── ChampionInfo.tsx         # Ícone + level + spells + runas
│   ├── HomePage.tsx             # Componente principal da home
│   ├── ItemsDisplay.tsx         # Sistema de itens com tooltips
│   ├── MatchCard.tsx            # Card de partida individual
│   ├── MatchHistory.tsx         # Container do histórico
│   ├── Navbar.tsx               # Navegação principal
│   ├── PlayerNotFound.tsx       # Tratamento de erro para jogadores
│   ├── PlayerProfile.tsx        # Dados ranqueados do jogador
│   └── TeamsList.tsx            # Lista dos 10 jogadores
└── lib/                         # Lógica de Negócio
    ├── api.ts                   # API dos campeões (Data Dragon)
    ├── riotServerApi.ts         # API da Riot Games
    └── types.ts                 # Interfaces TypeScript
```

## 🛠️ Tecnologias

### **Core Framework**
- **Next.js 15**: App Router + Server Components
- **React 19**: Componentes funcionais + Hooks
- **TypeScript**: Tipagem completa do projeto

### **UI/UX**
- **HeroUI**: Biblioteca de componentes moderna
- **Tailwind CSS v4**: Estilização utility-first
- **Geist Font**: Tipografia premium

### **APIs e Dados**
- **Riot Games API**: Dados oficiais de jogadores e partidas
- **Data Dragon**: Assets estáticos (campeões, itens, runas)
- **BigBrain.gg**: Emblemas de rank e ícones de runas

### **Performance**
- **Cache System**: Cache inteligente
- **Image Optimization**: Pré-carregamento e lazy loading

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18.17+
- npm, yarn ou pnpm
- Chave da API da Riot Games

### Instalação

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd l.gg
```

2. **Instale as dependências**:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**:
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o .env.local e adicione sua chave da API
RIOT_API_KEY=RGAPI-sua-chave-aqui
```

4. **Execute o projeto**:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Acesse a aplicação**:
   - Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🔑 Configuração da API da Riot Games

### Obtendo uma Chave da API

1. Acesse [developer.riotgames.com](https://developer.riotgames.com)
2. Faça login com sua conta da Riot Games
3. Gere uma **Development Key** (válida por 24h)
4. Para produção, solicite uma **Production Key**

### Endpoints Utilizados

#### **Riot Games API**
- **Account-v1**: Busca por Riot ID (Nome#TAG)
- **Summoner-v4**: Informações básicas do invocador
- **League-v4**: Dados de ranking e LP
- **Match-v5**: Histórico e detalhes de partidas

#### **Data Dragon API**
- **Champions**: Lista e detalhes dos campeões
- **Items**: Informações de itens do jogo
- **Summoner Spells**: Feitiços de invocador
- **Runes**: Sistema de runas reforjadas
- **Profile Icons**: Ícones de perfil
- **Assets**: Imagens e splash arts

## 🔧 Variáveis de Ambiente

### Obrigatórias
```env
RIOT_API_KEY=RGAPI-sua-chave-da-api-aqui
```

### Opcionais
```env
# Configurações da API
RIOT_REGION=BR1
RIOT_REGIONAL_ENDPOINT=americas

# Performance
CACHE_DURATION=3600000
NODE_ENV=development

# Aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎮 Como Usar

### 🏠 **Página Inicial (Campeões)**
1. Acesse a homepage para ver todos os campeões
2. Use a barra de busca para filtrar por nome, título ou função
3. Clique em qualquer campeão para ver detalhes completos

### 🔍 **Buscar Jogador**
1. Clique em "Player" na navegação
2. Digite o **Riot ID** (ex: `Kami#BR1`) ou nome de invocador
3. Clique em "Pesquisar"

### 👤 **Perfil do Jogador**
- **Informações Básicas**: Nível, ícone de perfil, rank atual
- **Dados Ranqueados**: LP, vitórias, derrotas, winrate com emblemas
- **Histórico de Partidas**: 
  - KDA completo com cálculo de ratio
  - Items com tooltips detalhados (stats, custo, descrição)
  - Runas principais e secundárias com descrições
  - Feitiços de invocador
  - Lista completa dos 10 jogadores

### 🔐 **Sistema de Login**
1. Acesse `/login`
2. Digite qualquer email e senha válidos
3. Sistema simula autenticação completa

## 🎯 Requisitos Acadêmicos Atendidos

### ✅ **Todos os Requisitos Implementados**

1. **✅ Página inicial com listagem de produtos**
   - Grid responsivo com 168+ campeões
   - Busca e filtros funcionais

2. **✅ Página dinâmica (/produtos/[id])**
   - `/champions/[id]` - Detalhes de cada campeão
   - `/player/[summonerName]` - Perfil de jogadores

3. **✅ Página de login (simulação de autenticação)**
   - Sistema completo em `/login`
   - Aceita qualquer credencial válida

4. **✅ Roteamento com app/**
   - Next.js 15 App Router implementado
   - Múltiplas rotas dinâmicas

5. **✅ Estilização com Tailwind + NextUI (HeroUI)**
   - Todos os componentes estilizados
   - Design system consistente

6. **✅ Uso de layout.tsx, loading.tsx, e metadata**
   - Layout global + loading states
   - Metadata dinâmica configurada

7. **✅ Consumo de dados via fetch (Server ou Client)**
   - Server Components para SEO
   - Client Components para interatividade

## 🚀 Funcionalidades Extras (Além dos Requisitos)

- **🏗️ Arquitetura Profissional**: 10 componentes reutilizáveis
- **⚡ Performance**: Cache inteligente e otimizações
- **🎨 UX Avançado**: Loading states, error handling, tooltips ricos
- **📱 Responsividade**: Design adaptativo para todos dispositivos
- **🔧 TypeScript**: Tipagem completa e type safety
- **🔄 Error Boundaries**: Tratamento robusto de erros
- **🖼️ Asset Optimization**: Pré-carregamento de imagens

## 🚧 Limitações Conhecidas

### **API da Riot Games**
- **Development Key**: Expira a cada 24 horas
- **Rate Limits**: 20 calls/segundo, 100 calls/2 minutos
- **Região**: Configurado para Brasil (BR1/Americas)
- **CORS**: Requer Server Components

### **Funcionalidades**
- **Histórico**: Limitado às últimas 5 partidas
- **Runas**: Algumas imagens podem não carregar (dependência externa)
- **Cache**: Dados ficam em cache por 1 hora

## 🔄 Roadmap / Próximas Funcionalidades

### **Curto Prazo**
- [ ] Histórico estendido (20+ partidas)
- [ ] Melhorias no sistema de runas
- [ ] PWA (Progressive Web App)

### **Médio Prazo**
- [ ] Estatísticas de campeões
- [ ] Gráficos de performance
- [ ] Sistema de favoritos
- [ ] Suporte a outras regiões

### **Longo Prazo**
- [ ] Comparação entre jogadores
- [ ] Análise avançada de builds
- [ ] Sistema de recomendações
- [ ] Integração com streaming ( Ainda em cogitação ) 

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **API Key Expirada**
```bash
# Erro: API_KEY_EXPIRED
# Solução: Gere uma nova key em developer.riotgames.com
```

#### **Jogador Não Encontrado**
```bash
# Erro: PLAYER_NOT_FOUND
# Solução: Verifique se o Riot ID está correto (Nome#TAG)
```

#### **Rate Limit**
```bash
# Erro: RATE_LIMIT_EXCEEDED
# Solução: Aguarde alguns segundos e tente novamente
```

### **Debug**
1. Verifique as variáveis de ambiente no `.env.local`
2. Confirme que a API key está válida
3. Teste com diferentes nomes de jogadores
4. Verifique os logs do console para erros detalhados

## 🤝 Contribuição

### **Como Contribuir**
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### **Padrões do Projeto**
- **Componentes**: Use TypeScript + interfaces
- **Styling**: Tailwind CSS + HeroUI
- **Nomenclatura**: camelCase para funções, PascalCase para componentes
- **Estrutura**: Um componente por arquivo



**Nota**: Este projeto não é afiliado à Riot Games. League of Legends é uma marca registrada da Riot Games, Inc.