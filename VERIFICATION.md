# ✅ Vérification de la Connexion Backend ↔ Frontend ↔ Database

## 🔍 Checklist de Vérification

### 1. ✅ Docker Compose - PostgreSQL uniquement
Le fichier `docker-compose.yml` est configuré pour lancer **uniquement PostgreSQL**.

**Commande pour lancer :**
```powershell
docker-compose up -d postgresql
```

**Vérification :**
```powershell
docker ps
```
Vous devriez voir uniquement le conteneur `taskmanager_postgres`.

---

### 2. ✅ Backend connecté à PostgreSQL

**Configuration requise :**
- Fichier `server/.env` avec `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public`
- Prisma initialisé : `npx prisma generate && npx prisma db push`

**Vérification :**
1. Démarrer le backend : `cd server && npm run dev`
2. Le serveur démarre sans erreur de connexion à la base de données
3. Tester l'API : `http://localhost:5000` → doit retourner `{"project": "mymind", "status": "online"}`

---

### 3. ✅ Frontend connecté au Backend

**Configuration :**
- Fichier `client/src/services/api.js` pointe vers `http://localhost:5000/api`
- CORS configuré dans `server/index.js` pour accepter `http://localhost:5173`

**Vérification :**
1. Démarrer le frontend : `cd client && npm run dev`
2. Ouvrir `http://localhost:5173`
3. Tester l'inscription/connexion
4. Si ça fonctionne, tout est connecté ! ✅

---

## 🧪 Tests de Connexion

### Test 1 : Backend → PostgreSQL
```powershell
cd server
node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✅ Connexion PostgreSQL OK'); process.exit(0); }).catch(e => { console.error('❌ Erreur:', e.message); process.exit(1); });"
```

### Test 2 : Frontend → Backend
Ouvrez la console du navigateur (F12) et testez :
```javascript
fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log('✅ Backend accessible:', d))
  .catch(e => console.error('❌ Erreur:', e));
```

---

## 📊 Architecture de Connexion

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│                  http://localhost:5173                  │
│                                                         │
│  - client/src/services/api.js                          │
│  - Pointe vers: http://localhost:5000/api              │
└────────────────────┬──────────────────────────────────┘
                     │
                     │ HTTP (avec cookies)
                     │
┌────────────────────▼──────────────────────────────────┐
│                    BACKEND (Express)                   │
│                  http://localhost:5000                 │
│                                                         │
│  - server/index.js                                     │
│  - server/controllers/*.js                             │
│  - Utilise Prisma Client                               │
└────────────────────┬──────────────────────────────────┘
                     │
                     │ Prisma ORM
                     │ DATABASE_URL depuis .env
                     │
┌────────────────────▼──────────────────────────────────┐
│              POSTGRESQL (Docker)                       │
│              localhost:5432                           │
│                                                         │
│  - Conteneur: taskmanager_postgres                     │
│  - Base: taskmanager                                   │
│  - User: postgres / Password: postgres                 │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Tout est Prêt !

Si toutes les vérifications passent, votre application est correctement configurée :

- ✅ PostgreSQL dans Docker
- ✅ Backend en local connecté à PostgreSQL
- ✅ Frontend en local connecté au Backend
- ✅ Authentification avec JWT et cookies
- ✅ Toutes les routes API fonctionnelles

**Vous pouvez maintenant tester l'application complète !** 🎉

