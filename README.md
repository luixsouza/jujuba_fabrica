# Jujuba Fábrica - Deploy com Docker

Este repositório contém os arquivos necessários para rodar a aplicação **Jujuba Fábrica** utilizando Docker e Docker Compose. O projeto é composto por:
- Um banco de dados MySQL
- Um backend desenvolvido em Spring Boot
- Um frontend desenvolvido em Next.js

## **Requisitos**

Antes de iniciar, certifique-se de ter instalado:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## **Como Rodar o Projeto**

1. **Baixe o Docker e Docker Compose** (se ainda não tiver instalado)
2. **Clone este repositório:**
   ```bash
   git clone https://github.com/luixsouza/jujuba_fabrica.git
   cd jujuba_fabrica
   ```
3. **Execute o seguinte comando para iniciar os containers:**
   ```bash
   docker-compose up -d
   ```
   Isso fará o download das imagens do Docker Hub e iniciará os containers em segundo plano.

4. **Verifique se os containers estão rodando:**
   ```bash
   docker ps
   ```
   Você deve ver os containers `jujuba_bd`, `jujuba_backend` e `jujuba_frontend` rodando.

5. **Acesse a aplicação:**
   - Frontend: http://localhost:3000
   - Backend (Swagger UI): [Documentação no Swagger](http://localhost:8080/swagger-ui/index.html#/)
   - Baixe a coleção do Postman para testar o backend: [Download Collection](https://github.com/luixsouza/jujuba_fabrica/blob/main/jujuba_backend/src/main/java/com/jujuba/utils/collections/jujuba_fabrica.postman_collection.json)
   - Imagens no Docker Hub: [Repositório Docker](https://hub.docker.com/repositories/luixsouza)

## **Parando o Projeto**

Caso queira parar os containers, execute:
```bash
docker-compose down
```
Isso irá remover os containers, mas os dados do banco de dados permanecerão salvos.

Se quiser remover também os volumes de dados, execute:
```bash
docker-compose down -v
```