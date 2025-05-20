# Use imagem oficial Node.js slim
FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o código fonte para o container
COPY . .

# Expõe porta 3000 (Next.js)
EXPOSE 3000

# Define variável de ambiente (caso queira passar direto no Dockerfile)
ENV NEXT_PUBLIC_API_URL=http://backend:8080/

# Comando para iniciar o Next.js em modo dev
CMD ["npm", "run", "dev"]