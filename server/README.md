# Documentation API - Gestion de Tournois de Baby-Foot

Cette documentation détaille les endpoints disponibles pour l'API de gestion de tournois de baby-foot.

## Base URL

```
http://localhost:5000/api
```

## Authentification

L'API utilise l'authentification par JWT (JSON Web Token). Pour les routes protégées, vous devez inclure le token dans l'en-tête de vos requêtes :

```
Authorization: Bearer <your_jwt_token>
```

## Administrateurs

### Inscription d'un administrateur

- **URL** : `/admin/register`
- **Méthode** : `POST`
- **Authentification** : Non requise
- **Corps de la requête** :
  ```json
  {
    "username": "admin",
    "email": "admin@example.com",
    "password": "Password123!"
  }
  ```
- **Réponse réussie** : `201 Created`
  ```json
  {
    "success": true,
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Connexion d'un administrateur

- **URL** : `/admin/login`
- **Méthode** : `POST`
- **Authentification** : Non requise
- **Corps de la requête** :
  ```json
  {
    "email": "admin@example.com",
    "password": "Password123!"
  }
  ```
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Profil d'administrateur

- **URL** : `/admin/profile`
- **Méthode** : `GET`
- **Authentification** : Requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "createdAt": "2025-03-07T12:34:56.789Z",
      "updatedAt": "2025-03-07T12:34:56.789Z"
    }
  }
  ```

## Tournois

### Créer un tournoi

- **URL** : `/tournaments`
- **Méthode** : `POST`
- **Authentification** : Requise
- **Corps de la requête** :
  ```json
  {
    "name": "Tournoi de Printemps 2025",
    "date": "2025-04-15T14:00:00.000Z",
    "description": "Premier tournoi officiel de la saison 2025"
  }
  ```
- **Réponse réussie** : `201 Created`
  ```json
  {
    "success": true,
    "tournament": {
      "id": 1,
      "name": "Tournoi de Printemps 2025",
      "date": "2025-04-15T14:00:00.000Z",
      "description": "Premier tournoi officiel de la saison 2025",
      "status": "draft",
      "createdById": 1,
      "updatedAt": "2025-03-07T13:45:22.123Z",
      "createdAt": "2025-03-07T13:45:22.123Z"
    }
  }
  ```

### Récupérer tous les tournois

- **URL** : `/tournaments`
- **Méthode** : `GET`
- **Authentification** : Non requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "tournaments": [
      {
        "id": 1,
        "name": "Tournoi de Printemps 2025",
        "date": "2025-04-15T14:00:00.000Z",
        "description": "Premier tournoi officiel de la saison 2025",
        "status": "draft",
        "createdById": 1,
        "createdAt": "2025-03-07T13:45:22.123Z",
        "updatedAt": "2025-03-07T13:45:22.123Z"
      }
    ]
  }
  ```

### Récupérer un tournoi spécifique

- **URL** : `/tournaments/:id`
- **Méthode** : `GET`
- **Authentification** : Non requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "tournament": {
      "id": 1,
      "name": "Tournoi de Printemps 2025",
      "date": "2025-04-15T14:00:00.000Z",
      "description": "Premier tournoi officiel de la saison 2025",
      "status": "draft",
      "createdById": 1,
      "createdAt": "2025-03-07T13:45:22.123Z",
      "updatedAt": "2025-03-07T13:45:22.123Z",
      "Teams": []
    }
  }
  ```

### Mettre à jour un tournoi

- **URL** : `/tournaments/:id`
- **Méthode** : `PUT`
- **Authentification** : Requise
- **Corps de la requête** :
  ```json
  {
    "name": "Tournoi de Printemps 2025 - Edition Spéciale",
    "date": "2025-04-16T15:00:00.000Z",
    "description": "Edition spéciale du premier tournoi de la saison",
    "status": "open"
  }
  ```
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "tournament": {
      "id": 1,
      "name": "Tournoi de Printemps 2025 - Edition Spéciale",
      "date": "2025-04-16T15:00:00.000Z",
      "description": "Edition spéciale du premier tournoi de la saison",
      "status": "open",
      "createdById": 1,
      "createdAt": "2025-03-07T13:45:22.123Z",
      "updatedAt": "2025-03-07T14:12:33.456Z"
    }
  }
  ```

### Supprimer un tournoi

- **URL** : `/tournaments/:id`
- **Méthode** : `DELETE`
- **Authentification** : Requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "message": "Tournoi supprimé avec succès"
  }
  ```

### Générer les matchs d'un tournoi

- **URL** : `/tournaments/:id/generate-matches`
- **Méthode** : `POST`
- **Authentification** : Requise
- **Réponse réussie** : `201 Created`
  ```json
  {
    "success": true,
    "message": "1 matchs générés avec succès",
    "matchesCount": 1
  }
  ```

## Équipes

### Créer une équipe

- **URL** : `/teams`
- **Méthode** : `POST`
- **Authentification** : Requise
- **Corps de la requête** :
  ```json
  {
    "name": "Les Invincibles",
    "player1Name": "Thomas Dupont",
    "player2Name": "Marie Martin"
  }
  ```
- **Réponse réussie** : `201 Created`
  ```json
  {
    "success": true,
    "team": {
      "id": 1,
      "name": "Les Invincibles",
      "player1Name": "Thomas Dupont",
      "player2Name": "Marie Martin",
      "updatedAt": "2025-03-07T14:22:45.789Z",
      "createdAt": "2025-03-07T14:22:45.789Z"
    }
  }
  ```

### Récupérer toutes les équipes

