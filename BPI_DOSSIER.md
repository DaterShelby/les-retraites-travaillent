# Dossier BPI France — Aide Deeptech
## "Les Retraités Travaillent" — Plateforme intergénérationnelle voice-first

**Porteur** : Tommy (Pixels3D / continuité du projet de Tony, fondateur originel 2006)
**Demande** : 150 000 € — 200 000 € sur 18 mois (Aide Deeptech)
**Date** : 2026-04-17
**Statut** : MVP BPI-ready (refonte Voie B finalisée)

---

## 1. Pitch en 60 secondes

**Problème** : 17 millions de seniors en France. Plus de 50 % veulent rester actifs après la retraite (étude Cnav 2024) mais les plateformes existantes (Yoopies, Ouihelp) sont conçues pour des **clients**, pas pour des **retraités prestataires**. Interface complexe, pas d'accompagnement, taux d'activation < 8 %.

**Solution** : la première plateforme française **voice-first** où un agent IA basé sur Claude Sonnet 4.6 comprend, conseille et **agit pour** les seniors retraités. Onboarding vocal en 3 minutes, mise en relation avec entreprises (B2B) et particuliers (B2C), encaissement Stripe Connect géré de bout en bout.

**USP defensable** : agent IA spécialisé "Senior-friendly" — vocabulaire adapté, pas de jargon, capable d'écrire la mission à la place du retraité, validation parlée. Brevetable comme **interaction pattern** (INPI prévu Q3 2026).

---

## 2. Marché et impact

| Indicateur | Valeur | Source |
|---|---|---|
| Population 60+ en France | 17,5 M | INSEE 2025 |
| Seniors souhaitant travailler après la retraite | ~ 8 M | Cnav 2024 |
| Pénurie de main-d'œuvre PME (postes non pourvus) | 380 000 | Pôle Emploi 2025 |
| Marché du cumul emploi-retraite (volume annuel estimé) | 4,2 Mds € | DARES 2024 |
| Take-rate cible | 10 % | Notre commission Stripe Connect |

**Impact social mesurable** :
- Lutte contre l'isolement des seniors (OMS 2023 : 1 sénior sur 4 souffre d'isolement social)
- Ré-injection de compétences expertes dans les TPE/PME
- Allègement charge fiscale (cumul emploi-retraite = recettes URSSAF supplémentaires)

---

## 3. Stack technique (décisions structurantes)

| Couche | Technologie | Justification |
|---|---|---|
| Frontend | Next.js 14 App Router + React Server Components | SEO optimal, hydratation partielle, perf Lighthouse > 95 |
| Backend | Supabase (PostgreSQL 15, Realtime, RLS, PostGIS) | Sécurité au niveau ligne, pas de backend custom à maintenir |
| Auth | Supabase Auth (email + Magic Link + Google + Apple SSO) | Conforme RGPD, MFA-ready |
| IA | Anthropic Claude Sonnet 4.6 + Web Speech API | Voix native navigateur, agent capable d'agir (function calling) |
| Paiement | Stripe Connect Express + application_fee_amount 10 % | Marketplace pattern audité, KYC/AML géré par Stripe |
| Email transactionnel | Resend | Délivrabilité + DKIM/SPF auto |
| Observabilité | Sentry + Plausible (RGPD-friendly, sans cookie) | Pas de tracking publicitaire |
| CI/CD | Netlify + GitHub Actions | Déploiement preview par PR |

**Composante Deeptech** :
- Agent vocal contextualisé (system prompt 1 200 tokens, tool-use Anthropic, modération in/out)
- Pipeline modération automatique (heuristiques NLP françaises + signalement Claude)
- Recherche full-text PostgreSQL (`tsvector` français + `unaccent`)
- Géo-recherche PostGIS (rayon GPS sur services et missions)

---

## 4. Architecture (résumé technique)

```
Browser (Web Speech API)
   │  voice intent
   ▼
Next.js Edge Runtime ──► /api/chat (Claude streaming SSE)
   │                          │
   │                          ├─► tool: create_booking
   │                          ├─► tool: search_services
   │                          └─► tool: update_profile
   ▼
Supabase Postgres (RLS) ◄──► Stripe Webhooks (Node runtime, raw body)
   │                                   │
   ▼                                   ▼
Realtime channel:notifications    payment_events (idempotence stripe_event_id)
```

Sécurité : RLS Postgres sur toutes les tables, pas de service-role côté client, hooks `useAuth` avec invalidation sur `signOut`, validation Zod côté API + côté formulaire.

---

## 5. Roadmap 18 mois (utilisation des fonds)

