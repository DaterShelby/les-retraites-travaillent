/**
 * Email utilities using Resend
 * Templates for transactional emails
 */

let resend: InstanceType<typeof import("resend").Resend> | null = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    const { Resend } = require("resend") as typeof import("resend");
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = "Les Retraités Travaillent <noreply@les-retraites-travaillent.fr>";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://les-retraites-travaillent.netlify.app";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    // In dev without API key, just log
    return { success: true, dev: true };
  }

  try {
    const client = getResend();
    if (!client) return { success: true, dev: true };
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: wrapInTemplate(subject, html),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur d'envoi";
    return { success: false, error: message };
  }
}

function wrapInTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #FAF7F5; font-family: 'Source Sans Pro', -apple-system, sans-serif; color: #2F3D42; }
    .container { max-width: 580px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #FFFFFF; border-radius: 20px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo-text { font-family: 'Libre Baskerville', Georgia, serif; font-size: 22px; color: #4A6670; font-weight: 700; }
    h1 { font-family: 'Libre Baskerville', Georgia, serif; color: #4A6670; font-size: 24px; margin: 0 0 16px; }
    p { font-size: 16px; line-height: 1.6; color: #2F3D42; margin: 0 0 16px; }
    .btn { display: inline-block; padding: 14px 28px; background: #F0917B; color: #FFFFFF; text-decoration: none; border-radius: 16px; font-weight: 600; font-size: 16px; }
    .btn:hover { background: #D96850; }
    .footer { text-align: center; margin-top: 32px; font-size: 13px; color: #9CA3AF; }
    .footer a { color: #4A6670; }
    .divider { height: 1px; background: #F3F4F6; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <span class="logo-text">Les Retraités Travaillent</span>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Les Retraités Travaillent</p>
      <p>
        <a href="${SITE_URL}/legal/confidentialite">Politique de confidentialité</a> ·
        <a href="${SITE_URL}/legal/cgu">CGU</a>
      </p>
      <p>Vous recevez cet email car vous avez un compte sur notre plateforme.</p>
    </div>
  </div>
</body>
</html>`;
}

// --- Email Templates ---

export async function sendWelcomeEmail(to: string, firstName: string) {
  return sendEmail({
    to,
    subject: `Bienvenue ${firstName} sur Les Retraités Travaillent !`,
    html: `
      <h1>Bienvenue ${firstName} !</h1>
      <p>Nous sommes ravis de vous accueillir sur <strong>Les Retraités Travaillent</strong>.</p>
      <p>Votre compte est créé et prêt à l'emploi. Complétez votre profil pour commencer à recevoir des demandes ou trouver des services.</p>
      <div class="divider"></div>
      <p style="text-align: center;">
        <a href="${SITE_URL}/dashboard" class="btn">Accéder à mon espace</a>
      </p>
    `,
  });
}

export async function sendBookingConfirmationEmail(
  to: string,
  firstName: string,
  serviceTitle: string,
  date: string,
  providerName: string
) {
  return sendEmail({
    to,
    subject: `Réservation confirmée — ${serviceTitle}`,
    html: `
      <h1>Réservation confirmée</h1>
      <p>Bonjour ${firstName},</p>
      <p>Votre réservation a été confirmée :</p>
      <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin: 16px 0;">
        <p style="margin: 0 0 8px;"><strong>Service :</strong> ${serviceTitle}</p>
        <p style="margin: 0 0 8px;"><strong>Date :</strong> ${date}</p>
        <p style="margin: 0;"><strong>Prestataire :</strong> ${providerName}</p>
      </div>
      <p>Vous pouvez contacter ${providerName} via la messagerie de la plateforme.</p>
      <div class="divider"></div>
      <p style="text-align: center;">
        <a href="${SITE_URL}/dashboard/bookings" class="btn">Voir mes réservations</a>
      </p>
    `,
  });
}

export async function sendNewMessageEmail(
  to: string,
  firstName: string,
  senderName: string,
  preview: string
) {
  return sendEmail({
    to,
    subject: `Nouveau message de ${senderName}`,
    html: `
      <h1>Nouveau message</h1>
      <p>Bonjour ${firstName},</p>
      <p><strong>${senderName}</strong> vous a envoyé un message :</p>
      <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin: 16px 0; font-style: italic;">
        "${preview.slice(0, 200)}${preview.length > 200 ? "..." : ""}"
      </div>
      <div class="divider"></div>
      <p style="text-align: center;">
        <a href="${SITE_URL}/dashboard/messages" class="btn">Répondre</a>
      </p>
    `,
  });
}

export async function sendReviewReceivedEmail(
  to: string,
  firstName: string,
  reviewerName: string,
  rating: number,
  serviceTitle: string
) {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return sendEmail({
    to,
    subject: `Nouvel avis reçu — ${stars}`,
    html: `
      <h1>Nouvel avis reçu</h1>
      <p>Bonjour ${firstName},</p>
      <p><strong>${reviewerName}</strong> a laissé un avis sur votre service <strong>${serviceTitle}</strong> :</p>
      <div style="text-align: center; font-size: 28px; margin: 16px 0; color: #F59E0B;">
        ${stars}
      </div>
      <div class="divider"></div>
      <p style="text-align: center;">
        <a href="${SITE_URL}/dashboard/reviews" class="btn">Voir l'avis</a>
      </p>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendEmail({
    to,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <h1>Réinitialisation du mot de passe</h1>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${resetLink}" class="btn">Réinitialiser mon mot de passe</a>
      </p>
      <p style="font-size: 14px; color: #6B7280;">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `,
  });
}

export async function sendNewsletterWelcomeEmail(to: string) {
  return sendEmail({
    to,
    subject: "Bienvenue dans notre newsletter !",
    html: `
      <h1>Vous êtes inscrit(e) !</h1>
      <p>Merci de vous être inscrit(e) à la newsletter de <strong>Les Retraités Travaillent</strong>.</p>
      <p>Vous recevrez régulièrement :</p>
      <ul style="line-height: 2; margin: 16px 0;">
        <li>Les nouveaux services près de chez vous</li>
        <li>Des conseils pour le cumul emploi-retraite</li>
        <li>Des témoignages inspirants</li>
        <li>Les dernières actualités de la plateforme</li>
      </ul>
      <div class="divider"></div>
      <p style="text-align: center;">
        <a href="${SITE_URL}" class="btn">Découvrir les services</a>
      </p>
    `,
  });
}
