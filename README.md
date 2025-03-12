# Babyfoot API

Ce projet est une API dédiée à la gestion des équipes de babyfoot, des tournois et des matchs.

## Prérequis : Installation de Docker et Docker Compose

Avant de pouvoir utiliser l'application avec Docker, veuillez vous assurer que Docker et Docker Compose sont installés sur votre machine.

1. Installer Docker
   Pour installer Docker, veuillez suivre les instructions selon votre système d'exploitation :

Sur Windows : Télécharger Docker Desktop pour Windows
Sur macOS : Télécharger Docker Desktop pour macOS
Sur Linux : Suivez le guide d'installation pour votre distribution, disponible sur Docker Docs pour Linux
Une fois Docker installé, vous pouvez vérifier l'installation en exécutant :

```bash
docker --version
```

Cela devrait vous retourner la version de Docker installée.

2. Installer Docker Compose
   Docker Compose est un outil utilisé pour définir et exécuter des applications multi-conteneurs Docker. Si vous utilisez Docker Desktop, Docker Compose est déjà inclus. Sinon, voici comment l'installer manuellement :

Sur Windows/macOS : Docker Compose est inclus avec Docker Desktop.
Sur Linux : Vous pouvez installer Docker Compose en suivant ces instructions :

```bash
# Télécharger la dernière version stable de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Appliquer les permissions d'exécution
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier l'installation
docker-compose --version
```

Cela vous permettra de vérifier si Docker Compose est installé correctement.

### Installation avec Docker

Clonez le projet :

```bash
git clone https://github.com/LauerJonathan/technicalTestClm
```

Démarrez l'application avec Docker : Exécutez cette commande pour démarrer les services.

```bash
docker-compose up --build
```

L'application sera accessible sur http://localhost:8080.

### Connexion en tant qu'administrateur

Pour vous connecter à l'interface administrateur, utilisez les identifiants suivants :

```
✉️ Email : admin@babyfoot.com
🔑 Mot de passe : Admin123!
```

## Système de Seeding (Données de Démonstration)

### Qu'est-ce que les Seeders ?

Les seeders sont des scripts qui permettent de précharger la base de données avec des données de test ou de démonstration. Cela facilite le développement et les tests en fournissant un jeu de données réaliste sans avoir à les entrer manuellement.

### Fonctionnement des Seeders dans ce Projet

Le projet utilise plusieurs seeders pour initialiser différents types de données :

1. **Admin Seeder** : Crée un compte administrateur par défaut
2. **Team Seeder** : Génère 8 équipes avec des noms et joueurs fictifs
3. **Tournament Seeder** : Crée 5 tournois à différents stades (draft, open, in_progress, completed)
4. **TournamentTeam Seeder** : Inscrit des équipes aux tournois avec des statistiques
5. **Match Seeder** : Génère des matches entre équipes avec des résultats

### Comment sont exécutés les Seeders

Les seeders sont exécutés automatiquement au démarrage de l'application lorsque l'environnement est configuré en mode "demo". Dans Docker, cela est configuré via la variable d'environnement `NODE_ENV=development`.

### Structure des Données de Démonstration

#### Équipes (8)

- Noms d'équipes créatifs avec deux joueurs par équipe
- Exemples : "Les Invincibles", "Rocket Power", "Goal Diggers", etc.

#### Tournois (5)

- Différents statuts pour simuler un flux réel : brouillon, ouvert, en cours, terminé
- Dates échelonnées (passé, présent, futur)
- Descriptions personnalisées

#### Inscriptions aux Tournois

- Chaque tournoi contient entre 4 et 8 équipes
- Les statistiques (points, matchs joués, buts) sont générées automatiquement selon l'état du tournoi

#### Matches

- Générés entre équipes inscrites aux mêmes tournois
- Résultats remplis pour les tournois terminés ou en cours
- Dates programmées cohérentes avec les dates des tournois

### Avantages de cette Approche

1. **Environnement prêt à l'emploi** : Démonstration fonctionnelle dès le démarrage
2. **Données cohérentes** : Relations correctement établies entre toutes les entités
3. **Test facilité** : Possibilité de tester toutes les fonctionnalités avec des données réalistes
4. **Séparation des environnements** : N'affecte pas les données réelles en production

### Personnalisation des Seeds

Vous pouvez modifier les fichiers de seeding dans le dossier `/seeders` pour ajuster les données générées selon vos besoins.
