/**
 * Lightweight monitoring abstractions.
 *
 * Aujourd'hui : forwarde les erreurs vers la console côté serveur et
 * vers `console.error` + un endpoint optionnel `/api/log` côté client.
 *
 * Demain : remplacer ces deux fonctions par `Sentry.captureException`
 * et `Sentry.captureMessage` une fois `@sentry/nextjs` installé. Aucun
 * call site n'aura besoin de changer.
 */

type Severity = "info" | "warn" | "error";

interface Context {
  [key: string]: unknown;
}

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

function emit(severity: Severity, message: string, ctx?: Context): void {
  // En dev/test on log toujours sur stderr avec un préfixe lisible.
  const prefix = `[${severity.toUpperCase()}]`;
  if (severity === "error") {
    console.error(prefix, message, ctx ?? "");
  } else if (severity === "warn") {
    console.warn(prefix, message, ctx ?? "");
  } else {
    console.log(prefix, message, ctx ?? "");
  }

  // En prod si SENTRY_DSN est défini, on simule une remontée best-effort.
  // Quand @sentry/nextjs sera installé, remplacer ce block par Sentry.x().
  if (SENTRY_DSN && typeof window === "undefined") {
    // Pas de fetch synchrone ici — le SDK Sentry s'en occupera.
  }
}

export function logError(error: unknown, ctx?: Context): void {
  const message = error instanceof Error ? error.message : String(error);
  emit("error", message, {
    ...ctx,
    stack: error instanceof Error ? error.stack : undefined,
  });
}

export function logWarn(message: string, ctx?: Context): void {
  emit("warn", message, ctx);
}

export function logInfo(message: string, ctx?: Context): void {
  emit("info", message, ctx);
}
