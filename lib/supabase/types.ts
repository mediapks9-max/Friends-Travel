// TypeScript types for the Supabase database.
// You can regenerate these later with:
//   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts

export type TripType = "travel" | "local" | "activity";

export type TripReason =
  | "חברה"
  | "חלוקת הוצאות"
  | "טיפים מקומיים"
  | "תרגול"
  | "להכיר אנשים"
  | "תמונות";

export type TripStatus = "open" | "closed" | "past";
export type BookingStatus = "pending" | "accepted" | "declined";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          trip_type: TripType;
          reasons: TripReason[];
          starts_at: string;
          location_text: string | null;
          max_participants: number;
          status: TripStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string | null;
          trip_type: TripType;
          reasons?: TripReason[];
          starts_at: string;
          location_text?: string | null;
          max_participants?: number;
          status?: TripStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          description?: string | null;
          trip_type?: TripType;
          reasons?: TripReason[];
          starts_at?: string;
          location_text?: string | null;
          max_participants?: number;
          status?: TripStatus;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          status: BookingStatus;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id: string;
          status?: BookingStatus;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          user_id?: string;
          status?: BookingStatus;
          message?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

// Convenience types — what we actually use in components.
// These extend the DB types with joined data.

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Trip = Database["public"]["Tables"]["trips"]["Row"] & {
  owner: Profile;
  attendees?: Profile[];
  pending_count?: number;
  has_joined?: boolean;
  is_mine?: boolean;
};

export type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
  user: Profile;
};
