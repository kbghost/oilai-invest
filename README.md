# 🛢️ OilAI Invest — Plateforme d'Investissement IA Pétrole

Plateforme d'investissement full-stack complète, basée sur une IA simulée de prédiction des prix pétroliers. Design fintech premium, dark mode, sécurité JWT, gestion admin complète.

---

## 🗂️ Structure du Projet

```
oilai-invest/
├── backend/
│   ├── controllers/
│   │   ├── authController.js        # Inscription / Connexion / JWT
│   │   ├── investmentController.js  # Plans, création, profits IA
│   │   ├── depositController.js     # Dépôts + upload preuve
│   │   ├── withdrawalController.js  # Retraits
│   │   ├── adminController.js       # Stats, gestion users
│   │   └── oilController.js         # Simulation prix pétrole
│   ├── middleware/
│   │   └── auth.js                  # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js                  # Utilisateur (bcrypt, balance...)
│   │   ├── Investment.js            # Plans + historique profits
│   │   ├── Deposit.js               # Dépôts
│   │   └── Withdrawal.js            # Retraits
│   ├── routes/
│   │   ├── auth.js / users.js / investments.js
│   │   ├── deposits.js / withdrawals.js
│   │   ├── admin.js / oil.js
│   ├── scripts/
│   │   └── seed.js                  # Créer admin + demo user
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Entrée principale
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx       # Auth state global
    │   ├── services/
    │   │   └── api.js                # Axios + tous les appels API
    │   ├── components/
    │   │   └── layout/
    │   │       └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx           # Page d'accueil
    │   │   ├── Login.jsx / Register.jsx
    │   │   ├── Dashboard.jsx         # Vue principale user
    │   │   ├── Invest.jsx            # Plans d'investissement
    │   │   ├── Deposits.jsx          # Dépôts
    │   │   ├── Withdrawals.jsx       # Retraits
    │   │   ├── Transactions.jsx      # Historique
    │   │   ├── Profile.jsx
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminUsers.jsx
    │   │       ├── AdminDeposits.jsx
    │   │       └── AdminWithdrawals.jsx
    │   ├── App.jsx                   # Routes + guards
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Tailwind + design tokens
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)
- npm ou yarn

---

### 1. Cloner et configurer le Backend

```bash
cd oilai-invest/backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Éditer `.env` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oilai_invest
JWT_SECRET=mon_secret_super_securise_change_moi
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# Créer admin + demo user
npm run seed

# Démarrer le backend
npm run dev
# ✅ API sur http://localhost:5000
```

---

### 2. Configurer et démarrer le Frontend

```bash
cd oilai-invest/frontend

# Installer les dépendances
npm install

# Démarrer
npm run dev
# ✅ App sur http://localhost:5173
```

---

## 🔐 Comptes par défaut (après seed)

| Rôle  | Email               | Mot de passe |
|-------|---------------------|--------------|
| Admin | admin@oilai.com     | Admin@1234   |
| User  | demo@oilai.com      | Demo@1234    |

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register    # Inscription
POST   /api/auth/login       # Connexion → token JWT
GET    /api/auth/me          # Profil (auth requis)
```

### Investments
```
GET    /api/investments/plans          # Tous les plans
POST   /api/investments                # Créer investissement (auth)
GET    /api/investments                # Mes investissements (auth)
POST   /api/investments/process-profits # Générer profits du jour (admin)
```

### Deposits
```
POST   /api/deposits                   # Créer dépôt (multipart/form-data)
GET    /api/deposits                   # Mes dépôts
GET    /api/deposits/all               # Tous (admin)
PATCH  /api/deposits/:id/approve       # Approuver (admin)
PATCH  /api/deposits/:id/reject        # Rejeter (admin)
```

### Withdrawals
```
POST   /api/withdrawals                # Créer retrait
GET    /api/withdrawals                # Mes retraits
GET    /api/withdrawals/all            # Tous (admin)
PATCH  /api/withdrawals/:id/approve    # Approuver (admin)
PATCH  /api/withdrawals/:id/reject     # Rejeter (admin)
```

### Admin
```
GET    /api/admin/stats                # Dashboard stats
GET    /api/admin/users                # Liste users
PATCH  /api/admin/users/:id/toggle    # Ban/Unban
PATCH  /api/admin/users/:id/balance   # Ajuster solde
```

### Oil AI
```
GET    /api/oil/price                  # Prix + prédictions IA
GET    /api/oil/news                   # Actualités simulées
```

---

## 🧪 Exemple de requêtes (Postman / curl)

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@oilai.com","password":"Demo@1234"}'
```

### Créer un investissement (avec token)
```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"plan":"starter","amount":500}'
```

### Approuver un dépôt (admin)
```bash
curl -X PATCH http://localhost:5000/api/deposits/<DEPOSIT_ID>/approve \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"note":"Deposit verified"}'
```

---

## 🤖 Fonctionnement de l'IA Simulée

L'IA simule des données réalistes de marché WTI :

1. **Prix de base** : ~$78 (plage réaliste $65–$95)
2. **Variation quotidienne** : aléatoire ±$4 avec biais légèrement haussier
3. **Multiplicateur de profit** :
   - Marché haussier (>2%) → +20% sur le ROI
   - Légère hausse (0-2%) → +10%
   - Stable → ROI normal
   - Légère baisse → -10%
   - Fort recul → -15%
4. **Signal IA** : STRONG BUY / BUY / HOLD / WAIT

Pour déclencher les profits quotidiens :
- Manuellement : bouton "Run Daily Profits" dans le panel admin
- Automatiquement : configurer un cron job qui appelle `POST /api/investments/process-profits`

---

## 🔧 Production

```bash
# Build frontend
cd frontend && npm run build

# Servir le build avec le backend
# → Copier le dossier dist/ dans le backend
# → Servir statiquement avec Express

# Variables d'environnement production :
NODE_ENV=production
JWT_SECRET=TRES_LONG_SECRET_ALEATOIRE
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/oilai
FRONTEND_URL=https://votre-domaine.com
```

---

## 🛡️ Sécurité incluse

- ✅ JWT avec expiration 7 jours
- ✅ Bcrypt (hash factor 12) pour les mots de passe
- ✅ Helmet (headers HTTP sécurisés)
- ✅ Rate limiting (100 req/15min général, 10/15min pour auth)
- ✅ CORS configuré
- ✅ Validation des inputs avec express-validator
- ✅ Protection des routes admin
- ✅ Champs sensibles exclus des réponses JSON

---

## 📦 Stack Complète

| Couche     | Technologie                      |
|------------|----------------------------------|
| Frontend   | React 18, Vite, TailwindCSS      |
| Routing    | React Router v6                  |
| HTTP       | Axios                            |
| Charts     | Recharts                         |
| Toasts     | react-hot-toast                  |
| Icons      | Lucide React                     |
| Backend    | Node.js, Express                 |
| Database   | MongoDB, Mongoose                |
| Auth       | JWT, bcryptjs                    |
| Security   | Helmet, express-rate-limit       |
| Upload     | Multer                           |
