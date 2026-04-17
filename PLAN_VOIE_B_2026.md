# PLAN VOIE B — Les Retraités Travaillent
*Démarré le 2026-04-17 — Refonte profonde "BPI-ready" — 6-8 semaines*

## Objectif
Passer du niveau "projet étudiant" au niveau **produit pro 2026 clé en main** prêt à montrer à Tommy père, à des utilisateurs réels, et à BPI France (dossier Aide Deeptech 150-200k€).

---

## Décisions techniques verrouillées (par défaut — Tommy peut révoquer)

| Sujet | Choix | Raison |
|---|---|---|
| **Modèle Claude** | `claude-sonnet-4-6` | Meilleur rapport qualité/prix pour agent conversationnel |
| **Prompt caching** | OBLIGATOIRE | Skill `claude-api` impose ; ~70% économie sur les conversations |
| **Paiement** | Stripe + Stripe Connect | Standard de marché, gestion commission plateforme native |
| **Voice input** | Web Speech API (gratuit) + fallback Whisper API si Safari/iOS | Web Speech marche sur Chrome/Edge/Firefox |
| **Voice output** | Web Speech Synthesis API | Suffisant pour les retours agent IA |
| **Hosting** | Netlify (déjà branché) | Pas de migration prod risquée |
| **Auth additionnels** | Magic link + Google + Apple SSO | Standard 2026, critique pour seniors |
| **Email transactionnel** | Resend (déjà branché) | OK |
| **Map** | Leaflet (déjà branché) | OK |
| **Monitoring** | Sentry (errors) + Plausible (analytics RGPD) | Pas Google Analytics |
| **Rate limiting** | Upstash Redis | Compatible serverless Netlify |
| **Tests** | Vitest (unit) + Playwright (E2E) | Déjà configurés |
| **Style définitif** | Warm minimalism + soft glassmorphism | Skill `ui-ux-pro-max` recommande pour public senior |
| **Composants premium** | shadcn/ui de base + 21st.dev MCP pour les composants complexes | Évite le reinvent the wheel |
| **Validation par sprint** | Demo + commit + tag git par sprint | Tommy peut valider/corriger à chaque palier |

---

## Roadmap détaillée

### Sprint 0 — Foundation tech (3 jours) ▶ EN COURS
- [ ] Centraliser TOUS les schémas Zod dans `lib/validations/` (auth, onboarding, services, bookings, messages)
- [ ] Brancher `react-hook-form` + `zodResolver` dans login, register, onboarding step 1-4, forms services/bookings
- [ ] Virer TOUS les `alert()` natifs → Radix Toast global (`Toaster` dans `layout.tsx`)
- [ ] Composant `<FormField>` réutilisable (Form, FormItem, FormLabel, FormControl, FormMessage shadcn)
- [ ] Setup Sentry (error tracking)
- [ ] Setup Upstash Redis + middleware rate limit (auth, chat, paiement)
- [ ] Setup Plausible analytics
- **Livrable** : foundation tech 100% pro, plus aucun `alert`, validations centralisées

### Sprint 1 — Design system premium (5 jours)
- [ ] Audit ui-ux-pro-max → style définitif documenté dans `docs/design-system.md`
- [ ] Tokens étendus dans `tailwind.config.ts` (motion, shadows, spacing scale, radius)
- [ ] Composants premium via 21st.dev MCP : input avec icône, select async, multi-select, date picker, range slider, stepper visuel, skeleton, empty state, toast premium, command palette (Ctrl+K)
- [ ] Migration progressive de tous les composants existants vers le nouveau design system
- [ ] Page `/_design-system` interne référence des composants
- [ ] Animations Framer Motion : page transitions, hover states, loaders
- **Livrable** : design system documenté, tous les composants migrés

### Sprint 2 — Auth complet + SSO (3 jours)
- [ ] Magic link Supabase (configuration + UI)
- [ ] Google SSO (Supabase Auth Providers)
- [ ] Apple SSO
- [ ] Refonte UI login/register avec nouveaux composants premium
- [ ] Redirect intelligent après auth (vers onboarding si profil incomplet, sinon dashboard)
- [ ] Session management server-side (middleware Next.js)
- [ ] Page mot de passe oublié refondue
- **Livrable** : 4 méthodes d'auth (email+pwd, magic link, Google, Apple)

### Sprint 3 — Agent IA Claude voice-first (8 jours) **USP #1**
- [ ] Skill `claude-api` chargé pour respect prompt caching
- [ ] Route `/api/chat` avec streaming (Anthropic SDK)
- [ ] System prompt dynamique : profil utilisateur + page courante + 20 derniers messages (cached)
- [ ] Tool use Claude : `search_services`, `create_service`, `update_profile`, `send_message`, `update_availability`, `get_legal_info`, `create_booking`, `schedule_appointment`
- [ ] UI widget chat flottant (accessible toutes pages) + page dédiée `/assistant`
- [ ] Voice input : Web Speech API (Chrome/Edge/Firefox) + fallback Whisper API (Safari/iOS)
- [ ] Voice output : Speech Synthesis API
- [ ] Persistance dans table `chat_messages` (déjà en BD)
- [ ] Rate limit : 30 messages/heure gratuit
- [ ] Suggestions proactives (badges "profil incomplet", "3 nouveaux services")
- **Livrable** : agent IA fonctionnel voice-first, peut créer/modifier/répondre à la place du user

