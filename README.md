# Avatar SVG Factory

Une application web "single page" qui génère des avatars par IA générative (API Gemini) et permet aux utilisateurs de les sauvegarder (Supabase). Construite avec [Astro](https://astro.build/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) et [shadcn/ui](https://ui.shadcn.com/).

## 🚀 Structure du Projet

- **Framework** : Astro
- **Bibliothèque UI** : React, Shadcn UI
- **Styles** : Tailwind CSS
- **Backend & Base de données** : Supabase
- **IA** : Google Gemini API
- **Icônes** : Lucide React

## 🛠️ Pour Commencer

### Prérequis

Assurez-vous d'avoir Node.js installé sur votre machine.

### Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/AloneDay-91/TP-avatar-svg-factory.git
cd TP-avatar-svg-factory
npm install
```

### Configuration

Créez un fichier `.env` à la racine du projet en copiant `.env.example` :

```bash
cp .env.example .env
```

Ensuite, configurez votre clé API Gemini dans le fichier `.env` :

```env
GEMINI_API_KEY=votre_clé_api_gemini
```

Pour obtenir une clé API Gemini :
1. Rendez-vous sur [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Créez une nouvelle clé API
4. Copiez-la dans votre fichier `.env`

### Développement

Lancez le serveur de développement :

```bash
npm run dev
```

Rendez-vous sur `http://localhost:4321` pour voir l'application.

### Build

Construisez le projet pour la production :

```bash
npm run build
```

### Prévisualisation

Prévisualisez le build de production localement :

```bash
npm run preview
```

## 🤝 Workflow & Contribution

Nous suivons le **Git Flow** pour la gestion de notre versioning.

- **Feature Branches** : Tout développement doit se faire sur une branche dédiée (`feature/nom-de-la-feature`) issue de `develop`.
- **Interdiction de Merge Direct** : Personne ne merge directement sur `develop` ou `main`. L'usage de Pull Requests (PR) est obligatoire.

### Politique de Validation des PR

Pour qu'une PR soit acceptée et mergée, elle doit respecter les règles suivantes :

- **Vers `develop`** : Nécessite au moins **3 validations**.
- **Vers `main`** : Nécessite au moins **4 validations**.
- **Assignation** : Les assignés doivent correspondre au domaine concerné (Dev, Design, DevOps) pour autoriser la PR.

## 👥 Équipe

### Product Owners

- Noam
- Pierre

### Designers

- Flavie
- Nimotalah
- Mohamed-hichem
- Nassia

### Développeurs

- Noheila
- Theo
- Mathias
- Paul

### DevOps

- Lenny
- Elouan
