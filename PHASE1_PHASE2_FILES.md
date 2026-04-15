# Phase 1 & Phase 2 - Fichiers créés

## Phase 1: Auth Fonctionnel (Server Actions)

### Fichiers Auth Actions

1. **src/app/(auth)/login/actions.ts**
   - Server Action pour l'authentification
   - Validation avec Zod schema
   - Redirection vers /dashboard après succès

2. **src/app/(auth)/register/actions.ts**
   - Server Action pour l'inscription
   - Création du profil utilisateur dans Supabase
   - Redirection vers /onboarding/step-1

3. **src/app/(auth)/forgot-password/actions.ts**
   - Server Action pour la réinitialisation de mot de passe
   - Envoie un email avec lien de réinitialisation

### Layouts Auth

4. **src/app/(auth)/layout.tsx**
   - Layout pour les pages d'authentification
   - Inclut Header et Footer
   - Pas de sidebar

---

## Phase 2: Layout & Navigation

### Composants de Layout

5. **src/components/layout/header.tsx**
   - Header sticky avec logo
   - Navigation responsive (desktop + mobile)
   - Menu utilisateur avec actions dynamiques par rôle
   - Liens: Services, Dashboard, Messages, Notifications
   - Mobile menu avec hamburger

6. **src/components/layout/footer.tsx**
   - Footer avec liens légaux
   - Sections: About, Services, Company, Contact
   - Liens de catégories
   - Informations de contact
   - Copyright

7. **src/components/layout/sidebar.tsx**
   - Sidebar contextuelle par rôle
   - **Retraité**: Mes annonces, Réservations, Revenus, Créer annonce
   - **Client**: Mes réservations, Favoris
   - **Entreprise**: Mes offres, Candidatures, Statistiques, Créer offre
   - Active state sur les liens courants
   - Settings et Help en bas

8. **src/components/ui/card.tsx**
   - Composant Card réutilisable
   - Exports: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

### Dashboard & Layout Principal

9. **src/app/dashboard/layout.tsx**
   - Layout du dashboard avec authentification requise
   - Vérification utilisateur avec server component
   - Intègre Header, Sidebar et Footer
   - Redirection vers /login si non authentifié

10. **src/app/dashboard/page.tsx**
    - Page d'accueil du dashboard
    - Contenu adapté au rôle (retiree/client/company)
    - **Retraité**: Quick actions pour créer annonce, annonces actives, réservations, revenus
    - **Client**: Réservations actives, favoris
    - **Entreprise**: Créer offre, offres actives, candidatures, statistiques

### Layouts Publics

11. **src/app/(public)/layout.tsx**
    - Layout pour pages publiques
    - Inclut Header et Footer
    - Pas de sidebar

### Pages Publiques

12. **src/app/(public)/services/page.tsx**
    - Page services principale
    - 3 catégories: Services retraités, Particuliers, Entreprises
    - Features section
    - CTA pour inscription

13. **src/app/(public)/services/retiree-services/page.tsx**
    - Services proposés par retraités

14. **src/app/(public)/services/individuals/page.tsx**
    - Services pour particuliers

15. **src/app/(public)/services/companies/page.tsx**
    - Services pour entreprises

### Pages Dashboard - Retraité

16. **src/app/dashboard/listings/page.tsx**
    - Affiche les annonces du retraité
    - Lien rapide pour créer une annonce

17. **src/app/dashboard/listings/create/page.tsx**
    - Formulaire pour créer une annonce
    - Champs: titre, description, catégorie, prix/heure

18. **src/app/dashboard/bookings/page.tsx**
    - Liste des réservations

19. **src/app/dashboard/earnings/page.tsx**
    - Dashboard de revenus
    - 3 cartes: Ce mois, Total, En attente
    - Historique des revenus

### Pages Dashboard - Client

20. **src/app/dashboard/favorites/page.tsx**
    - Services favoris sauvegardés

### Pages Dashboard - Entreprise

21. **src/app/dashboard/offers/page.tsx**
    - Affiche les offres de l'entreprise
    - Lien rapide pour créer une offre

22. **src/app/dashboard/offers/create/page.tsx**
    - Formulaire pour créer une offre
    - Champs: titre, description, domaine, salaire

23. **src/app/dashboard/applications/page.tsx**
    - Gestion des candidatures

24. **src/app/dashboard/stats/page.tsx**
    - Dashboard avec 4 KPIs: Vues, Clics, Candidatures, Taux conversion

### Pages Dashboard - Communes

25. **src/app/dashboard/notifications/page.tsx**
    - Notifications utilisateur

26. **src/app/dashboard/settings/profile/page.tsx**
    - Gestion du profil: prénom, nom, email
    - Changement de mot de passe
    - Préférences de notification

27. **src/app/dashboard/help/page.tsx**
    - Centre d'aide
    - Liens: Centre d'aide, Support, FAQ, Email
    - FAQ rapide

---

## Architecture Générale

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── actions.ts
│   │   ├── register/
│   │   │   └── actions.ts
│   │   ├── forgot-password/
│   │   │   └── actions.ts
│   │   └── layout.tsx
│   ├── (public)/
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   ├── retiree-services/
│   │   │   ├── individuals/
│   │   │   └── companies/
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── listings/
│   │   ├── bookings/
│   │   ├── earnings/
│   │   ├── favorites/
│   │   ├── offers/
│   │   ├── applications/
│   │   ├── stats/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── help/
│   │   └── messages/
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   ├── ui/
│   │   └── card.tsx
│   └── ...
│
└── lib/
    ├── supabase/
    │   ├── client.ts
    │   └── server.ts
    ├── validation.ts
    └── utils.ts
```

---

## Features Implémentées

### Authentification
- Login avec Server Action
- Register avec création de profil
- Reset password
- Redirection basée sur l'authentification

### Navigation
- Header responsive avec menu mobile
- Navigation contextuelle par rôle
- Sidebar adaptée au rôle
- Footer complet avec liens légaux

### Dashboard
- Page d'accueil adaptée au rôle
- Sections spécifiques par rôle
- Quick actions pour créer contenu
- Gestion profil et paramètres

### UI Components
- Button réutilisable
- Input réutilisable
- Card réutilisable
- Responsive design

---

## Prochaines Étapes

1. Implémenter les formulaires de création (actions)
2. Ajouter les pages de détail (listing, offer, booking)
3. Implémenter la messagerie
4. Ajouter les pages légales (privacy, terms, etc.)
5. Intégrer les appels API Supabase
6. Ajouter la gestion des images
7. Implémenter les notifications
8. Ajouter la recherche et filtrage
