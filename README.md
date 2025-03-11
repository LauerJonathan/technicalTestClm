# Babyfoot API

Ce projet est une API dédiée à la gestion des équipes de babyfoot, des tournois et des matchs.

### 1. Installation avec Docker

Clonez le projet :

```bash
git clone https://github.com/LauerJonathan/technicalTest
```

Démarrez l'application avec Docker : Exécutez cette commande pour démarrer les services.

```bash
docker-compose up --build
```

L'application sera accessible sur http://localhost:8080.

### 2. Connexion en tant qu'administrateur

Pour vous connecter à l'interface administrateur, utilisez les identifiants suivants :

```bash
✉️ Email : admin@babyfoot.com
🔑 Mot de passe : Admin123!
```

### Seeder ?

Les seeders sont des scripts qui permettent de précharger la base de données avec des données de test ou de démonstration. Cela facilite le développement et les tests en fournissant un jeu de données réaliste sans avoir à les entrer manuellement.
En phase de test, tournois, matchs, équipes, ... sont générés au démarrage de Docker.
