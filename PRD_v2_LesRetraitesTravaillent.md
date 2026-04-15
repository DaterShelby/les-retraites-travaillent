# PRD v2 — Les Retraités Travaillent

> **Version** : 2.0 — 15 avril 2026
> **Auteur** : Tommy + Claude
> **Statut** : Roadmap de développement — du pré-MVP au produit fini

---

## 1. VISION PRODUIT

**"Les Retraités Travaillent" n'est pas un site d'annonces. C'est une plateforme communautaire augmentée par l'IA où chaque utilisateur a un assistant personnel intelligent qui peut agir à sa place.**

Le retraité de 68 ans qui ne sait pas bien utiliser un smartphone ? Son agent IA crée son annonce, répond aux messages, gère son planning. Le particulier pressé ? Son agent trouve le bon prestataire, compare les prix, réserve le créneau. L'entreprise ? Son agent identifie les profils seniors conformes à la loi des 5%.

**Différenciateurs clés :**
- Agent IA personnel par utilisateur (pas un chatbot FAQ)
- Plateforme communautaire (pas juste retraités → tout le monde à terme)
- Rôles modulables (un retraité peut aussi chercher des services)
- Géolocalisation automatique par navigateur
- Design Apple-like, premium, accessible

---

## 2. AUDIT DE L'EXISTANT — CE QUI EST FAIT

### ✅ Fonctionnel (40% du produit final)

| Module | Statut | Détail |
|--------|--------|--------|
| Auth (inscription/connexion) | ✅ Done | API route server-side, auto-confirm, 3 rôles |
| Onboarding 4 étapes | ⚠️ 80% | UI complète, Zustand store, **mais pas persisté en BDD** |
| Marketplace (browse) | ⚠️ 75% | Cards, filtres, recherche texte, **mais données mockées** |
| Page détail service | ⚠️ 60% | Layout ok, **pas de réservation, pas de photos dynamiques** |
| Messaging UI | ⚠️ 70% | Chat window, bulles, **pas de temps réel** |
| Dashboard | ⚠️ 50% | Layout rôle-based, **données hardcodées, pas de vraies stats** |
| Reviews UI | ⚠️ 60% | Composants prêts, **soumission pas implémentée** |
| Notifications UI | ⚠️ 40% | Cloche + page, **pas de temps réel, pas d'emails** |
| Base de données | ✅ 90% | 8 tables avec RLS, triggers, index, PostGIS |
| Design system | ✅ Done | Palette chaude, arrondis Apple-like, logo SVG |
| Pages légales | ✅ Done | CGU, confidentialité, mentions légales |
| Infrastructure | ✅ Done | Next.js 14, Supabase, Netlify, TypeScript strict |

### ❌ Ce qui manque complètement

| Module | Impact | Effort estimé |
|--------|--------|---------------|
| **Agent IA personnel** | USP #1 de la plateforme | 5-7 jours |
| **Réservation complète** | Impossible de transacter | 2-3 jours |
| **Paiement Stripe** | Impossible de monétiser | 3-4 jours |
| **Géolocalisation** | Pas de recherche par zone | 2 jours |
| **Upload photos** | Annonces sans visuels | 1.5 jours |
| **Emails transactionnels** | Pas de rétention/engagement | 2 jours |
| **Temps réel (chat/notifs)** | Chat mort, pas de push | 2 jours |
| **Job board entreprises** | 33% du modèle business absent | 3-4 jours |
| **Admin panel** | Pas de modération possible | 2-3 jours |
| **Blog/Contenu SEO** | Pas d'acquisition organique | 2 jours |
| **Analytics/Monitoring** | Aveugle sur l'usage | 1 jour |
| **Données réelles dans dashboard** | Tout est vide/mocké | 2 jours |
| **Onboarding persisté** | Données perdues si refresh | 1 jour |

---

## 3. ARCHITECTURE DE L'AGENT IA PERSONNEL

### 3.1 Concept

Chaque utilisateur connecté a accès à un **assistant IA personnel** qui :
- **Comprend son profil** (rôle, compétences, préférences, historique)
- **Agit à sa place** quand on lui demande (créer annonce, chercher service, répondre message)
- **Suggère proactivement** (« 3 nouvelles demandes près de chez vous », « Votre profil serait plus attractif avec une photo »)
- **Explique et guide** (cumul emploi-retraite, fiscalité, utilisation de la plateforme)

### 3.2 Capacités de l'agent

**Mode conversationnel (chat)** :
- Widget flottant accessible depuis toutes les pages
- Streaming des réponses (SSE)
- Historique de conversation persisté
- 30 messages/heure gratuits