- **URL** : `/teams`
- **Méthode** : `GET`
- **Authentification** : Non requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "teams": [
      {
        "id": 1,
        "name": "Les Invincibles",
        "player1Name": "Thomas Dupont",
        "player2Name": "Marie Martin",
        "createdAt": "2025-03-07T14:22:45.789Z",
        "updatedAt": "2025-03-07T14:22:45.789Z"
      }
    ]
  }
  ```

### Inscrire une équipe à un tournoi

- **URL** : `/teams/register`
- **Méthode** : `POST`
- **Authentification** : Requise
- **Corps de la requête** :
  ```json
  {
    "tournamentId": 1,
    "teamId": 1
  }
  ```
- **Réponse réussie** : `201 Created`
  ```json
  {
    "success": true,
    "message": "Équipe ajoutée au tournoi avec succès"
  }
  ```

### Retirer une équipe d'un tournoi

- **URL** : `/teams/:teamId/tournaments/:tournamentId`
- **Méthode** : `DELETE`
- **Authentification** : Requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "message": "Équipe retirée du tournoi avec succès"
  }
  ```

## Matchs

### Récupérer les matchs d'un tournoi

- **URL** : `/matches/tournaments/:tournamentId`
- **Méthode** : `GET`
- **Authentification** : Non requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "matches": [
      {
        "id": 1,
        "tournamentId": 1,
        "homeTeamId": 1,
        "awayTeamId": 2,
        "homeScore": null,
        "awayScore": null,
        "status": "scheduled",
        "scheduledDate": null,
        "playedDate": null,
        "createdAt": "2025-03-07T14:52:33.123Z",
        "updatedAt": "2025-03-07T14:52:33.123Z",
        "homeTeam": {
          "id": 1,
          "name": "Les Invincibles",
          "player1Name": "Thomas Dupont",
          "player2Name": "Marie Martin",
          "createdAt": "2025-03-07T14:22:45.789Z",
          "updatedAt": "2025-03-07T14:22:45.789Z"
        },
        "awayTeam": {
          "id": 2,
          "name": "Foosballs",
          "player1Name": "Pierre Lambert",
          "player2Name": "Julie Dubois",
          "createdAt": "2025-03-07T14:25:10.456Z",
          "updatedAt": "2025-03-07T14:25:10.456Z"
        }
      }
    ]
  }
  ```

### Mettre à jour le score d'un match

- **URL** : `/matches/:id/score`
- **Méthode** : `PUT`
- **Authentification** : Requise
- **Corps de la requête** :
  ```json
  {
    "homeScore": 10,
    "awayScore": 8
  }
  ```
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "message": "Score mis à jour avec succès"
  }
  ```

### Récupérer le classement d'un tournoi

- **URL** : `/matches/tournaments/:tournamentId/standings`
- **Méthode** : `GET`
- **Authentification** : Non requise
- **Réponse réussie** : `200 OK`
  ```json
  {
    "success": true,
    "standings": [
      {
        "id": 1,
        "tournamentId": 1,
        "teamId": 1,
        "points": 3,
        "matchesPlayed": 1,
        "matchesWon": 1,
        "matchesDraw": 0,
        "matchesLost": 0,
        "goalsFor": 10,
        "goalsAgainst": 8,
        "createdAt": "2025-03-07T14:35:22.789Z",
        "updatedAt": "2025-03-07T15:05:44.123Z",
        "Team": {
          "id": 1,
          "name": "Les Invincibles",
          "player1Name": "Thomas Dupont",
          "player2Name": "Marie Martin",
          "createdAt": "2025-03-07T14:22:45.789Z",
          "updatedAt": "2025-03-07T14:22:45.789Z"
        }
      },
      {
        "id": 2,
        "tournamentId": 1,
        "teamId": 2,
        "points": 0,
        "matchesPlayed": 1,
        "matchesWon": 0,
        "matchesDraw": 0,
        "matchesLost": 1,
        "goalsFor": 8,
        "goalsAgainst": 10,
        "createdAt": "2025-03-07T14:35:30.456Z",
        "updatedAt": "2025-03-07T15:05:44.123Z",
        "Team": {
          "id": 2,
          "name": "Foosballs",
          "player1Name": "Pierre Lambert",
          "player2Name": "Julie Dubois",
          "createdAt": "2025-03-07T14:25:10.456Z",
          "updatedAt": "2025-03-07T14:25:10.456Z"
        }
      }
    ]
  }
  ```

## Gestion des erreurs

L'API retourne des messages d'erreur standardisés :

- `400 Bad Request` : Requête invalide ou données manquantes
- `401 Unauthorized` : Authentification requise ou token invalide
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur

Exemple de réponse d'erreur :

```json
{
  "success": false,
  "message": "Message explicatif de l'erreur",
  "error": "Détails techniques de l'erreur (uniquement en développement)"
}
```

## Configuration Docker

L'API est dockerisée pour faciliter le déploiement. Pour démarrer l'application avec Docker :

```bash
docker compose up
```

La base de données MySQL et l'API seront automatiquement configurées et lancées.

### Variables d'environnement

Voici les variables d'environnement configurées dans Docker :

- `PORT=5000` : Port sur lequel l'API écoute
- `DB_HOST=db` : Hôte de la base de données (service MySQL dans Docker)
- `DB_USER=root` : Utilisateur de la base de données
- `DB_PASSWORD=root_password` : Mot de passe de la base de données
- `DB_NAME=babyfoot_tournament` : Nom de la base de données
- `JWT_SECRET=...` : Secret utilisé pour signer les tokens JWT

## Administrateur par défaut

Un administrateur par défaut est créé automatiquement au démarrage de l'application si aucun administrateur n'existe :

- Email : `admin@babyfoot.com`
- Mot de passe : `Admin123!`
