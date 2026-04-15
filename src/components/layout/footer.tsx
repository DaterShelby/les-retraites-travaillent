"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, ArrowRight, Check } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Merci !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Erreur");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion");
    }
  };

  return (
    <footer className="bg-[#3B2F2F] text-gray-300 mt-16">
      {/* Newsletter Banner */}
      <div className="bg-[#2C3E50]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-white font-serif text-xl font-bold mb-1">
                Restez informé(e)
              </h3>
              <p className="text-white/70 text-sm">
                Recevez nos conseils, nouveaux services et actualités chaque semaine.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="Votre adresse email"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-3 rounded-2xl bg-[#CC8800] text-white font-semibold hover:bg-[#A66E00] transition-all flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {status === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {status === "loading" ? "..." : status === "success" ? "Inscrit !" : "S'inscrire"}
                </span>
              </button>
            </form>
          </div>
          {message && (
            <p className={`text-sm mt-3 ${status === "error" ? "text-red-300" : "text-white/80"}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-serif text-lg font-bold mb-4">
              Les Retraités Travaillent
            </h3>
            <p className="text-sm text-gray-400">
              Connecter les retraités avec les particuliers et entreprises qui ont besoin de services et compétences.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-base mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/retiree-services" className="text-gray-400 hover:text-white transition-colors">
                  Services de retraités
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Parcourir les offres
                </Link>
              </li>
              <li>
                <Link href="/services/companies" className="text-gray-400 hover:text-white transition-colors">
                  Entreprises
                </Link>
              </li>
              <li>
                <Link href="/services/individuals" className="text-gray-400 hover:text-white transition-colors">
                  Particuliers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-base mb-4">À propos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/comment-ca-marche" className="text-gray-400 hover:text-white transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/legal/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/legal/cgu" className="text-gray-400 hover:text-white transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/legal/confidentialite" className="text-gray-400 hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-base mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-[#38761D] flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@lesretraiteestravaillent.fr" className="text-gray-400 hover:text-white transition-colors">
                  contact@lesretraiteestravaillent.fr
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-[#38761D] flex-shrink-0 mt-0.5" />
                <a href="tel:+33123456789" className="text-gray-400 hover:text-white transition-colors">
                  +33 (0)1 23 45 67 89
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#38761D] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <Link href="/legal/confidentialite" className="text-gray-400 hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-gray-600">·</span>
            <Link href="/legal/cgu" className="text-gray-400 hover:text-white transition-colors">
              Conditions d&apos;utilisation
            </Link>
            <span className="text-gray-600">·</span>
            <Link href="/legal/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
              Mentions légales
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {currentYear} Les Retraités Travaillent. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