**Mode action (l'agent fait pour l'utilisateur)** :
| Action | Déclencheur exemple | Ce que l'agent fait |
|--------|---------------------|---------------------|
| Créer annonce | "Crée une annonce pour du jardinage à 20€/h" | Remplit le formulaire, propose un titre, une description, un tarif |
| Chercher service | "Trouve-moi un plombier à Lyon pas cher" | Recherche, filtre, classe par pertinence, affiche les résultats |
| Répondre message | "Réponds à Marie que je suis dispo jeudi" | Rédige un message contextuel, l'envoie après validation |
| Gérer planning | "Bloque le lundi et mardi prochains" | Met à jour les disponibilités |
| Compléter profil | "Aide-moi à écrire ma bio" | Génère une bio à partir des infos du profil |
| Info légale | "C'est quoi le plafond cumul emploi-retraite ?" | Répond avec les infos à jour, sources citées |
| Réserver | "Réserve avec Laurent mercredi à 14h" | Crée la réservation, envoie la demande |

**Mode suggestion proactive** :
- Badges "profil incomplet" avec CTA
- "3 nouveaux services correspondent à votre recherche"
- "Michel vous a envoyé un message il y a 2h — voulez-vous que je réponde ?"
- "Vous approchez du plafond cumul emploi-retraite ce mois-ci"

### 3.3 Architecture technique

```
[Widget UI] → [API Route /api/chat] → [Claude API avec streaming SSE]
                    ↓
            [System prompt dynamique]
            - Profil utilisateur (rôle, compétences, localisation)
            - Contexte de la page actuelle
            - Historique des 20 derniers messages
            - Outils disponibles (fonctions)
                    ↓
            [Tool Use / Function Calling]
            - search_services(query, location, filters)
            - create_service(title, description, price, category)
            - send_message(conversation_id, content)
            - update_availability(dates, status)
            - get_legal_info(topic)
            - create_booking(service_id, date, message)
```

**Stack technique** :
- API Route Next.js avec streaming (ReadableStream)
- Claude API (claude-sonnet-4-5-20250514 pour le rapport coût/qualité)
- Function calling pour les actions
- Historique en BDD (table `chat_messages` déjà créée)
- Rate limiting : 30 msg/h (compteur en BDD)

### 3.4 System prompt de l'agent

```
Tu es l'assistant personnel de {user.first_name} sur "Les Retraités Travaillent".

Profil utilisateur :
- Rôle : {user.role}
- Localisation : {user.city} ({user.department})
- Compétences : {user.skills}
- Note moyenne : {user.average_rating}/5

Tu peux :
1. CHERCHER des services (search_services)
2. CRÉER une annonce (create_service)  
3. ENVOYER un message (send_message)
4. RÉSERVER un créneau (create_booking)
5. MODIFIER le profil/disponibilités (update_profile)
6. INFORMER sur la législation emploi-retraite

Règles :
- Parle en français, tutoie l'utilisateur
- Sois chaleureux et patient (pense à un retraité qui découvre)
- Avant d'exécuter une action, CONFIRME avec l'utilisateur
- Si tu ne sais pas, dis-le honnêtement
- Propose des actions concrètes, pas des explications vagues
```

---

## 4. MODULES À DÉVELOPPER — ROADMAP COMPLÈTE

### PHASE 1 — PRODUIT FONCTIONNEL (P0) — 10-14 jours

#### 4.1 Réservation complète
- Bouton "Réserver" sur page service → sélection créneau → message → confirmation
- Statuts : `pending` → `confirmed` → `in_progress` → `completed` → `reviewed`
- Notifications auto à chaque changement de statut
- Vue "Mes réservations" dans le dashboard (côté client ET prestataire)
- Calendrier interactif des disponibilités

#### 4.2 Géolocalisation automatique
- API `navigator.geolocation` au premier lancement → stockage en profil
- Recherche par rayon (5/10/25/50 km) via PostGIS `ST_DWithin`
- Carte Leaflet/OpenStreetMap avec markers cliquables
- Toggle vue carte / vue grille sur la page services
- Saisie manuelle ville/CP en fallback
- Autocomplete villes (API gouvernement)

#### 4.3 Upload photos
- Supabase Storage bucket `service-photos` et `avatars`
- Drag & drop + click, max 5 photos par annonce
- Compression client-side (max 1200px, WebP)
- Preview en temps réel avant upload
- Avatar rond (Apple-like) dans le profil

