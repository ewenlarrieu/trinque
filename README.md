# TRINQUE 🍻

Jeu de cartes à boire multijoueur en temps réel, jouable depuis n'importe quel téléphone sans installation.

**[Jouer sur trinque.netlify.app](https://trinque.netlify.app)**

---

## C'est quoi ?

TRINQUE est un jeu de soirée inspiré de Kings Cup. Un deck de 52 cartes, chaque rang a une règle. Les joueurs piochent à tour de rôle et tout le monde voit la carte en temps réel sur son téléphone.

- Crée une partie → partage le code à tes amis
- Ils rejoignent depuis leur téléphone, pas besoin de compte
- L'hôte lance la partie, les cartes sont synchronisées pour tout le monde
- En fin de manche, l'hôte peut relancer une nouvelle manche

## Stack technique

- **React + TypeScript** — Vite
- **Tailwind CSS v4** — design system TRINQUE (violet nuit, Fredoka, Outfit)
- **Firebase Realtime Database** — sync temps réel entre joueurs
- **Firebase Auth anonyme** — pas de compte requis
- **PWA** — installable sur iOS et Android

## Lancer en local

```bash
npm install
npm run dev
```

Crée un fichier `.env` à la racine (voir `.env.example`) avec tes clés Firebase.

## Règles des cartes

| Carte | Règle |
|-------|-------|
| As | La pyramide — distribue 5 gorgées comme tu veux |
| 2 | Pour toi — distribue 2 gorgées |
| 3 | Pour moi — tu bois 3 gorgées |
| 4 | Par terre — dernier à toucher le sol boit |
| 5 | Les gars — tous les mecs boivent |
| 6 | Les filles — toutes les filles boivent |
| 7 | Le ciel — dernier à lever la main boit |
| 8 | Le binôme — tu choisis un partenaire de boisson |
| 9 | La rime — jeu de rimes, premier bloqué boit |
| 10 | La catégorie — jeu de catégorie, premier bloqué boit |
| Valet | Règle perso — invente un geste secret |
| Dame | Questions — tu deviens maître des questions |
| Roi | La règle — invente une règle pour la soirée |
