# Babyfoot API - Installation Backend

Ce document explique comment installer et démarrer le backend de l'API Babyfoot sans utiliser Docker, en passant directement par npm.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 14.x ou supérieure recommandée)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)

## Installation du Backend

1. **Cloner le projet si ce n'est pas déjà fait**

```bash
git clone https://github.com/LauerJonathan/technicalTestClm
```

2. **Installer les dépendances**

```bash
cd technicalTest/backend
npm install
```

### Configuration de l'environnement

Utilisation d'un fichier .env :

```bash
DB_HOST=localhost
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=babyfoot_db
DB_PORT=3306
PORT=8080
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```

Note importante: Définir NODE_ENV=development permettra l'initialisation automatique de la base de données et le chargement des données de démonstration au démarrage (seeders).

### Démarrer le Backend

Pour lancer le serveur en mode développement :

```bash
npm run dev
```

Le serveur démarrera en mode développement avec nodemon qui permet le rechargement automatique lors des modifications.

Initialisation Automatique de la Base de Données
En mode développement (NODE_ENV=development), le système :

Crée automatiquement la base de données si elle n'existe pas.
Exécute les migrations pour créer les tables nécessaires.
Charge les données de démonstration via les seeders.

### Accès à l'API

Une fois le serveur démarré, l'API sera accessible à l'adresse :

http://localhost:5001/

- Connexion en tant qu'administrateur :
  Les seeders créent automatiquement un compte administrateur avec les identifiants suivants :

```bash
Copy✉️ Email : admin@babyfoot.com
🔑 Mot de passe : Admin123!
```

Les seeders créent automatiquement :

8 équipes avec des noms créatifs et deux joueurs par équipe
5 tournois à différents stades (brouillon, ouvert, en cours, terminé)
Des inscriptions d'équipes aux tournois
Des matches entre équipes avec résultats
