# Script PowerShell pour démarrer l'environnement de développement
# PostgreSQL dans Docker + Backend local + Frontend local

Write-Host "🚀 Démarrage de l'environnement de développement..." -ForegroundColor Green

# Vérifier si Docker est en cours d'exécution
Write-Host "`n📦 Vérification de Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker est en cours d'exécution" -ForegroundColor Green

# Démarrer PostgreSQL
Write-Host "`n🐘 Démarrage de PostgreSQL dans Docker..." -ForegroundColor Yellow
docker-compose up -d postgresql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL démarré avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors du démarrage de PostgreSQL" -ForegroundColor Red
    exit 1
}

# Attendre que PostgreSQL soit prêt
Write-Host "`n⏳ Attente que PostgreSQL soit prêt..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Vérifier la connexion
$maxRetries = 10
$retryCount = 0
$connected = $false

while ($retryCount -lt $maxRetries -and -not $connected) {
    $result = docker exec taskmanager_postgres pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        $connected = $true
        Write-Host "✅ PostgreSQL est prêt" -ForegroundColor Green
    } else {
        $retryCount++
        Write-Host "⏳ Tentative $retryCount/$maxRetries..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $connected) {
    Write-Host "❌ PostgreSQL n'est pas prêt après $maxRetries tentatives" -ForegroundColor Red
    exit 1
}

# Vérifier si le fichier .env existe dans server/
Write-Host "`n📝 Vérification de la configuration..." -ForegroundColor Yellow
if (-not (Test-Path "server\.env")) {
    Write-Host "⚠️  Le fichier server/.env n'existe pas." -ForegroundColor Yellow
    Write-Host "   Créez-le avec la configuration suivante :" -ForegroundColor Yellow
    Write-Host "   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public" -ForegroundColor Cyan
    Write-Host "   JWT_SECRET=your-secret-key" -ForegroundColor Cyan
    Write-Host "   JWT_REFRESH_SECRET=your-refresh-secret-key" -ForegroundColor Cyan
    Write-Host "   NODE_ENV=development" -ForegroundColor Cyan
    Write-Host "   PORT=5000" -ForegroundColor Cyan
} else {
    Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
}

# Initialiser Prisma si nécessaire
Write-Host "`n🔧 Vérification de Prisma..." -ForegroundColor Yellow
Set-Location server
if (Test-Path "node_modules\.prisma") {
    Write-Host "✅ Prisma est déjà généré" -ForegroundColor Green
} else {
    Write-Host "📦 Génération de Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Prisma Client généré" -ForegroundColor Green
    }
}

# Vérifier si la base de données est initialisée
Write-Host "`n🗄️  Vérification de la base de données..." -ForegroundColor Yellow
$dbExists = docker exec taskmanager_postgres psql -U postgres -d taskmanager -c "\dt" 2>&1
if ($LASTEXITCODE -ne 0 -or $dbExists -match "did not find any relations") {
    Write-Host "📦 Initialisation de la base de données..." -ForegroundColor Yellow
    npx prisma db push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données initialisée" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de l'initialisation de la base de données" -ForegroundColor Red
    }
} else {
    Write-Host "✅ Base de données déjà initialisée" -ForegroundColor Green
}

Set-Location ..

# Afficher les instructions
Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ Environnement prêt !" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Démarrer le backend (dans un nouveau terminal) :" -ForegroundColor White
Write-Host "   cd server" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Démarrer le frontend (dans un autre terminal) :" -ForegroundColor White
Write-Host "   cd client" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Accéder à l'application :" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Pour visualiser la base de données :" -ForegroundColor Yellow
Write-Host "   cd server" -ForegroundColor Cyan
Write-Host "   npx prisma studio" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 Pour arrêter PostgreSQL :" -ForegroundColor Yellow
Write-Host "   docker-compose down" -ForegroundColor Cyan
Write-Host ""

