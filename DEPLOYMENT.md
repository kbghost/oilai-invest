# 🚀 Guide de Déploiement — OilAI Invest
## Vercel (Frontend) + Render (Backend) + MongoDB Atlas

---

## 1. MongoDB Atlas (Base de données)

### Création du cluster
1. Aller sur https://cloud.mongodb.com → **Create a free cluster** (M0 Free)
2. Choisir une région proche (ex: Europe West)
3. Créer un utilisateur DB : **Database Access** → Add New User
   - Username : `oilai_admin`
   - Password : générer un mot de passe fort, **le noter**
4. Autoriser les connexions : **Network Access** → Add IP Address → `0.0.0.0/0` (Allow from anywhere)
5. Récupérer la connexion : **Clusters** → Connect → **Connect your application**
   - Copier l'URI : `mongodb+srv://oilai_admin:<password>@cluster0.xxxxx.mongodb.net/`
   - Remplacer `<password>` par votre mot de passe
   - Ajouter le nom de la DB : `mongodb+srv://oilai_admin:<password>@cluster0.xxxxx.mongodb.net/oilai_invest`

---

## 2. Render (Backend Node.js)

### Déploiement
1. Pousser le dossier `backend/` sur GitHub dans un repo
2. Aller sur https://render.com → **New** → **Web Service**
3. Connecter votre repo GitHub
4. Configurer :
   - **Name** : `oilai-invest-api`
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free (pour commencer)

### Variables d'environnement sur Render
Aller dans **Environment** et ajouter :

```
MONGODB_URI=mongodb+srv://oilai_admin:<password>@cluster0.xxxxx.mongodb.net/oilai_invest
JWT_SECRET=une_chaine_tres_longue_et_aleatoire_minimum_32_caracteres
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=https://oilai-invest.online
NODE_ENV=production
```

> ⚠️ **IMPORTANT** : Notez l'URL de votre API Render après déploiement.
> Format : `https://oilai-invest-api.onrender.com`

### Seeder les données initiales
Après déploiement, dans le Shell Render ou en local :
```bash
MONGODB_URI="votre_uri_atlas" node scripts/seed.js
```
Comptes créés :
- Admin : `admin@oilai.com` / `Admin@1234`
- Demo  : `demo@oilai.com` / `Demo@1234`

---

## 3. Vercel (Frontend React)

### Déploiement
1. Pousser le dossier `frontend/` sur GitHub
2. Aller sur https://vercel.com → **New Project** → Importer le repo
3. Configurer :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### Variable d'environnement sur Vercel
Aller dans **Settings** → **Environment Variables** :

```
VITE_API_URL=https://oilai-invest-api.onrender.com/api
```

### Modifier l'URL de l'API dans le frontend
Ouvrir `frontend/src/services/api.js` et vérifier :
```javascript
// ← MODIFIER ICI si l'URL de votre backend change
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

### Fichier vercel.json (important pour React Router)
Créer `frontend/vercel.json` :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
Sans ce fichier, les routes `/dashboard`, `/login` etc. donnent une erreur 404 au refresh.

---

## 4. CORS en production

Dans `backend/server.js`, vérifier/modifier la liste des origines autorisées :

```javascript
// ← MODIFIER avec vos vraies URLs de production
const allowedOrigins = [
  'http://localhost:5173',          // dev local
  'https://oilai-invest.vercel.app', // ancienne URL Vercel (conserve si besoin)
  'https://oilai-invest.online', // ← votre domaine personnalisé
  process.env.FRONTEND_URL,         // depuis la variable d'environnement
]
```

---

## 5. Checklist finale avant mise en ligne

- [ ] `MONGODB_URI` configuré sur Render avec le bon mot de passe Atlas
- [ ] `JWT_SECRET` est une chaîne longue et aléatoire (min 32 caractères)
- [ ] `FRONTEND_URL` sur Render correspond à votre URL Vercel
- [ ] `VITE_API_URL` sur Vercel correspond à votre URL Render
- [ ] `frontend/vercel.json` créé avec la règle de rewrite
- [ ] CORS mis à jour avec votre URL Vercel dans `server.js`
- [ ] Seed exécuté pour créer les comptes admin/demo
- [ ] Node-cron fonctionne (visible dans les logs Render au démarrage : `[CRON] 🕐 ...`)

---

## 6. Récapitulatif des choses à modifier dans le code

### Plans et ROI
Fichier : `backend/controllers/investmentController.js`
```javascript
const PLANS = {
  starter: { dailyROI: 1.5, minAmount: 100, durationDays: 30 },  // ← MODIFIER
  pro:     { dailyROI: 2.5, minAmount: 1000, durationDays: 30 }, // ← MODIFIER
  premium: { dailyROI: 3.5, minAmount: 5000, durationDays: 30 }, // ← MODIFIER
}
```

### Délai entre 2 claims (bouton "Réclamer mes gains")
Fichier : `backend/controllers/investmentController.js`
```javascript
const CLAIM_COOLDOWN_HOURS = 24  // ← MODIFIER (ex: 48 pour tous les 2 jours)
```

### Bonus de parrainage (%)
Fichier : `backend/controllers/authController.js`
```javascript
const REFERRAL_BONUS_PERCENT = 5  // ← MODIFIER (ex: 10 pour 10%)
```

### Heure du cron job
Fichier : `backend/services/cronJobs.js`
```javascript
cron.schedule('5 0 * * *', ...)  // ← MODIFIER l'heure (format: minute heure * * *)
```

### Adresses crypto pour les dépôts
Fichier : `frontend/src/pages/Deposits.jsx`
```javascript
const METHODS = [
  { value:'bitcoin', number:'bc1q...' },  // ← MODIFIER
  ...
]
```

### Images du slider
Fichier : `frontend/src/components/ui/ImageSlider.jsx`
```javascript
const SLIDES = [
  { image:'https://...', title:'...' },  // ← MODIFIER les URLs et textes
]
```

---

## 7. Logs utiles en production

```bash
# Voir les logs du cron (Render)
# Dans Dashboard Render → Logs, chercher :
[CRON] 🕐 Génération profits planifiée — 00h05 UTC chaque jour
[CRON] ⚙️  Génération des profits — 2026-06-27T00:05:00Z
[CRON] ✅ 47 profits générés en 0.8s

# Connexion MongoDB
✅ MongoDB connected successfully

# Parrainage bonus
[REFERRAL] +$50.00 crédité au parrain xxx pour filleul yyy
```
