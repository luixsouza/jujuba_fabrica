# Guia de Deploy - Jujuba Fabrica

## Requisitos da VM

- **Sistema Operacional**: Ubuntu 22.04 LTS (recomendado) ou qualquer Linux com Docker
- **RAM**: Minimo 2GB (recomendado 4GB)
- **CPU**: 2 cores minimo
- **Disco**: 20GB minimo
- **Portas**: 80, 443 (producao), 3000, 8080 (desenvolvimento)

## Instalacao Rapida

### 1. Instalar Docker e Docker Compose

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sudo sh

# Adicionar usuario ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Verificar instalacao
docker --version
docker compose version

# Fazer logout e login novamente para aplicar permissoes
```

### 2. Clonar o Repositorio

```bash
cd /opt
sudo git clone https://github.com/luixsouza/jujuba_fabrica.git
sudo chown -R $USER:$USER jujuba_fabrica
cd jujuba_fabrica
```

### 3. Configurar Variaveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configuracoes
nano .env
```

**IMPORTANTE**: Configure os seguintes valores no arquivo `.env`:

```env
# Gerar senha segura para MySQL
MYSQL_ROOT_PASSWORD=SenhaSegura123!
MYSQL_PASSWORD=SenhaSegura456!

# Gerar JWT secret (OBRIGATORIO - use comando abaixo)
# openssl rand -base64 32
JWT_SECRET=SuaChaveJWTSuperSecretaComPeloMenos32Caracteres

# URL do frontend (ajustar para IP/dominio da VM)
CORS_ALLOWED_ORIGINS=http://SEU_IP_OU_DOMINIO:3000
NEXT_PUBLIC_API_URL=http://SEU_IP_OU_DOMINIO:8080
```

### 4. Iniciar os Servicos

```bash
# Build e start (primeira vez)
docker compose up -d --build

# Verificar status
docker compose ps

# Ver logs
docker compose logs -f
```

### 5. Acessar o Sistema

- **Frontend**: http://SEU_IP:3000
- **API**: http://SEU_IP:8080
- **Swagger** (se habilitado): http://SEU_IP:8080/docs-jujuba.html

---

## Comandos Uteis

```bash
# Parar todos os servicos
docker compose down

# Reiniciar servicos
docker compose restart

# Ver logs de um servico especifico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql

# Acessar shell do container
docker compose exec backend sh
docker compose exec mysql mysql -u root -p

# Rebuild apos alteracoes
docker compose up -d --build

# Limpar tudo (CUIDADO: apaga dados)
docker compose down -v --rmi all
```

---

## Deploy em Producao (com HTTPS)

### 1. Configurar Dominio

Aponte seu dominio para o IP da VM no DNS.

### 2. Instalar Certbot (Let's Encrypt)

```bash
sudo apt install certbot -y

# Gerar certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Copiar certificados para nginx
sudo mkdir -p /opt/jujuba_fabrica/nginx/ssl
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem /opt/jujuba_fabrica/nginx/ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem /opt/jujuba_fabrica/nginx/ssl/
```

### 3. Atualizar Configuracoes

Edite o `.env`:
```env
CORS_ALLOWED_ORIGINS=https://seu-dominio.com
NEXT_PUBLIC_API_URL=https://seu-dominio.com/api
SWAGGER_ENABLED=false
```

### 4. Descomentar HTTPS no nginx.conf

Edite `nginx/nginx.conf` e descomente o bloco HTTPS.

### 5. Iniciar com Nginx

```bash
docker compose --profile production up -d --build
```

---

## Backup do Banco de Dados

```bash
# Criar backup
docker compose exec mysql mysqldump -u root -p jujuba_brecho > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker compose exec -T mysql mysql -u root -p jujuba_brecho < backup_20240101.sql
```

---

## Atualizacoes

```bash
# Baixar atualizacoes
git pull origin main

# Rebuild e restart
docker compose up -d --build

# Se houver mudancas no banco (migrations)
# O JPA_DDL_AUTO=update fara as alteracoes automaticamente
```

---

## Troubleshooting

### Container nao inicia
```bash
# Ver logs detalhados
docker compose logs backend
docker compose logs mysql
```

### Erro de conexao com banco
```bash
# Verificar se MySQL esta rodando
docker compose ps mysql

# Testar conexao
docker compose exec mysql mysql -u jujuba_user -p -e "SELECT 1"
```

### Frontend nao conecta na API
```bash
# Verificar CORS_ALLOWED_ORIGINS no .env
# Verificar NEXT_PUBLIC_API_URL no .env
# Rebuild do frontend apos mudancas
docker compose up -d --build frontend
```

### Limpar cache do Docker
```bash
docker system prune -a
```

---

## Suporte

Em caso de problemas, verifique:
1. Logs dos containers: `docker compose logs`
2. Status dos servicos: `docker compose ps`
3. Configuracoes do `.env`
4. Firewall da VM (portas 80, 443, 3000, 8080)
