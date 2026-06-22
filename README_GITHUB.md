# REABILITE APP - Plataforma de Saúde Integrativa

**O maior preditor de qualidade de vida do mundo** - Unindo profissionais de saúde e pacientes em um único ecossistema digital inteligente, gamificado e social.

## 🎯 Visão Geral

REABILITE é uma plataforma web moderna que transforma a forma como pacientes e profissionais de saúde interagem, rastreiam progresso e alcançam objetivos de saúde e bem-estar.

### Cores Oficiais
- **Lucky Point**: #192E78
- **Picton Blue**: #22BFEC
- **Cerulean Blue**: #305ACF
- **True V**: #8966D2

## 🚀 Funcionalidades Principais

### 1. Autenticação e Perfis
- Cadastro separado para pacientes e profissionais
- Perfis com dados completos (altura, peso, objetivo, etc)
- Sistema de aprovação via WhatsApp
- Três níveis de acesso: paciente, profissional, admin

### 2. ReabiCheck (Check-in Diário)
- Registro automático de data e hora
- Upload de fotos de comprovação
- Histórico de treinos
- Streak de dias consecutivos
- Calendário de frequência

### 3. Dashboard Unificado
- Preditor de qualidade de vida (0-100)
- Agregação de dados de todas as áreas
- Gráficos de evolução
- Métricas de saúde em tempo real

### 4. Gamificação
- Medalhas por marcos (7, 30, 50, 100, 200, 500 treinos)
- Sistema de XP e níveis
- Ranking entre usuários
- Badges especiais

### 5. Módulos Adicionais (Em Desenvolvimento)
- Evolução Corporal
- Treinos Personalizados
- Nutrição e Hábitos
- Saúde Mental
- Feed Social
- Desafios
- Assistente IA

## 📋 Pré-requisitos

- Node.js 22+
- pnpm 10+
- MySQL 8.0+ ou TiDB
- Git

## 🔧 Instalação Local

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/reabilite-app.git
cd reabilite-app
```

### 2. Instalar Dependências
```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://usuario:senha@localhost:3306/reabilite

# OAuth (Manus)
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# Secrets
JWT_SECRET=sua_chave_secreta_aqui

# Admin
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=Seu Nome

# APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.seu-dominio.com
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

### 4. Configurar Banco de Dados
```bash
pnpm db:push
```

### 5. Executar em Desenvolvimento
```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Estrutura do Projeto

```
reabilite-app/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários
│   │   └── App.tsx        # Roteamento principal
│   └── index.html
├── server/                # Backend Express + tRPC
│   ├── routers/          # Routers tRPC
│   ├── db.ts             # Funções de banco de dados
│   └── routers.ts        # Agregação de routers
├── drizzle/              # Schema e migrações
│   └── schema.ts         # Definição de tabelas
├── shared/               # Código compartilhado
└── package.json
```

## 🗄️ Banco de Dados

### Tabelas Principais
- **users** - Autenticação e roles
- **userProfiles** - Dados de perfil
- **reabiCheckins** - Check-ins diários
- **bodyEvolution** - Evolução corporal
- **workouts** - Registro de treinos
- **dailyHabits** - Hábitos diários
- **userGamification** - Pontos e XP
- **missions** - Missões
- **challenges** - Desafios
- **nutritionRecords** - Nutrição
- **mentalHealthRecords** - Saúde mental
- **socialPosts** - Feed social

## 🔌 API (tRPC)

### Endpoints Disponíveis

#### Usuários
- `users.getProfile` - Obter perfil do usuário
- `users.updateProfile` - Atualizar perfil
- `users.listUsers` - Listar usuários (admin)
- `users.approveUser` - Aprovar usuário (admin)
- `users.getPendingUsers` - Usuários pendentes (admin)

#### ReabiCheck
- `reabiCheck.createCheckin` - Criar check-in
- `reabiCheck.getCheckins` - Obter check-ins
- `reabiCheck.getCurrentStreak` - Sequência atual
- `reabiCheck.getTotalWorkouts` - Total de treinos

#### Dashboard
- `dashboard.getDashboard` - Dados unificados
- `dashboard.getEvolutionChart` - Gráfico de evolução
- `dashboard.getQualityOfLifeScore` - Índice de qualidade de vida

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com coverage
pnpm test -- --coverage
```

## 🚀 Deploy

### Deploy no Manus (Recomendado)
1. Conecte seu repositório GitHub ao Manus
2. Configure as variáveis de ambiente
3. Clique em "Publish"

### Deploy em Produção (Outras Plataformas)

#### Railway
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login e deploy
railway login
railway init
railway up
```

#### Render
1. Conecte seu repositório GitHub
2. Crie um novo Web Service
3. Configure as variáveis de ambiente
4. Deploy automático

#### Vercel (Frontend apenas)
```bash
npm i -g vercel
vercel
```

## 📝 Fluxo de Aprovação via WhatsApp

1. Novo usuário se cadastra
2. Sistema envia mensagem automática para admin via WhatsApp
3. Admin revisa o cadastro
4. Admin aprova ou rejeita no painel admin
5. Usuário recebe confirmação

**Configuração necessária:**
- Integração com WhatsApp Business API
- Número de telefone configurado
- Webhook para receber mensagens

## 🔐 Segurança

- Autenticação OAuth via Manus
- Senhas hasheadas com JWT
- Validação de entrada com Zod
- HTTPS obrigatório em produção
- LGPD compliance
- Backup automático do banco de dados

## 📱 PWA (Progressive Web App)

A aplicação é totalmente funcional como PWA:
- Instalação em Android, iOS e Desktop
- Modo offline
- Notificações push
- Sincronização de dados

Para instalar:
1. Abra a aplicação no navegador
2. Clique no ícone de instalação (endereço ou menu)
3. Confirme a instalação

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 📞 Suporte

Para suporte, envie um email para support@reabilite.com ou abra uma issue no GitHub.

## 🎓 Documentação Adicional

- [Guia de Desenvolvimento](./docs/DEVELOPMENT.md)
- [API Reference](./docs/API.md)
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md)

## 🙏 Agradecimentos

Desenvolvido com ❤️ para transformar a saúde e bem-estar das pessoas.

---

**REABILITE - Transformando consistência em resultados.**
