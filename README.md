# TechPro

Site vitrine et back office pour TechPro (conseil & réparation informatique, Annecy).
Vue 3 + Vite, animations GSAP/Lenis, thème clair/sombre, et un back office connecté à
Supabase pour gérer réservations, messages et factures.

## Stack technique

- **Vue 3** (Composition API, `<script setup>`) + **Vite**
- **Vue Router** — navigation entre les pages
- **GSAP** (+ ScrollTrigger) et **Lenis** — animations et scroll fluide
- **Supabase** — authentification admin + base de données (réservations, messages, factures)

## Structure du projet

```
src/
  animation/        Directives et helpers d'animation (reveal, parallax, tilt, magnetic, smooth scroll)
  assets/           Styles globaux (variables, thème clair/sombre, reset)
  components/
    common/         Composants partagés (badges d'icônes, orbes de fond)
    contact/        Formulaire et infos de contact, FAQ
    home/           Sections de la page d'accueil
    layout/         Nav bar, footer
    rdv/            Calendrier et formulaire de prise de rendez-vous
    admin/          Panneaux du back office (réservations, messages, factures)
  composables/      État partagé (réservations, thème, authentification)
  data/             Contenu du site (services, tarifs, FAQ, identité de l'entreprise)
  lib/              Client Supabase
  router/           Déclaration des routes
  views/            Pages (accueil, contact, RDV, back office)
supabase/
  schema.sql        Schéma complet (réservations, messages) — à exécuter une fois
  002_invoices.sql  Ajout du module Factures — à exécuter une fois
```

## Installation

```bash
npm install
```

## Configuration de Supabase (une seule fois)

1. Créer un compte et un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécuter dans l'ordre :
   - `supabase/schema.sql`
   - `supabase/002_invoices.sql`
3. Dans **Authentication → Users**, créer votre compte (email + mot de passe) : c'est celui utilisé pour se connecter au back office.
4. Dans **Project Settings → API**, récupérer l'**URL du projet** et la clé **`anon` / `publishable`** (jamais la clé `service_role`/secrète).
5. Créer un fichier `.env` à la racine du projet :

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-public
```

## Lancer en développement

```bash
npm run dev
```

## Build de production

```bash
npm run build   # génère le dossier dist/
npm run preview # prévisualise le build localement
```

## Pages du site

| Route         | Description                                  |
|---------------|-----------------------------------------------|
| `/`           | Accueil (services, tarifs, compétences digitales) |
| `/contact`    | Formulaire de contact + FAQ                   |
| `/rdv`        | Prise de rendez-vous en ligne                 |
| `/admin`      | Back office (protégé par connexion)           |
| `/admin/login`| Connexion au back office                      |

## Back office (`/admin`)

- **Réservations** — liste des RDV pris en ligne, changement de statut (nouveau / confirmé / terminé / annulé), suppression.
- **Messages** — messages reçus via le formulaire de contact, marquer lu/non lu, suppression.
- **Factures** — création et édition de factures (numérotation automatique, lignes de prestations, TVA optionnelle, pré-remplissage depuis une réservation), aperçu en direct et impression/export PDF via le navigateur.

## Personnaliser le contenu

- **Couleurs, thème clair/sombre, typographie** → `src/assets/base.css`
- **Services, tarifs, FAQ, services digitaux** → `src/data/`
- **Identité de l'entreprise sur les factures** (nom, adresse, SIRET, IBAN, mention TVA) → `src/data/companyInfo.js`