#### 4.4 Onboarding persisté
- Sauvegarde progressive à chaque étape (upsert en BDD)
- Reprise là où on s'est arrêté si on quitte
- Redirection auto vers l'étape incomplète au login
- Barre de progression connectée aux données réelles

#### 4.5 Dashboard avec vraies données
- Requêtes Supabase réelles (plus de mock)
- Retraité : missions en cours, revenus du mois, nouvelles demandes, messages
- Particulier : réservations actives, favoris, suggestions
- Entreprise : offres publiées, candidatures, indicateur conformité 5%
- Skeleton loaders pendant le chargement
- Empty states avec CTA pertinents

#### 4.6 Création d'annonce fonctionnelle
- Formulaire multi-étapes : titre → description → catégorie → photos → tarif → localisation → disponibilités
- Validation Zod à chaque étape
- Preview en temps réel de l'annonce
- Sauvegarde en brouillon
- Publication → visible dans le marketplace

---

### PHASE 2 — ENGAGEMENT & RÉTENTION (P1) — 8-10 jours

#### 4.7 Agent IA personnel
- Widget flottant (coin bas-droit, toutes les pages)
- API route `/api/chat` avec streaming SSE
- System prompt dynamique (cf. section 3)
- Function calling : search, create, message, book, profile
- Historique en BDD, 30 msg/h
- Suggestions proactives dans le dashboard
- Mode "faire à ma place" avec confirmation

#### 4.8 Messaging temps réel
- Supabase Realtime subscriptions sur `messages`
- Indicateur "en ligne" (présence Realtime)
- "En train d'écrire..." (typing indicator)
- Marquage "lu" automatique
- Upload de pièces jointes (photos, PDF)
- Notification in-app instantanée
- Détection numéro de téléphone/email → avertissement

#### 4.9 Emails transactionnels (Resend)
- Templates React Email :
  - Bienvenue après inscription
  - Confirmation de réservation
  - Nouveau message reçu
  - Avis reçu
  - Rappel mission J-1
  - Paiement reçu / effectué
- Préférences email par utilisateur (toggle par type)
- Désabonnement en un clic

#### 4.10 Notifications temps réel
- Supabase Realtime sur `notifications`
- Badge compteur dans le header (live)
- Dropdown avec liste scrollable
- Types : message, réservation, avis, candidature, rappel, système
- Son de notification (optionnel, toggle)

#### 4.11 Système d'avis complet
- Formulaire post-mission (étoiles 1-5 + commentaire)
- Réponse du prestataire
- Badges auto-calculés (SuperPro, Expert, Vérifié)
- Affichage sur profil public + page service
- Impossible de laisser un avis sans mission complétée

---

### PHASE 3 — MONÉTISATION & SCALE (P1-P2) — 8-12 jours

#### 4.12 Paiement Stripe Connect
- Onboarding Stripe Connect pour les prestataires
- Checkout via Stripe Elements à la réservation
- Escrow : paiement bloqué → libéré 48h après mission complétée
- Commission : 10% (5% client + 5% prestataire)
- Webhooks Stripe → mise à jour statut paiement
- Dashboard financier prestataire (gains, historique, prochains versements)
- Factures PDF automatiques
- Remboursement si annulation dans les délais

#### 4.13 Job Board entreprises
- Tables `job_offers` et `applications` en BDD
- Formulaire création d'offre (entreprise)
- Recherche d'offres (retraité) avec matching score
- Candidature en 1 clic (profil auto-attaché)
- Gestion des candidatures (shortlister/refuser/inviter)
- Badge "Conforme loi 2026" automatique
- Messaging intégré candidat ↔ entreprise

#### 4.14 Admin panel
- Layout `/admin` protégé par rôle
- Dashboard : stats clés (inscrits, annonces, transactions, CA)
- Modération : file d'attente annonces, avis signalés, messages
- Gestion utilisateurs : liste, recherche, détail, suspension
- Configuration : commission, catégories, badges
- Graphiques recharts

---

### PHASE 4 — CROISSANCE & POLISH (P2-P3) — 6-10 jours

#### 4.15 Blog & contenu SEO
- Articles MDX ou BDD
- Catégories : Juridique, Conseils, Témoignages, Actualités
- SEO optimisé par article (metadata, Schema.org)
- Commentaires modérés

#### 4.16 SEO & Performance
- `generateMetadata` sur toutes les pages
- Sitemap XML dynamique
- Schema.org (LocalBusiness, Service, Person, JobPosting)
- `next/image` partout (lazy loading, WebP)
- Bundle analysis + optimisation
- Core Web Vitals < seuils Google

