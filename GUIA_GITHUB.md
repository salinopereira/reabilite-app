# 🚀 GUIA COMPLETO: REABILITE APP NO GITHUB

## 📋 Índice
1. [Preparação Inicial](#preparação-inicial)
2. [Criar Repositório GitHub](#criar-repositório-github)
3. [Configurar Variáveis de Ambiente](#configurar-variáveis-de-ambiente)
4. [Executar Localmente](#executar-localmente)
5. [Deploy em Produção](#deploy-em-produção)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Preparação Inicial

### Pré-requisitos
- **Node.js**: v22 ou superior ([Download](https://nodejs.org))
- **pnpm**: v10 ou superior (`npm install -g pnpm`)
- **Git**: ([Download](https://git-scm.com))
- **MySQL/TiDB**: Banco de dados MySQL 8.0+
- **Conta GitHub**: Para hospedar o repositório

### Verificar Instalações
```bash
node --version      # v22.x.x
pnpm --version      # 10.x.x
git --version       # 2.x.x
```

---

## 📦 Criar Repositório GitHub

### Opção 1: Criar Novo Repositório (Recomendado)

1. **Acesse GitHub**
   - Vá para [github.com/new](https://github.com/new)
   - Faça login com sua conta

2. **Configure o Repositório**
   - **Repository name**: `reabilite-app`
   - **Description**: "Plataforma de Saúde Integrativa - REABILITE"
   - **Visibility**: Public (ou Private, conforme preferência)
   - **Initialize**: Não marque nenhuma opção
   - Clique em **Create repository**

3. **Extrair o ZIP e Inicializar Git**
   ```bash
   # Extrair o arquivo ZIP
   unzip reabilite-app-complete.zip
   cd reabilite-app

   # Inicializar Git
   git init
   git add .
   git commit -m "Initial commit: REABILITE APP v1.0"
   
   # Conectar ao repositório remoto
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/reabilite-app.git
   git push -u origin main
   ```

### Opção 2: Fork de Repositório Existente
```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/reabilite-app.git
cd reabilite-app

# Instalar dependências
pnpm install
```

---

## 🔐 Configurar Variáveis de Ambiente

### 1. Banco de Dados MySQL

#### Opção A: MySQL Local
```bash
# Instalar MySQL (macOS com Homebrew)
brew install mysql
brew services start mysql

# Criar banco de dados
mysql -u root -p
> CREATE DATABASE reabilite;
> CREATE USER 'reabilite'@'localhost' IDENTIFIED BY 'sua_senha_segura';
> GRANT ALL PRIVILEGES ON reabilite.* TO 'reabilite'@'localhost';
> FLUSH PRIVILEGES;
> EXIT;
```

#### Opção B: MySQL Cloud (Recomendado para Produção)
- **PlanetScale**: [planetscale.com](https://planetscale.com) (MySQL compatível)
- **AWS RDS**: [aws.amazon.com/rds](https://aws.amazon.com/rds)
- **DigitalOcean**: [digitalocean.com](https://digitalocean.com)

### 2. Configurar .env.local

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar o arquivo
nano .env.local
```

**Conteúdo do .env.local:**
```env
# ========== DATABASE ==========
DATABASE_URL=mysql://reabilite:sua_senha_segura@localhost:3306/reabilite

# ========== OAUTH (Manus) ==========
# Obter em: https://manus.im/dashboard
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# ========== SECRETS ==========
JWT_SECRET=gere_uma_chave_aleatoria_segura_aqui_min_32_caracteres

# ========== ADMIN ==========
OWNER_OPEN_ID=seu_open_id_do_manus
OWNER_NAME=Seu Nome Completo

# ========== APIS ==========
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api_manus
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend_manus
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# ========== ANALYTICS (Opcional) ==========
VITE_ANALYTICS_ENDPOINT=https://analytics.seu-dominio.com
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

### 3. Gerar Chaves Seguras

```bash
# Gerar JWT_SECRET (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Gerar JWT_SECRET (OpenSSL)
openssl rand -hex 32
```

---

## 🏃 Executar Localmente

### 1. Instalar Dependências
```bash
cd reabilite-app
pnpm install
```

### 2. Configurar Banco de Dados
```bash
# Gerar e executar migrações
pnpm db:push
```

### 3. Iniciar Servidor de Desenvolvimento
```bash
# Terminal 1: Backend + Frontend
pnpm dev

# Ou em terminais separados:
# Terminal 1: Backend
pnpm dev:server

# Terminal 2: Frontend
pnpm dev:client
```

### 4. Acessar a Aplicação
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API tRPC**: http://localhost:3000/api/trpc

### 5. Testar Funcionalidades

#### Criar Usuário de Teste
```bash
# Acessar http://localhost:5173
# Clique em "Entrar / Cadastrar"
# Siga o fluxo de autenticação
```

#### Testar ReabiCheck
```bash
# Após autenticado:
# 1. Vá para /reabicheck
# 2. Clique em "Confirmar Check-in"
# 3. Verifique o histórico
```

#### Testar Dashboard
```bash
# Vá para /dashboard
# Visualize o índice de qualidade de vida
# Veja gráficos de evolução
```

---

## 🚀 Deploy em Produção

### Opção 1: Deploy no Manus (Recomendado)

1. **Conectar Repositório GitHub**
   - Acesse [manus.im](https://manus.im)
   - Vá para Dashboard → New Project
   - Selecione "Connect GitHub Repository"
   - Autorize o acesso ao GitHub
   - Selecione `reabilite-app`

2. **Configurar Variáveis de Ambiente**
   - Vá para Settings → Secrets
   - Adicione todas as variáveis do `.env.local`
   - Clique em Save

3. **Deploy**
   - Clique em "Publish"
   - Aguarde o build e deploy
   - Acesse sua URL pública

### Opção 2: Deploy no Railway

1. **Conectar Repositório**
   ```bash
   npm i -g @railway/cli
   railway login
   cd reabilite-app
   railway init
   ```

2. **Configurar Variáveis**
   ```bash
   railway variables
   # Adicione todas as variáveis
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### Opção 3: Deploy no Render

1. **Criar Conta**: [render.com](https://render.com)

2. **Novo Web Service**
   - Clique em "New +"
   - Selecione "Web Service"
   - Conecte seu repositório GitHub
   - Configure:
     - **Name**: reabilite-app
     - **Runtime**: Node
     - **Build Command**: `pnpm install && pnpm build`
     - **Start Command**: `pnpm start`

3. **Adicionar Variáveis de Ambiente**
   - Vá para Environment
   - Adicione todas as variáveis

4. **Deploy**
   - Clique em "Create Web Service"

### Opção 4: Deploy Manual (VPS/Servidor)

```bash
# 1. SSH no servidor
ssh usuario@seu-servidor.com

# 2. Clonar repositório
git clone https://github.com/SEU_USUARIO/reabilite-app.git
cd reabilite-app

# 3. Instalar dependências
pnpm install

# 4. Criar .env
nano .env.local
# Cole as variáveis de produção

# 5. Build
pnpm build

# 6. Iniciar com PM2 (ou outro gerenciador)
npm install -g pm2
pm2 start "pnpm start" --name reabilite
pm2 save
pm2 startup
```

---

## 🔍 Troubleshooting

### Erro: "DATABASE_URL is not set"
```bash
# Solução: Verificar .env.local
cat .env.local | grep DATABASE_URL

# Se vazio, adicionar:
echo "DATABASE_URL=mysql://..." >> .env.local
```

### Erro: "Cannot find module"
```bash
# Solução: Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Port 3000 already in use"
```bash
# Solução: Usar porta diferente
PORT=3001 pnpm dev

# Ou matar processo
lsof -ti:3000 | xargs kill -9
```

### Erro: "Migration failed"
```bash
# Solução: Resetar banco de dados
pnpm db:push --force

# Ou manualmente:
mysql -u reabilite -p reabilite < drizzle/0001_*.sql
```

### Erro: "OAuth callback failed"
```bash
# Solução: Verificar VITE_APP_ID
echo $VITE_APP_ID

# Se vazio, adicionar ao .env.local:
VITE_APP_ID=seu_app_id_do_manus
```

---

## 📊 Monitoramento em Produção

### Logs
```bash
# Ver logs em tempo real
pm2 logs reabilite

# Ver logs históricos
pm2 logs reabilite --lines 100
```

### Métricas
```bash
# Ver status
pm2 status

# Ver uso de recursos
pm2 monit
```

### Backup
```bash
# Backup do banco de dados
mysqldump -u reabilite -p reabilite > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u reabilite -p reabilite < backup_20240622.sql
```

---

## 📚 Recursos Adicionais

- **Documentação Oficial**: [Manus Docs](https://docs.manus.im)
- **tRPC**: [trpc.io](https://trpc.io)
- **React**: [react.dev](https://react.dev)
- **Drizzle ORM**: [orm.drizzle.team](https://orm.drizzle.team)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

## 🤝 Suporte

- **Issues**: Abra uma issue no GitHub
- **Discussões**: Use Discussions para perguntas
- **Email**: support@reabilite.com

---

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado e migrado
- [ ] Testes locais passando
- [ ] Código commitado no GitHub
- [ ] Repositório público (se necessário)
- [ ] SSL/HTTPS configurado
- [ ] Backup automático ativado
- [ ] Monitoramento configurado
- [ ] Email de suporte funcionando
- [ ] Documentação atualizada

---

**Parabéns! 🎉 Sua instância REABILITE está pronta!**

Para mais informações, consulte o `README_GITHUB.md` incluído no projeto.
