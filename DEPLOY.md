# Déploiement & exploitation — Les Retraités Travaillent

> Cible production : `les-retraites-travaillent.fr` (apex) sur Netlify.
> Stack : Next.js 14 + Supabase + Stripe Connect + Anthropic + Resend.

---

## 1. Pré-requis comptes

| Service | Plan minimum | Action |
|---|---|---|
| Netlify | Free → Pro à partir de 100k req/mois | Créer site, lier le repo GitHub |
| Supabase | Free OK pour MVP, Pro dès 50 utilisateurs actifs | Créer projet, appliquer les 4 migrations |
| Stripe Connect | Standard (0 € fixe + 1.4 % + 0.25 €) | Activer Connect en mode Express, FR |
| Anthropic | Pay-as-you-go | Générer une clé API + plafond budgétaire |
| Resend | Free 100 mails/jour, Pro à 20 €/mois | Vérifier domaine + DKIM/SPF |
| Plausible | Pro à 9 €/mois | Ajouter le domaine |
| Sentry (optionnel) | Free dev → Team 26 €/mois en prod | Créer projet Next.js |

---

## 2. Configuration DNS `.fr`

1. Acheter le domaine sur **Gandi.net** ou **OVH**.
2. Sur Netlify > **Domain settings** > **Add custom domain** :
   - `les-retraites-travaillent.fr` (apex)
   - `www.les-retraites-travaillent.fr`
3. Côté registrar :
   - Apex (`@`) → ALIAS / ANAME → `apex-loadbalancer.netlify.com`
   - WWW → CNAME → `<site>.netlify.app`
4. Activer **HTTPS** depuis Netlify (Let's Encrypt automatique, propagation < 24 h).
5. Vérifier la redirection 301 `www → apex` configurée dans `netlify.toml`.

---

## 3. Variables d'environnement

Copier `.env.example` vers Netlify > **Site settings** > **Environment variables**.

⚠️ **Ne jamais** exposer `SUPABASE_SERVICE_ROLE_KEY` ni `STRIPE_SECRET_KEY` côté client.
Elles ne doivent **pas** commencer par `NEXT_PUBLIC_`.

---

## 4. Migrations Supabase

```bash
# Depuis le repo
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push   # applique 001..004 dans l'ordre
```

Activer **Realtime** sur les tables :
- `notifications`
- `messages`
- `bookings` (optionnel)

---

## 5. Webhook Stripe

1. Stripe Dashboard > **Developers** > **Webhooks** > **Add endpoint**.
2. URL : `https://les-retraites-travaillent.fr/api/stripe/webhook`
3. Évènements à écouter :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `account.updated`
4. Copier le **signing secret** dans `STRIPE_WEBHOOK_SECRET`.
5. Envoyer un évènement test depuis le dashboard pour valider.

---

## 6. Stripe Connect (onboarding prestataires)

- Activer **Stripe Connect** > **Express accounts**.
- Configurer la branding (logo, couleurs, nom légal).
- Vérifier que les pays acceptés incluent **FR**.
- Le bouton `StripeOnboardButton` génère automatiquement les Account Links.

---

## 7. Auth — fournisseurs OAuth

Dans Supabase > **Authentication** > **Providers** :

- **Google** : créer credentials OAuth 2.0 sur Google Cloud Console, ajouter
  `https://<PROJECT_REF>.supabase.co/auth/v1/callback` aux URIs autorisées.
- **Apple** : ServicesID + Sign in with Apple, ajouter le même callback.
- **Email** : activer Magic Link, désactiver "confirm email" en dev.

URL de redirection : `https://les-retraites-travaillent.fr/auth/callback`.

---

## 8. Sécurité — checklist mise en prod

- [ ] HSTS activé (déjà dans `next.config.js`)
- [ ] Permissions-Policy : mic = `self` (déjà fait)
- [ ] Headers `X-Frame-Options: DENY` (déjà fait)
- [ ] Rate limit `/api/chat` à 30 req/min (déjà fait, basique en mémoire)
- [ ] Toutes les tables Supabase ont des **RLS policies** (vérifier via dashboard)
- [ ] Aucune service-role key dans le client
- [ ] DPO mentionné dans `/legal/mentions`
- [ ] CGU validées par juriste (BPI = obligatoire)
- [ ] Bouton "supprimer mon compte" fonctionnel (RGPD article 17)

---

## 9. Monitoring & observabilité

### Sentry (erreurs)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```
Une fois installé, remplacer le contenu de `src/lib/monitoring.ts` par
`Sentry.captureException` / `Sentry.captureMessage`. Aucun call site à modifier.

### Plausible (analytics)
Déjà câblé via `<Analytics />` dans `src/app/layout.tsx`. Renseigner
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` pour activer.

### Logs Netlify
- **Functions** > logs en temps réel (utile pour le webhook Stripe).
- **Deploys** > preview deploys par PR (PR ouverte = URL test).

---

## 10. Tests avant chaque release

```bash
npm run lint            # ESLint
npm run type-check      # TypeScript strict
npm run test            # Vitest (57 tests unitaires)
npm run test:e2e        # Playwright (smoke + SEO)
npm run build           # next build doit passer sans erreur
```

CI suggérée (GitHub Actions) :
```yaml
on: [push, pull_request]
jobs:
  test:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run type-check
      - run: npm run test
```

---

## 11. Procédure d'incident

| Symptôme | Action |
|---|---|
| Webhook Stripe en erreur | Vérifier `STRIPE_WEBHOOK_SECRET`, regarder logs Netlify Functions |
| Quota Anthropic dépassé | Augmenter le plafond ou activer le fallback OpenAI (à coder) |
| Supabase down | Pages publiques restent servies (cache Next.js), API renvoie 503 propres |
| Mass-spam onboarding | Activer hCaptcha sur `/register` (à câbler côté Supabase Auth) |

Contacts d'urgence à renseigner ici une fois l'équipe constituée.

---

*Dernière mise à jour : 2026-04-17 — Sprint 9 livré.*
