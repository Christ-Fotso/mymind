# Guide de Test - Backend Local + PostgreSQL Docker

## 🎯 Scénario de test

- **PostgreSQL** : Dans un conteneur Docker
- **Backend (API)** : Exécuté localement (hors conteneur)
- **Frontend (React)** : Exécuté localement

## 📝 Étapes de test

### 1. Démarrer PostgreSQL

```powershell
# À la racine du projet
docker-compose up -d postgresql
```

Vérifier que le conteneur est démarré :
```powershell
docker ps
```

### 2. Configurer l'environnement

Créez `server/.env` :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public
JWT_SECRET=test-secret-key
JWT_REFRESH_SECRET=test-refresh-secret-key
NODE_ENV=development
PORT=5000
```

### 3. Initialiser la base de données

```powershell
cd server
npx prisma generate
npx prisma db push
```

### 4. Démarrer le backend

```powershell
cd server
npm run dev
```

Le serveur devrait répondre sur `http://localhost:5000`

### 5. Démarrer le frontend

Dans un nouveau terminal :
```powershell
cd client
npm run dev
```

Le frontend devrait être accessible sur `http://localhost:5173`

## ✅ Tests à effectuer

### Test 1 : Inscription
1. Aller sur `http://localhost:5173/register`
2. Remplir le formulaire :
   - Prénom : Test
   - Nom : User
   - Email : test@example.com
   - Mot de passe : test123
   - Confirmer : test123
3. Cliquer sur "S'inscrire"
4. **Résultat attendu** : Redirection vers `/dashboard`

### Test 2 : Connexion
1. Se déconnecter
2. Aller sur `http://localhost:5173/login`
3. Se connecter avec les identifiants créés
4. **Résultat attendu** : Connexion réussie, redirection vers `/dashboard`

### Test 3 : Créer une entreprise
1. Aller dans "Entreprises"
2. Cliquer sur "Nouvelle entreprise"
3. Remplir :
   - Nom : Test Enterprise
   - Adresse : 123 Test Street
4. Cliquer sur "Confirmer"
5. **Résultat attendu** : L'entreprise apparaît dans la liste

### Test 4 : Créer un projet
1. Aller dans "Projets"
2. Cliquer sur "Nouveau projet"
3. Remplir :
   - Nom : Test Project
   - Description : Projet de test
4. Cliquer sur "Confirmer"
5. **Résultat attendu** : Le projet apparaît dans la liste

### Test 5 : Créer une tâche
1. Aller dans "Tâches"
2. Sélectionner un projet dans le menu déroulant
3. Cliquer sur "Nouvelle tâche"
4. Remplir :
   - Titre : Test Task
   - Description : Tâche de test
   - Date d'échéance : (optionnel)
5. Cliquer sur "Confirmer"
6. **Résultat attendu** : La tâche apparaît dans la liste

### Test 6 : Vérifier les données dans PostgreSQL

```powershell
docker exec -it taskmanager_postgres psql -U postgres -d taskmanager
```

Puis dans psql :
```sql
SELECT * FROM "User";
SELECT * FROM "Enterprise";
SELECT * FROM "Project";
SELECT * FROM "Task";
```

## 🔍 Vérifications

### Vérifier les logs du conteneur PostgreSQL
```powershell
docker-compose logs postgresql
```

### Vérifier les logs du backend
Les logs s'affichent dans le terminal où vous avez lancé `npm run dev`

### Vérifier la connexion avec Prisma Studio
```powershell
cd server
npx prisma studio
```
Ouvre `http://localhost:5555` pour visualiser la base de données

## 🐛 Problèmes courants

### Le backend ne peut pas se connecter à PostgreSQL
- Vérifiez que le conteneur est bien démarré : `docker ps`
- Vérifiez la DATABASE_URL dans `server/.env`
- Vérifiez que le port 5432 n'est pas bloqué par un firewall

### Erreur "relation does not exist"
- Exécutez `npx prisma db push` dans le dossier `server/`

### Les cookies ne fonctionnent pas
- Vérifiez que CORS est bien configuré avec `credentials: true`
- Vérifiez que le frontend fait les requêtes avec `credentials: 'include'`

### Erreur JWT
- Vérifiez que JWT_SECRET et JWT_REFRESH_SECRET sont définis dans `server/.env`

