# Fichier : D:\Perso\server\Dockerfile

FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances et le schéma
COPY package.json package-lock.json ./
COPY prisma/schema.prisma ./prisma/

# Installer les dépendances (npm install)
# Si vous avez "prisma generate" en postinstall, il s'exécute ici
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port de l'API
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "run", "start"]