// Types auto-generés depuis Supabase — sera remplacé par `npx supabase gen types`
// Types manuels basés sur le schéma du PRD — non self-referential pour compatibilité

export type UserRole = "retiree" | "client" | "company" | "admin";
export type FontSize = "normal" | "large" | "xlarge";
export type PriceType = "hourly" | "fixed" | "negotiable";
export type ServiceStatus = "draft" | "pending_review" | "published" | "paused" | "archived";
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed";
export type ContractType = "cdi_valorisation" | "cdd" | "mission" | "freelance" | "interim";
export type WorkSchedule = "full_time" | "part_time" | "flexible";
export type JobStatus = "draft" | "published" | "closed" | "archived";
export type ApplicationStatus = "applied" | "viewed" | "shortlisted" | "rejected" | "hired";
export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

// --- Row types (ce qu'on lit) ---

export interface UserProfileRow {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  city: string | null;
  department: string | null;
  latitude: number | null;
  longitude: number | null;
  bio: string | null;
  phone: string | null;
  date_of_birth: string | null;
  skills: string[];
  availability: Record<string, unknown>;
  travel_radius_km: number;
  company_name: string | null;
  siret: string | null;
  company_size: string | null;
  sector: string | null;
  average_rating: number;
  total_reviews: number;
  total_missions: number;
  response_rate: number;
  is_verified: boolean;
  is_super_pro: boolean;
  font_size: FontSize;
  notification_preferences: Record<string, unknown>;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceRow {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  price_type: PriceType;
  price_amount: number | null;
  city: string | null;
  department: string | null;
  availability_slots: Record<string, unknown>[];
  photos: string[];
  tags: string[];
  status: ServiceStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface BookingRow {
  id: string;
  service_id: string;
  client_id: string;
  provider_id: string;
  slot_start: string;
  slot_end: string;
  description: string | null;
  status: BookingStatus;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationRow {
  id: string;
  participant_ids: string[];
  last_message_at: string | null;
  created_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: Record<string, unknown>[];
  read_at: string | null;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  response: string | null;
  response_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

// --- Insert types (ce qu'on écrit) ---

export interface UserProfileInsert {
  id: string;
  role: UserRole;
  first_name: string;
  last_name?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  department?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bio?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  skills?: string[];
  availability?: Record<string, unknown>;
  travel_radius_km?: number;
  company_name?: string | null;
  siret?: string | null;
  company_size?: string | null;
  sector?: string | null;
  average_rating?: number;
  total_reviews?: number;
  total_missions?: number;
  response_rate?: number;
  is_verified?: boolean;
  is_super_pro?: boolean;
  font_size?: FontSize;
  notification_preferences?: Record<string, unknown>;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceInsert {
  provider_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string | null;
  price_type: PriceType;
  price_amount?: number | null;
  city?: string | null;
  department?: string | null;
  availability_slots?: Record<string, unknown>[];
  photos?: string[];
  tags?: string[];
  status?: ServiceStatus;
  id?: string;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BookingInsert {
  service_id: string;
  client_id: string;
  provider_id: string;
  slot_start: string;
  slot_end: string;
  description?: string | null;
  id?: string;
  status?: BookingStatus;
  cancellation_reason?: string | null;
  cancelled_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationInsert {
  participant_ids: string[];
  last_message_at?: string | null;
  id?: string;
  created_at?: string;
}

export interface MessageInsert {
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments?: Record<string, unknown>[];
  read_at?: string | null;
  id?: string;
  created_at?: string;
}

export interface ReviewInsert {
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  response?: string | null;
  response_at?: string | null;
  id?: string;
  created_at?: string;
}

export interface NotificationInsert {
  user_id: string;
  type: string;
  title: string;
  body?: string | null;
  data?: Record<string, unknown>;
  read_at?: string | null;
  id?: string;
  created_at?: string;
}

// --- Database interface pour Supabase ---

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfileRow;
        Insert: UserProfileInsert;
        Update: Partial<UserProfileInsert>;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: ServiceInsert;
        Update: Partial<ServiceInsert>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        Update: Partial<BookingInsert>;
        Relationships: [];
      };
      conversations: {
        Row: ConversationRow;
        Insert: ConversationInsert;
        Update: Partial<ConversationInsert>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: Partial<MessageInsert>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: ReviewInsert;
        Update: Partial<ReviewInsert>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: NotificationInsert;
        Update: Partial<NotificationInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
