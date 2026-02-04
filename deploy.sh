#!/bin/bash

# Jujuba Fabrica - Script de Deploy
# Uso: ./deploy.sh [comando]
# Comandos: install, start, stop, restart, logs, backup, update

set -e

COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Arquivo .env nao encontrado!"
        print_status "Criando .env a partir do exemplo..."
        cp .env.example .env
        print_warning "Por favor, edite o arquivo .env com suas configuracoes antes de continuar."
        exit 1
    fi
}

install() {
    print_status "Iniciando instalacao do Jujuba Fabrica..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker nao instalado. Instale o Docker primeiro."
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose nao instalado."
        exit 1
    fi
    
    check_env
    
    print_status "Construindo e iniciando containers..."
    docker compose up -d --build
    
    print_status "Aguardando servicos iniciarem..."
    sleep 30
    
    print_status "Verificando status dos servicos..."
    docker compose ps
    
    print_status "Instalacao concluida!"
    echo ""
    echo "Acesse:"
    echo "  Frontend: http://localhost:3000"
    echo "  API: http://localhost:8080"
}

start() {
    check_env
    print_status "Iniciando servicos..."
    docker compose up -d
    docker compose ps
}

stop() {
    print_status "Parando servicos..."
    docker compose down
}

restart() {
    print_status "Reiniciando servicos..."
    docker compose restart
    docker compose ps
}

logs() {
    SERVICE=${2:-""}
    if [ -z "$SERVICE" ]; then
        docker compose logs -f
    else
        docker compose logs -f $SERVICE
    fi
}

backup() {
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    print_status "Criando backup do banco de dados..."
    docker compose exec -T mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} jujuba_brecho > $BACKUP_FILE
    print_status "Backup salvo em: $BACKUP_FILE"
}

update() {
    print_status "Atualizando sistema..."
    git pull origin main
    print_status "Reconstruindo containers..."
    docker compose up -d --build
    print_status "Atualizacao concluida!"
}

status() {
    print_status "Status dos servicos:"
    docker compose ps
    echo ""
    print_status "Uso de recursos:"
    docker stats --no-stream
}

# Menu principal
case "$1" in
    install)
        install
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs $@
        ;;
    backup)
        backup
        ;;
    update)
        update
        ;;
    status)
        status
        ;;
    *)
        echo "Jujuba Fabrica - Script de Deploy"
        echo ""
        echo "Uso: $0 {install|start|stop|restart|logs|backup|update|status}"
        echo ""
        echo "Comandos:"
        echo "  install  - Instala e inicia o sistema"
        echo "  start    - Inicia os servicos"
        echo "  stop     - Para os servicos"
        echo "  restart  - Reinicia os servicos"
        echo "  logs     - Mostra logs (opcional: logs [servico])"
        echo "  backup   - Cria backup do banco de dados"
        echo "  update   - Atualiza o sistema"
        echo "  status   - Mostra status dos servicos"
        exit 1
        ;;
esac
