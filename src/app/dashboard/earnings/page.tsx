"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function EarningsPage() {
  const [notificationEmail, setNotificationEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotificationSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (notificationEmail) {
      setSubscribed(true);
      setNotificationEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Mes revenus</h1>
        <p className="text-neutral-text mt-3">Gérez vos paiements et suivez vos revenus</p>
      </div>

      {/* Hero Coming Soon Card */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-3xl border border-orange-200/50 p-10 md:p-16">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Les paiements arrivent bientôt
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Nous finalisons l'intégration de Stripe pour vous permettre de percevoir facilement vos revenus. Vous pourrez bientôt suivre, gérer et retirer vos paiements en temps réel.
              </p>
              <p className="text-base text-gray-600 mb-8">
                Soyez parmi les premiers à accéder à cette fonctionnalité. Inscrivez votre email ci-dessous pour recevoir une notification dès que les paiements seront disponibles.
              </p>

              {/* Notification Form */}
              <form onSubmit={handleNotificationSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:border-orange-500 focus:outline-none text-sm transition-colors"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  M'avertir
                </Button>
              </form>
              {subscribed && (
                <p className="mt-3 text-sm text-green-600 font-medium">
                  ✓ Merci! Vous recevrez une notification.
                </p>
              )}
            </div>

            {/* Right: Illustration (SVG) */}
            <div className="w-full md:w-72 h-64 md:h-auto flex items-center justify-center">
              <svg
                viewBox="0 0 300 280"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Wallet icon */}
                <rect
                  x="50"
                  y="80"
                  width="200"
                  height="130"
                  rx="20"
                  fill="#CC8800"
                  opacity="0.15"
                />
                <path
                  d="M70 100h160a10 10 0 0110 10v90a10 10 0 01-10 10H70a10 10 0 01-10-10v-90a10 10 0 0110-10z"
                  stroke="#CC8800"
                  strokeWidth="2"
                  fill="none"
                />
                <rect x="180" y="110" width="40" height="30" rx="4" fill="#CC8800" />
                <line x1="70" y1="135" x2="170" y2="135" stroke="#38761D" strokeWidth="2" />

                {/* Coins/Money elements */}
                <circle cx="60" cy="50" r="12" fill="#38761D" opacity="0.3" />
                <circle cx="100" cy="40" r="16" fill="#CC8800" opacity="0.2" />
                <circle cx="200" cy="35" r="14" fill="#38761D" opacity="0.25" />

                {/* Sparkles */}
                <g opacity="0.6">
                  <circle cx="150" cy="30" r="2" fill="#CC8800" />
                  <path d="M148 30h4M150 28v4" stroke="#CC8800" strokeWidth="1" />
                </g>
                <g opacity="0.5">
                  <circle cx="230" cy="70" r="2" fill="#38761D" />
                  <path d="M228 70h4M230 68v4" stroke="#38761D" strokeWidth="1" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section: What's Coming */}
      <div className="mb-12">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          Voici ce que vous pourrez faire
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mockup Card 1 */}
          <div className="rounded-3xl border border-gray-200 p-8 bg-white/50 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenus ce mois</h4>
            <p className="text-3xl font-bold text-gray-300 mb-2">— EUR</p>
            <p className="text-sm text-gray-400">En attente de configuration Stripe</p>
          </div>

          {/* Mockup Card 2 */}
          <div className="rounded-3xl border border-gray-200 p-8 bg-white/50 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenus total</h4>
            <p className="text-3xl font-bold text-gray-300 mb-2">— EUR</p>
            <p className="text-sm text-gray-400">Historique complet de vos gains</p>
          </div>

          {/* Mockup Card 3 */}
          <div className="rounded-3xl border border-gray-200 p-8 bg-white/50 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Paiements en attente</h4>
            <p className="text-3xl font-bold text-gray-300 mb-2">— EUR</p>
            <p className="text-sm text-gray-400">Retraits programmés et en cours</p>
          </div>

          {/* Mockup Card 4 */}
          <div className="rounded-3xl border border-gray-200 p-8 bg-white/50 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Taux de revenus</h4>
            <p className="text-3xl font-bold text-gray-300 mb-2">—%</p>
            <p className="text-sm text-gray-400">Moyenne par réservation</p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <Card className="rounded-3xl border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-2xl">Fonctionnalités à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold text-lg mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Paiements sécurisés</p>
                <p className="text-sm text-gray-600">Virements automatiques vers votre compte bancaire via Stripe</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold text-lg mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Suivi en temps réel</p>
                <p className="text-sm text-gray-600">Visualisez chaque transaction et votre solde disponible</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold text-lg mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Retraits flexibles</p>
                <p className="text-sm text-gray-600">Retirez vos revenus quand vous le souhaitez</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold text-lg mt-0.5">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Transparence complète</p>
                <p className="text-sm text-gray-600">Factures et relevés détaillés pour chaque paiement reçu</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