#### 4.17 PWA
- `manifest.json`
- Service worker basique (cache shell)
- Install prompt sur mobile

#### 4.18 Accessibilité
- Audit axe-core
- Navigation clavier complète
- Labels ARIA
- Skip to content
- Contraste 4.5:1 minimum
- Touch targets 48px minimum

#### 4.19 Analytics & Monitoring
- Sentry pour les erreurs
- Plausible/PostHog pour l'analytics
- Logs structurés (pas de console.log)

---

## 5. TABLES BDD MANQUANTES

### 5.1 `job_offers`
```sql
CREATE TABLE job_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES user_profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sector TEXT,
  contract_type TEXT DEFAULT 'cdi_valorisation',
  location TEXT,
  department TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  skills_required TEXT[],
  is_law_2026_compliant BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft','active','closed','archived')),
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.2 `applications`
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_offer_id UUID REFERENCES job_offers(id) NOT NULL,
  applicant_id UUID REFERENCES user_profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','shortlisted','rejected','invited','accepted')),
  cover_letter TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_offer_id, applicant_id)
);
```

### 5.3 `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  payer_id UUID REFERENCES user_profiles(id) NOT NULL,
  payee_id UUID REFERENCES user_profiles(id) NOT NULL,
  amount_total INTEGER NOT NULL, -- en centimes
  commission_rate NUMERIC(4,2) DEFAULT 10.00,
  commission_amount INTEGER NOT NULL,
  net_amount INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','escrow','released','refunded','failed')),
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.4 `notification_preferences`
```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) UNIQUE NOT NULL,
  email_messages BOOLEAN DEFAULT true,
  email_bookings BOOLEAN DEFAULT true,
  email_reviews BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  push_messages BOOLEAN DEFAULT true,
  push_bookings BOOLEAN DEFAULT true,
  push_reviews BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. STACK TECHNIQUE COMPLÈTE

| Couche | Technologie | Usage |
|--------|------------|-------|
| Frontend | Next.js 14+ (App Router) | SSR, RSC, API routes |
| Langage | TypeScript strict | Zéro `any` |
| Styling | Tailwind CSS + shadcn/ui | Design system Apple-like |
| State | Zustand + React Query | Client state + server state |
| Auth | Supabase Auth | Email + social (futur) |
| BDD | PostgreSQL (Supabase) | PostGIS, RLS, triggers |
| Temps réel | Supabase Realtime | Chat, notifications |
| Storage | Supabase Storage | Photos, avatars, fichiers |
| IA | Claude API (Anthropic) | Agent personnel, function calling |
| Paiement | Stripe Connect | Escrow, commissions, payouts |
| Emails | Resend + React Email | Templates transactionnels |
| Cartes | Leaflet + OpenStreetMap | Recherche géographique |
| Géoloc | Navigator API + API Geo Gouv | Autocomplete villes, GPS |
| Analytics | Plausible / PostHog | Privacy-first analytics |
| Errors | Sentry | Monitoring production |
| Deploy | Netlify | Auto-deploy depuis GitHub |
| CI | GitHub Actions | Lint, typecheck, test, build |
| Tests | Vitest + Playwright | Unit + E2E |

---

## 7. DESIGN SYSTEM — GUIDELINES

### Palette (mise à jour v2)
- **Primary** : `#1a1a2e` (navy profond chaud)
- **Secondary** : `#E07A5F` (coral/terracotta)
- **Accent** : `#81B29A` (vert sauge)
- **Background** : `#FAF9F6` (crème chaud)
- **Text** : `#2D2D3F` (gris profond)

### Typographie
- **Titres** : Libre Baskerville (sérif)
- **Corps** : Source Sans Pro (sans-sérif)
- **Minimum** : 16px corps, 1.6 line-height

### Composants — Règles Apple-like
- **Coins** : `rounded-2xl` (28px) minimum sur tous les conteneurs
- **Cards** : `rounded-3xl` (32px), ombres subtiles, hover avec élévation
- **Boutons** : `rounded-2xl`, min-height 48px, verbes d'action en français
- **Images** : toujours avec `rounded-2xl` ou `rounded-3xl`, jamais rectangulaires
- **Avatars** : carrés arrondis (`rounded-2xl`), pas des cercles
- **Inputs** : `rounded-2xl`, h-14, icône à gauche, label au-dessus
- **Navigation** : pill-shaped (`rounded-2xl`), fond semi-transparent
- **Header** : frosted glass (`backdrop-blur-2xl`, `bg-white/70`)
- **Modals** : `rounded-3xl`, fond backdrop blur

