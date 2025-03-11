# Utiliser une version plus récente de Node
FROM node:18-alpine as build-stage

# Définir le répertoire de travail
WORKDIR /app

# Définir NODE_OPTIONS pour résoudre le problème crypto
ENV NODE_OPTIONS=--experimental-global-webcrypto

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm cache clean --force && npm install --no-cache
RUN npm install

# Copier les fichiers du projet
COPY . .

# Pour le développement, nous exposerons le serveur de développement Vite
EXPOSE 8080

# Commande par défaut pour le développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]