### Sprint 4 — Onboarding adaptatif (4 jours)
- [ ] Refonte des 4 étapes en parcours adaptatif
- [ ] **Mode IA** : conversation naturelle, l'agent remplit le profil au fil de l'échange
- [ ] **Mode formulaire** : stepper visuel premium, autosave Supabase à chaque champ, preview profil en direct
- [ ] Validation Zod temps réel (au blur)
- [ ] Skeleton loaders + transitions Framer Motion
- [ ] Détection auto compétences (via Claude tool use)
- [ ] Suggestions intelligentes catégories services
- **Livrable** : onboarding voice-first ou formulaire premium, persisté en BD à chaque étape

### Sprint 5 — Marketplace + Job board pro (5 jours)
- [ ] Listing services : grid responsive, filtres avancés (catégorie, distance, prix, dispo, note), tri intelligent, pagination/infinite scroll
- [ ] Page détail service : galerie photos (Supabase Storage), avis, calendrier disponibilité, CTA réservation
- [ ] Map view Leaflet avec clustering géographique
- [ ] Job board entreprises : filtres rôle/secteur/loc, candidature 1-click via agent IA
- [ ] Matching intelligent (Claude tool use sur profil + offres)
- [ ] Upload photos (Supabase Storage + signed URLs + compression)
- **Livrable** : marketplace + job board fonctionnels avec vraies données

### Sprint 6 — Booking + Stripe (5 jours)
- [ ] Workflow complet : devis → validation → paiement Stripe → confirmation → livraison → review
- [ ] Stripe Connect (commission plateforme retenue auto)
- [ ] Stripe Elements pour CB (jamais de PCI côté serveur)
- [ ] Webhooks Stripe : `payment_intent.succeeded`, `refund.created`, `charge.dispute.created`
- [ ] Génération facture PDF (skill `pdf`)
- [ ] Email confirmation Resend (template HTML pro)
- [ ] Conformité URSSAF / CESU : note légale + lien déclaration
- [ ] Tableau "Earnings" retraité avec stats
- **Livrable** : transactions monétaires sécurisées de bout en bout

### Sprint 7 — Dashboard + Realtime + Notifications (4 jours)
- [ ] Refonte dashboard rôle-based (retiree/client/company) avec **vraies stats**
- [ ] Supabase Realtime : chat temps réel, notifications live
- [ ] Web Push API (Service Worker pour notifications)
- [ ] Mode "assistant proactif" : agent IA peut répondre aux messages reçus si activé
- [ ] Centre de notifications (page dédiée + cloche header avec badge)
- **Livrable** : expérience temps réel, dashboard riche

### Sprint 8 — Admin + Tests + Polish BPI (5 jours)
- [ ] Admin panel : modération services/users, dashboard analytics globales
- [ ] Tests E2E Playwright sur 5 parcours critiques (signup retraité, booking client, recrutement entreprise, chat realtime, paiement)
- [ ] Tests unit Vitest sur logique métier (matching, validations, calcul commission)
- [ ] Coverage 80%+
- [ ] Lighthouse 95+ (performance, accessibilité, SEO)
- [ ] **Page `/impact`** pour BPI : métriques d'usage, témoignages vérifiés, KPIs (utilisateurs actifs, missions réalisées, CA généré, satisfaction)
- [ ] Page legal complète + RGPD (cookies banner, registre traitements)
- **Livrable** : produit testé, performant, conforme

### Sprint 9 — Déploiement + DNS + Monitoring (3 jours)
- [ ] Fix DNS `.fr` (cert SSL Let's Encrypt via Netlify Domain settings)
- [ ] CI/CD GitHub Actions (lint, type-check, tests, build, deploy preview sur PR)
- [ ] Sentry production
- [ ] Plausible production
- [ ] Status page publique (Better Stack ou équivalent)
- [ ] PWA : manifest, service worker, installable mobile
- [ ] README + CONTRIBUTING + ARCHITECTURE.md
- **Livrable** : production-ready, observable, déployable en continu

---

## Total : 45 jours dev plein temps = 6-9 semaines selon parallélisation

## Garde-fous
- Commit + tag git à chaque fin de sprint (`git tag sprint-N-done`)
- Demo concrète à Tommy avant de démarrer le sprint suivant
- Pas de `alert()`, `console.log` en prod, `any`, `@ts-ignore`, TODO laissé dans le code (règles MEGA_PROMPT)
- RLS sur TOUTES les tables Supabase
- Validation Zod côté serveur sur CHAQUE endpoint
- Secrets jamais commités (hook `pre_write_safety.ps1` actif)

## Ce qui n'est PAS dans le scope V1 (V2 plus tard)
- App mobile native (PWA suffit pour V1)
- Système de parrainage / referral
- Internationalisation (FR uniquement V1)
- Marketplace de produits (services seulement)
- Vidéo conférence intégrée (lien Zoom externe pour V1)