### Interdit
- Gradients violet/bleu génériques
- Coins rectangulaires/sharp sur les images
- Police Inter seule
- Illustrations IA génériques
- Centrage systématique de tout
- Ombres lourdes

---

## 8. PARCOURS UTILISATEURS CRITIQUES

### 8.1 Retraité — Premier jour
```
Landing → Inscription (retraité) → Onboarding 4 étapes →
Dashboard (vide mais guidé par l'agent IA) →
"Créez votre première annonce" (assisté par l'agent) →
Annonce publiée → Attente de demandes →
Réception message → Réponse (ou l'agent répond) →
Réservation acceptée → Mission réalisée → Paiement reçu → Avis
```

### 8.2 Particulier — Cherche un service
```
Landing → "Trouver un expert" →
Page services (géolocalisé auto) → Filtres → Carte/Grille →
Page détail service → Avis, dispo, tarif →
"Réserver" → Sélection créneau → Message → Paiement →
Confirmation → Mission → Avis post-mission
```

### 8.3 Entreprise — Loi des 5%
```
Landing → "Espace entreprise" → Inscription entreprise →
Onboarding entreprise → Dashboard conformité →
Publier offre → Recevoir candidatures → Shortlister →
Inviter → Messaging → Embauche
```

### 8.4 L'agent IA — Interaction type
```
Utilisateur : "Salut, je cherche quelqu'un pour m'aider avec mon jardin"
Agent : "Salut Tommy ! Je cherche les jardiniers disponibles près de chez toi..."
[Appel search_services(category="jardinage", location=user.location, radius=25)]
Agent : "J'ai trouvé 3 jardiniers dans un rayon de 25 km :
1. Marie — 4.6⭐ — 20€/h — Lyon (8 km)
2. Pierre — 4.9⭐ — 25€/h — Villeurbanne (12 km)
3. Jean — 4.3⭐ — 18€/h — Vénissieux (15 km)
Tu veux que je réserve avec l'un d'eux ?"
Utilisateur : "Réserve avec Pierre mercredi à 14h"
Agent : [Appel create_booking(service_id=..., date="mercredi 14h")]
Agent : "C'est fait ! J'ai envoyé une demande de réservation à Pierre pour mercredi à 14h. Il va te confirmer. Je te préviens dès que c'est accepté !"
```

---

## 9. MÉTRIQUES DE SUCCÈS

| Métrique | Objectif MVP | Objectif 6 mois |
|----------|-------------|-----------------|
| Inscrits | 100 | 5 000 |
| Annonces publiées | 50 | 2 000 |
| Réservations/mois | 20 | 500 |
| Taux de conversion (visite → inscription) | 5% | 10% |
| NPS | > 30 | > 50 |
| Temps de réponse moyen | < 24h | < 4h |
| Utilisation agent IA | 30% des users | 60% des users |
| CA mensuel | 0 (gratuit MVP) | 15 000€ |

---

## 10. ESTIMATION EFFORT TOTAL

| Phase | Durée | Priorité |
|-------|-------|----------|
| Phase 1 — Produit fonctionnel | 10-14 jours | P0 CRITIQUE |
| Phase 2 — Engagement & rétention | 8-10 jours | P1 HAUTE |
| Phase 3 — Monétisation & scale | 8-12 jours | P1-P2 |
| Phase 4 — Croissance & polish | 6-10 jours | P2-P3 |
| **TOTAL pour produit complet** | **32-46 jours** | — |

**Note** : Ces estimations sont pour un développeur senior à temps plein. Avec Claude en agent de développement, certaines phases peuvent être parallélisées.

---

## 11. ORDRE D'EXÉCUTION RECOMMANDÉ

```
SEMAINE 1-2 : Phase 1 (réservation, géoloc, photos, annonces, dashboard réel)
SEMAINE 3   : Phase 2a (agent IA personnel, messaging temps réel)
SEMAINE 4   : Phase 2b (emails, notifications, avis)
SEMAINE 5   : Phase 3a (Stripe, paiement, escrow)
SEMAINE 6   : Phase 3b (job board, admin panel)
SEMAINE 7   : Phase 4 (blog, SEO, PWA, a11y, analytics)
SEMAINE 8   : Tests finaux, polish, launch
```

---

*Ce PRD est la source de vérité pour le développement. Chaque feature doit être validée contre ce document avant d'être considérée comme terminée.*
