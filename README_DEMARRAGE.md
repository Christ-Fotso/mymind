# 🚀 Démarrage Rapide - PostgreSQL Docker + Backend/Frontend Local

## ✅ Configuration Actuelle

Votre projet est configuré pour :
- **PostgreSQL** : Dans Docker (conteneur)
- **Backend** : En local (Express)
- **Frontend** : En local (React)

---

## 📝 Étapes de Démarrage

### 1️⃣ Lancer uniquement PostgreSQL

```powershell
docker-compose up -d postgresql
```

**Vérification :**
```powershell
docker ps
```
Vous devriez voir uniquement `taskmanager_postgres` en cours d'exécution.

---

### 2️⃣ Configurer le Backend

**Créer `server/.env` :**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
NODE_ENV=development
PORT=5000
```

**Initialiser Prisma :**
```powershell
cd server
npx prisma generate
npx prisma db push
```

---

### 3️⃣ Démarrer le Backend (Terminal 1)

```powershell
cd server
npm install  # Si pas encore fait
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

---

### 4️⃣ Démarrer le Frontend (Terminal 2)

```powershell
cd client
npm install  # Si pas encore fait
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

---

## ✅ Vérification

1. **Backend → PostgreSQL** : Le backend se connecte automatiquement au démarrage
2. **Frontend → Backend** : Testez l'inscription/connexion sur `http://localhost:5173`

Si tout fonctionne, **c'est bon !** ✅

---

## 🛑 Arrêter PostgreSQL

```powershell
docker-compose down
```

---

## 📚 Documentation Complète

- `QUICK_START.md` : Guide détaillé de démarrage
- `VERIFICATION.md` : Tests de connexion
- `SETUP.md` : Configuration complète

