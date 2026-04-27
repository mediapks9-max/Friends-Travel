-- ============================================================
-- Yalla — Seed Data
-- ============================================================
-- Run this AFTER 0001_initial_schema.sql.
-- Creates 6 demo profiles + the 9 sample trips from your original index.html.
--
-- IMPORTANT: This bypasses Supabase Auth signup — these profiles
-- aren't real users and can't log in. They exist only for the
-- demo feed so the app isn't empty before you have users.
--
-- After your first real user signs up, you can delete these by
-- running:
--   DELETE FROM profiles WHERE id IN (
--     '00000000-0000-0000-0000-000000000001',
--     '00000000-0000-0000-0000-000000000002',
--     ...etc
--   );
-- ============================================================

-- We need to insert into auth.users first because profiles.id is FK.
-- Using a function to create demo users without going through signup flow.
DO $$
DECLARE
  noa_id   uuid := '00000000-0000-0000-0000-000000000001';
  yonatan_id uuid := '00000000-0000-0000-0000-000000000002';
  michal_id  uuid := '00000000-0000-0000-0000-000000000003';
  itai_id    uuid := '00000000-0000-0000-0000-000000000004';
  tamar_id   uuid := '00000000-0000-0000-0000-000000000005';
  avi_id     uuid := '00000000-0000-0000-0000-000000000006';
  hila_id    uuid := '00000000-0000-0000-0000-000000000007';
  daniel_id  uuid := '00000000-0000-0000-0000-000000000008';
  yael_id    uuid := '00000000-0000-0000-0000-000000000009';
