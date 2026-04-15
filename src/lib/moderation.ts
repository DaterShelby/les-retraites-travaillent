/**
 * Chat moderation utilities
 * Detects phone numbers, email addresses, and other sensitive data
 * in messages before they are sent.
 */

interface ModerationResult {
  isClean: boolean;
  warnings: string[];
  sanitizedMessage: string;
}

// French phone patterns: 06/07, +33, 0033, with various separators
const PHONE_PATTERNS = [
  /(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}/g,
  /\d{2}[\s.-]\d{2}[\s.-]\d{2}[\s.-]\d{2}[\s.-]\d{2}/g,
  /(?:\+\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g,
];

// Email pattern
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// URL pattern
const URL_PATTERN = /https?:\/\/[^\s]+/gi;

// Social media handles
const SOCIAL_PATTERN = /(?:@[a-zA-Z0-9_]{3,}|(?:facebook|instagram|twitter|whatsapp|telegram|snapchat)[\s.:\/]+[a-zA-Z0-9._-]+)/gi;

function detectPhoneNumbers(text: string): string[] {
  const matches: string[] = [];
  for (const pattern of PHONE_PATTERNS) {
    const found = text.match(pattern);
    if (found) {
      // Filter out short matches that are likely not phone numbers
      found
        .filter((m) => m.replace(/[\s.-]/g, "").length >= 10)
        .forEach((m) => matches.push(m));
    }
  }
  return [...new Set(matches)];
}

function detectEmails(text: string): string[] {
  const matches = text.match(EMAIL_PATTERN);
  return matches ? [...new Set(matches)] : [];
}

function detectUrls(text: string): string[] {
  const matches = text.match(URL_PATTERN);
  return matches ? [...new Set(matches)] : [];
}

function detectSocialHandles(text: string): string[] {
  const matches = text.match(SOCIAL_PATTERN);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Moderate a message before sending.
 * Returns warnings but does NOT block — the user is shown a warning
 * and can choose to proceed.
 */
export function moderateMessage(message: string): ModerationResult {
  const warnings: string[] = [];
  let sanitized = message;

  const phones = detectPhoneNumbers(message);
  if (phones.length > 0) {
    warnings.push(
      "Votre message contient un numéro de téléphone. Pour votre sécurité, nous vous recommandons d'échanger via la messagerie de la plateforme."
    );
  }

  const emails = detectEmails(message);
  if (emails.length > 0) {
    warnings.push(
      "Votre message contient une adresse email. Pour votre protection, nous vous conseillons de garder vos échanges sur la plateforme."
    );
  }

  const urls = detectUrls(message);
  if (urls.length > 0) {
    warnings.push(
      "Votre message contient un lien. Soyez prudent avec les liens partagés dans les conversations."
    );
  }

  const socials = detectSocialHandles(message);
  if (socials.length > 0) {
    warnings.push(
      "Votre message contient un identifiant de réseau social. Pour votre sécurité, échangez via la messagerie de la plateforme."
    );
  }

  return {
    isClean: warnings.length === 0,
    warnings,
    sanitizedMessage: sanitized,
  };
}

/**
 * Check if a file is allowed for upload in chat
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateChatFile(file: File): FileValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Type de fichier non autorisé (${file.type}). Formats acceptés : images (JPEG, PNG, GIF, WebP), PDF, Word.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Fichier trop volumineux (${sizeMB} Mo). Taille maximale : 10 Mo.`,
    };
  }

  return { isValid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
