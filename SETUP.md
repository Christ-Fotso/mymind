# Guide de Configuration - Backend Local avec PostgreSQL en Docker

Ce guide explique comment configurer l'application pour utiliser PostgreSQL dans un conteneur Docker tout en exécutant le backend en local.

## 📋 Prérequis

- Docker et Docker Compose installés
- Node.js installé (v20+)
- npm installé

## 🚀 Configuration

### 1. Créer le fichier `.env` à la racine du projet

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Configuration PostgreSQL (pour docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskmanager

# URL de connexion à la base de données
# Pour se connecter au conteneur depuis le backend local, utilisez localhost:5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public

# JWT Secrets (changez ces valeurs en production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Environment
NODE_ENV=development

# Server Port
PORT=5000
```

### 2. Créer le fichier `.env` dans le dossier `server`

Créez également un fichier `.env` dans le dossier `server/` avec :

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
NODE_ENV=development
PORT=5000
```

### 3. Démarrer PostgreSQL avec Docker

Dans le terminal, à la racine du projet :

```powershell
docker-compose up -d postgresql
```

Cette commande :
- Lance uniquement le service PostgreSQL
- Expose le port 5432 sur localhost
- Crée un volume persistant pour les données

### 4. Vérifier que PostgreSQL est démarré

```powershell
docker ps
```

Vous devriez voir le conteneur `taskmanager_postgres` en cours d'exécution.

### 5. Initialiser Prisma

Dans le dossier `server/` :

```powershell
cd server
npx prisma generate
npx prisma db push
```

Ou si vous préférez utiliser les migrations :

```powershell
npx prisma migrate dev --name init
```

### 6. Installer les dépendances du serveur

```powershell
cd server
npm install
```

### 7. Démarrer le serveur backend (local)

```powershell
cd server
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:5000`

### 8. Démarrer le client React

Dans un autre terminal :

```powershell
cd client
npm install
npm run dev
```

Le client devrait démarrer sur `http://localhost:5173`

## 🧪 Tester la connexion

### Vérifier la connexion à la base de données

Vous pouvez tester la connexion avec Prisma Studio :

```powershell
cd server
npx prisma studio
```

Cela ouvrira une interface web sur `http://localhost:5555` pour visualiser et gérer la base de données.

### Tester l'API

1. Créez un compte via l'interface web (`http://localhost:5173/register`)
2. Connectez-vous avec vos identifiants
3. Vérifiez que les données sont bien sauvegardées dans PostgreSQL

## 🛠️ Commandes utiles

### Arrêter PostgreSQL
```powershell
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime les données)
```powershell
docker-compose down -v
```

### Voir les logs PostgreSQL
```powershell
docker-compose logs postgresql
```

### Se connecter à PostgreSQL avec psql
```powershell
docker exec -it taskmanager_postgres psql -U postgres -d taskmanager
```

### Redémarrer PostgreSQL
```powershell
docker-compose restart postgresql
```

## 📝 Notes importantes

- Le backend local se connecte à PostgreSQL via `localhost:5432`
- Les données PostgreSQL sont persistantes grâce au volume Docker
- Si vous changez le port PostgreSQL dans docker-compose.yml, mettez à jour la DATABASE_URL
- Les secrets JWT doivent être changés en production
- Le fichier `.env` ne doit jamais être commité dans Git (ajoutez-le au `.gitignore`)

## 🔧 Dépannage

### Erreur de connexion à la base de données

1. Vérifiez que le conteneur PostgreSQL est bien démarré : `docker ps`
2. Vérifiez que le port 5432 n'est pas utilisé par une autre application
3. Vérifiez les variables d'environnement dans le fichier `.env`

### Erreur "relation does not exist"

Exécutez les migrations Prisma :
```powershell
cd server
npx prisma db push
```

### Réinitialiser complètement la base de données

```powershell
docker-compose down -v
docker-compose up -d postgresql
cd server
npx prisma db push
```