BEGIN
  -- Insert demo auth users (will fail if already exist — that's fine)
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role, created_at, updated_at)
  VALUES
    (noa_id,     '00000000-0000-0000-0000-000000000000', 'demo-noa@yalla.local',     '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (yonatan_id, '00000000-0000-0000-0000-000000000000', 'demo-yonatan@yalla.local', '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (michal_id,  '00000000-0000-0000-0000-000000000000', 'demo-michal@yalla.local',  '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (itai_id,    '00000000-0000-0000-0000-000000000000', 'demo-itai@yalla.local',    '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (tamar_id,   '00000000-0000-0000-0000-000000000000', 'demo-tamar@yalla.local',   '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (avi_id,     '00000000-0000-0000-0000-000000000000', 'demo-avi@yalla.local',     '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (hila_id,    '00000000-0000-0000-0000-000000000000', 'demo-hila@yalla.local',    '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (daniel_id,  '00000000-0000-0000-0000-000000000000', 'demo-daniel@yalla.local',  '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now()),
    (yael_id,    '00000000-0000-0000-0000-000000000000', 'demo-yael@yalla.local',    '', now(), '{}'::jsonb, 'authenticated', 'authenticated', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- Trigger creates profiles automatically — but with split email name.
  -- Update them to friendly names:
  UPDATE profiles SET display_name = 'נועה ל.'    WHERE id = noa_id;
  UPDATE profiles SET display_name = 'יונתן ש.'   WHERE id = yonatan_id;
  UPDATE profiles SET display_name = 'מיכל ד.'    WHERE id = michal_id;
  UPDATE profiles SET display_name = 'איתי כ.'    WHERE id = itai_id;
  UPDATE profiles SET display_name = 'תמר ב.'     WHERE id = tamar_id;
  UPDATE profiles SET display_name = 'אבי ר.'     WHERE id = avi_id;
  UPDATE profiles SET display_name = 'הילה מ.'    WHERE id = hila_id;
  UPDATE profiles SET display_name = 'דניאל פ.'   WHERE id = daniel_id;
  UPDATE profiles SET display_name = 'יעל ק.'     WHERE id = yael_id;

  -- Insert 9 sample trips (from your original SAMPLE_PLANS).
  -- starts_at uses relative future dates so the demo feed always shows upcoming trips.
  INSERT INTO trips (owner_id, title, description, trip_type, reasons, starts_at, location_text, max_participants) VALUES
    (noa_id, 'מצדה לזריחה ואז ים המלח',
     'עולים בשביל הסולם לזריחה. אחרי זה ארוחת בוקר באכסניה ושעתיים ציפה בים המלח. יש לי רכב — מחפש 2 אנשים שיתחלקו בדלק.',
     'travel', ARRAY['חברה','חלוקת הוצאות','תמונות']::text[],
     now() + interval '6 days' + interval '3 hours', 'מצדה — ים המלח', 3),

    (yonatan_id, 'בוקר רגוע בקפליקס',
     'מביא ספר ולפטופ לכמה שעות. פתוח לדבר אם מישהו עובד מרחוק או רק רוצה להתעדכן בקפה הכי טוב באזור.',
     'local', ARRAY['חברה','להכיר אנשים']::text[],
     now() + interval '1 day' + interval '10 hours', 'קפה קפליקס שלמה המלך, תל אביב', 2),

    (michal_id, 'ערב טיפוס, כל הרמות',
     'מתכנן 2 שעות. אני ברמה בינונית (5+ עד 6א), שמח לאבטח מתחילים או לדחוף עם מישהו חזק יותר. נעליים אפשר לשכור במקום.',
     'activity', ARRAY['תרגול','חברה']::text[],
     now() + interval '3 days' + interval '19 hours', 'בולדר תל אביב, פלורנטין', 4),

    (itai_id, 'סופ״ש במדבר',
     'יש לי הזמנה לאוהל בדואי במצפה רמון. שביל באמצע המכתש שישי, עין עבדת שבת, חוזרים מוצ״ש. צריך עוד 2 אנשים לחלוקת רכב והאוהל. תביאו שק שינה.',
     'travel', ARRAY['חברה','חלוקת הוצאות','טיפים מקומיים']::text[],
     now() + interval '12 days', 'מכתש רמון + עין עבדת', 2),

    (tamar_id, 'ריצה קלה 5 ק״מ + קפה',
     'קצב נינוח (6:30 לק״מ), בלי לחץ. הקפה אחרי זה זה כל הסיפור. גשם? יוצאים בכל זאת. נפגשים בכניסה ליד גן הסלע.',
     'activity', ARRAY['תרגול','להכיר אנשים']::text[],
     now() + interval '6 days' + interval '9 hours', 'פארק הירקון, גן יהושע', 6),

    (avi_id, 'סבב בשוק, אז בורקס',
     'הולך כל שישי — מכיר את הדוכנים הטובים. שמח לקחת מישהו חדש בשכונה ולהראות איפה הקפה הכי טוב. מסיימים בבורקסים אצל פרץ.',
     'local', ARRAY['טיפים מקומיים','חברה']::text[],
     now() + interval '5 days' + interval '9 hours', 'שוק הכרמל, תל אביב', 3),

    (hila_id, 'סרט ובירה אחרי',
     'הולך לסרט צרפתי בסינמטק — מחפש מישהו שבאמת רוצה לדבר עליו אחרי בפאב. כתוביות באנגלית, אז גם עולים חדשים בסדר.',
     'activity', ARRAY['חברה','להכיר אנשים','תרגול']::text[],
     now() + interval '4 days' + interval '20 hours', 'סינמטק תל אביב', 2),

    (daniel_id, 'יהודיה — קופצים למים',
     'מסלול ארוך עם קפיצות לבריכות. מתאים למי שיודע לשחות. יוצאים מתל אביב 06:00, חוזרים בערב. צריך 2 שיתחלקו בדלק. תביאו שיכפצים וכובע.',
     'travel', ARRAY['חלוקת הוצאות','חברה']::text[],
     now() + interval '6 days' + interval '6 hours', 'נחל יהודיה, רמת הגולן', 2),

    (yael_id, 'הליכה בנמל + ארוחת בוקר',
     'מתחילים בנמל, הולכים עד הירקון וחוזרים. ארוחת בוקר במגדלור (יש להם פוקצ׳ה רצינית). שעתיים-שלוש סך הכל.',
     'local', ARRAY['חברה','להכיר אנשים']::text[],
     now() + interval '6 days' + interval '8 hours', 'נמל תל אביב, מגדלור', 4);
END $$;
