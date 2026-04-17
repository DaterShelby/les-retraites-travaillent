import type Anthropic from "@anthropic-ai/sdk";

/**
 * Tool definitions exposed to Claude.
 * Implementation lives server-side in `src/app/api/chat/tools/`.
 *
 * Naming convention: snake_case verbs to match Claude's training data.
 */

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_services",
    description:
      "Recherche des services proposés par des retraités. Utilise quand l'utilisateur cherche un expert ou un service précis.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Mots-clés de recherche (ex : 'jardinage potager').",
        },
        category: {
          type: "string",
          description: "Filtre par catégorie (bricolage, jardinage, informatique, etc.).",
        },
        city: {
          type: "string",
          description: "Filtre par ville (ex : 'Lyon').",
        },
        max_price: {
          type: "number",
          description: "Tarif horaire maximum en euros.",
        },
        limit: {
          type: "number",
          description: "Nombre max de résultats (défaut 5).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_retirees",
    description:
      "Recherche des retraités disponibles selon des critères. Utile pour les entreprises ou clients cherchant un profil.",
    input_schema: {
      type: "object" as const,
      properties: {
        skills: {
          type: "array",
          items: { type: "string" },
          description: "Compétences recherchées.",
        },
        city: { type: "string", description: "Ville." },
        radius_km: { type: "number", description: "Rayon en km." },
        limit: { type: "number", description: "Nombre max (défaut 5)." },
      },
      required: [],
    },
  },
  {
    name: "list_my_bookings",
    description:
      "Liste les réservations de l'utilisateur connecté (en attente, confirmées, terminées).",
    input_schema: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          enum: ["pending", "confirmed", "in_progress", "completed", "cancelled", "all"],
          description: "Filtre par statut. 'all' pour tout.",
        },
        limit: { type: "number", description: "Nombre max (défaut 10)." },
      },
      required: [],
    },
  },
  {
    name: "create_booking",
    description:
      "Crée une réservation pour un service. À utiliser SEULEMENT après confirmation explicite de l'utilisateur.",
    input_schema: {
      type: "object" as const,
      properties: {
        service_id: { type: "string", description: "UUID du service." },
        scheduled_at: {
          type: "string",
          description: "Date+heure ISO 8601 (ex : 2026-05-12T14:00:00Z).",
        },
        message: {
          type: "string",
          description: "Message au prestataire (≥10 caractères).",
        },
        estimated_duration_min: {
          type: "number",
          description: "Durée estimée en minutes.",
        },
      },
      required: ["service_id", "scheduled_at", "message"],
    },
  },
  {
    name: "send_message",
    description:
      "Envoie un message dans une conversation existante avec un autre utilisateur de la plateforme.",
    input_schema: {
      type: "object" as const,
      properties: {
        conversation_id: { type: "string", description: "UUID de la conversation." },
        content: { type: "string", description: "Contenu du message." },
      },
      required: ["conversation_id", "content"],
    },
  },
  {
    name: "get_my_stats",
    description:
      "Récupère les statistiques de l'utilisateur (revenus, missions, taux de réponse, conformité 5%).",
    input_schema: {
      type: "object" as const,
      properties: {
        period: {
          type: "string",
          enum: ["week", "month", "quarter", "year"],
          description: "Période (défaut 'month').",
        },
      },
      required: [],
    },
  },
];

export type ToolName =
  | "search_services"
  | "search_retirees"
  | "list_my_bookings"
  | "create_booking"
  | "send_message"
  | "get_my_stats";

/**
 * Tools that require user confirmation before execution.
 * These will trigger a "confirm" UI in the chat instead of running directly.
 */
export const CONFIRM_REQUIRED: ReadonlySet<ToolName> = new Set([
  "create_booking",
  "send_message",
]);
