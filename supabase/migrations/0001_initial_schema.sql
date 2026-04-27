-- ============================================================
-- Yalla — Initial Schema
-- ============================================================
-- Run this in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/_/sql
--
-- Tables:
--   profiles  - extends auth.users
--   trips     - meetups someone is organizing
--   bookings  - join requests
-- ============================================================

-- ----- profiles --------------------------------------------------
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url  text,
  bio         text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ----- trips -----------------------------------------------------
CREATE TABLE trips (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            text NOT NULL,
  description      text,
  trip_type        text NOT NULL CHECK (trip_type IN ('travel', 'local', 'activity')),
  reasons          text[] NOT NULL DEFAULT '{}',
  starts_at        timestamptz NOT NULL,
  location_text    text,
  max_participants int NOT NULL DEFAULT 4 CHECK (max_participants BETWEEN 1 AND 20),
  status           text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'past')),
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX trips_status_starts_at_idx ON trips(status, starts_at DESC);
CREATE INDEX trips_owner_id_idx ON trips(owner_id);

-- ----- bookings --------------------------------------------------
CREATE TABLE bookings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message    text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trip_id, user_id)
);

CREATE INDEX bookings_trip_id_idx ON bookings(trip_id);
CREATE INDEX bookings_user_id_idx ON bookings(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- profiles: everyone can read, only you edit your own
CREATE POLICY "profiles readable by all"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "users insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- trips: open trips are public; closed/past visible to owner + attendees
CREATE POLICY "open trips readable by all, others by owner/attendees"
  ON trips FOR SELECT
  USING (
    status = 'open'
    OR auth.uid() = owner_id
    OR auth.uid() IN (
      SELECT user_id FROM bookings
      WHERE trip_id = trips.id AND status = 'accepted'
    )
  );

CREATE POLICY "users create their own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "owners update their own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "owners delete their own trips"
  ON trips FOR DELETE
  USING (auth.uid() = owner_id);

-- bookings: visible to the requester and the trip owner
CREATE POLICY "bookings readable by requester or trip owner"
  ON bookings FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT owner_id FROM trips WHERE id = trip_id)
  );

CREATE POLICY "users create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND auth.uid() != (SELECT owner_id FROM trips WHERE id = trip_id)
  );

-- Either party can update — but in practice only the owner accepts/declines
CREATE POLICY "trip owner updates booking status"
  ON bookings FOR UPDATE
  USING (
    auth.uid() IN (SELECT owner_id FROM trips WHERE id = trip_id)
    OR auth.uid() = user_id
  );

CREATE POLICY "user can withdraw their own booking"
  ON bookings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
