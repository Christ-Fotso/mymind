# 🚀 Guide de Démarrage Rapide

## Configuration : PostgreSQL dans Docker + Backend/Frontend en Local

### 📋 Prérequis
- Docker Desktop installé et démarré
- Node.js installé (v20+)
- npm installé

---

## 🐘 Étape 1 : Démarrer uniquement PostgreSQL

```powershell
# À la racine du projet
docker-compose up -d postgresql
```

Cette commande lance **uniquement** le service PostgreSQL. Le backend et le frontend ne seront pas lancés.

**Vérifier que PostgreSQL est démarré :**
```powershell
docker ps
```

Vous devriez voir le conteneur `taskmanager_postgres` en cours d'exécution.

---

## ⚙️ Étape 2 : Configurer le Backend

### Créer le fichier `.env` dans `server/`

Créez `server/.env` avec le contenu suivant :

```env
# URL de connexion à PostgreSQL (dans Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public

# Secrets JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Environment
NODE_ENV=development
PORT=5000
```

### Initialiser Prisma

```powershell
cd server
npx prisma generate
npx prisma db push
```

Cela va :
- Générer le client Prisma
- Créer les tables dans la base de données PostgreSQL

---

## 🔧 Étape 3 : Démarrer le Backend (local)

Dans un terminal :

```powershell
cd server
npm install
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:5000`

**Vérifier que le backend fonctionne :**
Ouvrez `http://localhost:5000` dans votre navigateur. Vous devriez voir :
```json
{
  "project": "mymind",
  "status": "online",
  "message": "Bienvenue sur l'API de mymind"
}
```

---

## 🎨 Étape 4 : Démarrer le Frontend (local)

Dans un **nouveau terminal** :

```powershell
cd client
npm install
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:5173`

---

## ✅ Vérification de la Connexion

### Test 1 : Backend → PostgreSQL
Le backend devrait se connecter automatiquement à PostgreSQL au démarrage. Vérifiez les logs du serveur, vous ne devriez pas voir d'erreur de connexion.

### Test 2 : Frontend → Backend
1. Ouvrez `http://localhost:5173`
2. Vous devriez voir la page d'accueil
3. Cliquez sur "Créer un compte"
4. Remplissez le formulaire
5. Si l'inscription fonctionne, tout est connecté ! ✅

---

## 🛑 Arrêter PostgreSQL

```powershell
docker-compose down
```

Pour arrêter et supprimer les volumes (⚠️ supprime les données) :
```powershell
docker-compose down -v
```

---

## 🔍 Commandes Utiles

### Voir les logs PostgreSQL
```powershell
docker-compose logs postgresql
```

### Se connecter à PostgreSQL
```powershell
docker exec -it taskmanager_postgres psql -U postgres -d taskmanager
```

### Visualiser la base de données avec Prisma Studio
```powershell
cd server
npx prisma studio
```
Ouvre `http://localhost:5555`

### Redémarrer PostgreSQL
```powershell
docker-compose restart postgresql
```

---

## 🐛 Dépannage

### Erreur : "Cannot connect to database"
1. Vérifiez que Docker Desktop est démarré
2. Vérifiez que PostgreSQL est lancé : `docker ps`
3. Vérifiez la DATABASE_URL dans `server/.env`
4. Vérifiez que le port 5432 n'est pas utilisé par une autre application

### Erreur : "relation does not exist"
Exécutez :
```powershell
cd server
npx prisma db push
```

### Erreur CORS dans le navigateur
Vérifiez que le backend est bien lancé sur le port 5000 et que CORS est configuré pour accepter `http://localhost:5173`

---

## 📝 Résumé de l'Architecture

```
┌─────────────────┐
│   Frontend      │  http://localhost:5173
│   (React)       │  ──────────────────┐
│   Local         │                     │
└─────────────────┘                     │
                                        │ HTTP
                                        ▼
┌─────────────────┐                    │
│   Backend       │  http://localhost:5000
│   (Express)     │  ──────────────────┐
│   Local         │                     │
└─────────────────┘                     │
        │                               │
        │ Prisma                        │
        │                               │
        ▼                               │
┌─────────────────┐                    │
│   PostgreSQL    │  localhost:5432    │
│   (Docker)      │  ──────────────────┘
└─────────────────┘
```

**Tout est prêt !** 🎉

