import Script from "next/script";

/**
 * Plausible Analytics — chargement conditionnel.
 * Aucun cookie, conforme RGPD, pas besoin de bandeau.
 *
 * Configurer via :
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=les-retraites-travaillent.fr
 *   NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/script.js (optionnel)
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const scriptUrl =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ||
    "https://plausible.io/js/script.js";
  if (!domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src={scriptUrl}
      strategy="afterInteractive"
    />
  );
}