### Mois 0–6 — Lancement MVP (60 k€)
- Acquisition 1 000 retraités prestataires (Île-de-France pilote)
- Acquisition 50 entreprises pilote (PME 10–50 salariés)
- Recrutement 1 dev senior (60 % temps), 1 ops/CSM (40 %)
- Coût Anthropic API : ~ 8 k€ (estimé 100 k requêtes/mois @ ~ 0,08 €)

### Mois 6–12 — Expansion régionale (80 k€)
- Couverture 5 régions (PACA, AURA, Occitanie, Nouvelle-Aquitaine, Hauts-de-France)
- Partenariats institutionnels : France Travail (ex-Pôle Emploi), CCI, Cnav
- Audit RGPD + ISO 27001 (préparation)
- Recrutement 1 dev mobile (React Native — app iOS/Android)

### Mois 12–18 — Industrialisation (60 k€)
- Module B2B "marque blanche" pour CCI / collectivités
- Brevet INPI sur l'interaction vocale senior-friendly
- Traduction multi-langue (anglais, espagnol — diaspora retraités UE)
- Préparation Série A (1,5 M€)

---

## 6. Indicateurs de performance (KPI)

| Métrique | Mois 6 | Mois 12 | Mois 18 |
|---|---|---|---|
| Retraités actifs (≥ 1 mission) | 300 | 1 800 | 5 000 |
| Entreprises actives | 30 | 120 | 350 |
| GMV mensuel | 25 k€ | 180 k€ | 600 k€ |
| Revenus plateforme (commission 10 %) | 2,5 k€ | 18 k€ | 60 k€ |
| Activation onboarding (taux) | 35 % | 50 % | 65 % |
| NPS prestataires | 45 | 55 | 65 |
| Coût d'acquisition (CAC) | 18 € | 12 € | 8 € |
| LTV / CAC | 3,5 | 5,2 | 8,1 |

---

## 7. Gestion des risques

| Risque | Mitigation |
|---|---|
| Dépendance Anthropic API | Fallback OpenAI prévu, cache prompt-level (réduction coût ~ 40 %) |
| Pénurie offre (retraités) | Partenariat Cnav + EHPAD, communication ciblée |
| Réglementation cumul emploi-retraite | Veille mensuelle URSSAF, intégration auto-déclaration |
| Concurrence GAFAM (Google Local Services) | Avance produit voice-first FR, ancrage social/territorial |
| Cybersécurité (paiement) | Stripe Connect = PCI-DSS niveau 1, pas de stockage carte côté plateforme |
| Données personnelles RGPD | DPO externe, registre de traitement, droit à l'oubli implémenté |

---

## 8. Équipe

- **Tommy** — Founder & CTO. 15 ans dev autonome. Stack : Python, TypeScript, IA, Solidity. Dirige Pixels3D (studio XR) et Foot Intelligence.
- **Tony** (consultant fondateur) — vision originelle 2006, contacts institutionnels seniors.
- **À recruter** (M3 / financement) : 1 dev senior fullstack, 1 ops/CSM bilingue.

---

## 9. État du MVP (livré au 2026-04-17)

| Sprint | Périmètre | Statut |
|---|---|---|
| 1 — Design system | Mixboard palette + Tailwind tokens | ✅ |
| 2 — Auth | Email + Magic Link + Google + Apple SSO | ✅ |
| 3 — Agent IA | Claude Sonnet 4.6 + voice (STT + TTS) | ✅ |
| 4 — Onboarding adaptatif | 3 étapes voice-first | ✅ |
| 5 — Marketplace + Missions | Recherche tsvector + filtres | ✅ |
| 6 — Booking + Stripe Connect | Express + 10 % platform fee + webhooks | ✅ |
| 7 — Dashboard + Notifications | Realtime + bell + Earnings | ✅ |
| 8 — Admin + Tests | Console admin + 57 tests + E2E smoke | ✅ |
| 9 — Déploiement | Netlify + DNS .fr + Sentry + Plausible | 🔄 |

**Couverture tests** : 57 tests unitaires (validation, modération, schema-org, utils, stripe, notifications) + 9 tests E2E Playwright (smoke + SEO).

---

## 10. Annexes

- `PRD_v2_LesRetraitesTravaillent.md` — spécifications produit complètes
- `PLAN_VOIE_B_2026.md` — plan de refonte 6–8 semaines
- `supabase/migrations/` — schéma DB versionné (4 migrations)
- `src/` — code source (audit possible sur demande)
- Démo live : https://les-retraites-travaillent.fr (après Sprint 9)

---

*Document généré le 2026-04-17. Mise à jour à chaque jalon majeur.*
