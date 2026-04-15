"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-serif text-lg font-bold mb-4">
              Les Retraités Travaillent
            </h3>
            <p className="text-sm text-gray-400">
              Connecter les retraités avec les particuliers et entreprises qui ont besoin de services et compétences.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/retiree-services" className="text-gray-400 hover:text-white transition-colors">
                  Services de retraités
                </Link>
              </li>
              <li>
                <Link href="/services/browse" className="text-gray-400 hover:text-white transition-colors">
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

          {/* About Company */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">À propos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@lesretraiteestravaillent.fr" className="text-gray-400 hover:text-white transition-colors">
                  contact@lesretraiteestravaillent.fr
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="tel:+33123456789" className="text-gray-400 hover:text-white transition-colors">
                  +33 (0)1 23 45 67 89
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Paris, France
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <Link href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/legal/terms" className="text-gray-400 hover:text-white transition-colors">
              Conditions d&apos;utilisation
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/legal/cookies" className="text-gray-400 hover:text-white transition-colors">
              Gestion des cookies
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/legal/accessibility" className="text-gray-400 hover:text-white transition-colors">
              Accessibilité
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500">
            <p>
              &copy; {currentYear} Les Retraités Travaillent. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
