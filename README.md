# יאללה

> פלטפורמה לשיתוף תוכניות ומפגשים. הולך לאנשהו? קח מישהו איתך.

זהו שלד פרויקט מוכן לעבודה — Next.js 15 + TypeScript + Tailwind + Supabase. ההמרה של `index.html` המקורי שלך לפרויקט מקצועי. כל הקוד בעברית/RTL, כל העיצוב נשמר.

---

## מה כלול בפרויקט

### תכונות
- ✅ הרשמה והתחברות (Supabase Auth)
- ✅ פיד תוכניות עם פילטרים (סוג + סיבה)
- ✅ יצירת תוכנית חדשה
- ✅ עמוד פרטי טיול
- ✅ בקשת הצטרפות + הודעה אופציונלית
- ✅ אישור/דחייה של בקשות (לבעל התוכנית)
- ✅ ביטול בקשה (למבקש)
- ✅ עמוד "התוכניות שלי" + "הצטרפתי"
- ✅ 9 תוכניות לדוגמה (seed data)
- ✅ Row Level Security על כל הטבלאות

### מבנה הפרויקט
```
yalla/
├── app/
│   ├── layout.tsx              # RTL, פונטים, header
│   ├── page.tsx                # פיד הראשי (Server Component)
│   ├── globals.css             # paper texture + base styles
│   ├── auth/
│   │   ├── login/page.tsx      # התחברות
│   │   └── signup/page.tsx     # הרשמה
│   ├── trips/
│   │   ├── actions.ts          # Server Actions (create/join/accept)
│   │   ├── new/                # יצירת תוכנית
│   │   └── [id]/               # פרטי תוכנית
│   └── my-trips/page.tsx       # תוכניות שלי
├── components/
│   ├── Header.tsx              # הכותרת + ניווט
│   ├── Feed.tsx                # פיד עם useState לפילטרים
│   ├── Filters.tsx             # רכיבי סינון
│   ├── TripCard.tsx            # כרטיס תוכנית
│   ├── TripCover.tsx           # 3 ה־SVG illustrations מהמקור
│   ├── Avatar.tsx              # ראשי תיבות עם צבעים
│   └── SignOutButton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # ל־client components
│   │   ├── server.ts           # ל־server components
│   │   ├── middleware.ts       # רענון session
│   │   └── types.ts            # Database + Trip + Profile types
│   └── utils.ts                # cn, פורמט תאריכים, צבעי avatar
├── supabase/migrations/
│   ├── 0001_initial_schema.sql # טבלאות + RLS + trigger
│   └── 0002_seed_demo_data.sql # 9 תוכניות לדוגמה
├── tailwind.config.ts          # כל הצבעים שלך מ־index.html
├── middleware.ts               # Supabase auth refresh
└── package.json
```

---

## התקנה (15 דקות)

### 1. Clone והתקנה של תלויות
```bash
cd yalla
npm install
```

### 2. צור פרויקט Supabase
- כנס ל־https://supabase.com/dashboard
- "New project" → בחר שם (למשל `yalla-dev`) ואזור (eu-central-1 הכי קרוב לישראל)
- חכה ~2 דקות עד שהפרויקט מוכן

### 3. הגדר משתני סביבה
```bash
cp .env.local.example .env.local
```

מתוך Supabase Dashboard → Project Settings → API, העתק:
- `NEXT_PUBLIC_SUPABASE_URL` = "Project URL"
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = "anon public" key

### 4. הרץ את ה־migrations
ב־Supabase Dashboard → SQL Editor → "New query":

1. **הדבק את התוכן של `supabase/migrations/0001_initial_schema.sql`** והרץ. צריך לראות "Success".
2. **הדבק את התוכן של `supabase/migrations/0002_seed_demo_data.sql`** והרץ.

בדוק ב־Table Editor — צריכות להיות 3 טבלאות: `profiles` (9 שורות), `trips` (9 שורות), `bookings` (ריקה).

### 5. הרץ את הפרויקט
```bash
npm run dev
```

פתח http://localhost:3000 — אמורות להופיע 9 תוכניות לדוגמה בעיצוב הנייר המוכר.

### 6. צור משתמש ראשון
- לחץ "התחברות" → "הרשמה"
- נתון מייל + סיסמה כלשהם (לא צריך אימות)
- חזור לדף הבית
- לחץ "+ שתף תוכנית" וצור תוכנית חדשה
- היא תופיע בפיד

---

## שלבי בנייה — מה הלאה

הפרויקט הזה הוא **שלב 1 מלא** מהמסמכים הקודמים. הוא מוכן לחברים שיתנסו.

### מה לעשות עכשיו
1. **תפרסם ל־Vercel** — קצר מאוד:
   ```bash
   npm install -g vercel
   vercel
   ```
   ב־Vercel תוסיף את אותם 2 משתני סביבה. תקבל URL חי לתת לחברים.

2. **תזמין 5-10 חברים אמיתיים** להירשם ולנסות. תפרסם תוכנית אמיתית (קפה, ריצה). תראה אם זה עובד.

3. **אספ פידבק** — איפה אנשים נתקעים? מה לא ברור? מה הם רוצים שיהיה?

### מה לעשות אחר כך (לפי סדר עדיפויות)
- **התראות אימייל** (Resend) — כשמישהו שולח בקשה, כשמישהו מאשר/דוחה
- **דיווח ובלוק** — בטיחות בסיסית
- **חיפוש לפי מיקום** — PostGIS ב־Supabase
- **שלב 2: מדריכים** — role נפרד, פרופיל מקצועי, סיורים בחינם בהתחלה
- **שלב 3: תשלומים** — Stripe Connect, רק אם יש validation למדריכים

---

## בעיות נפוצות

**"Failed to load trips" בקונסול**
ודא שה־migrations רצו ושטבלת trips קיימת.

**"Email not confirmed" בהתחברות**
ב־Supabase Dashboard → Authentication → Providers → Email — כבה את "Confirm email" לסביבת פיתוח.

**הפיד ריק אחרי seed**
ה־seed יוצר תוכניות עם `starts_at` בעתיד יחסי. אם הרצת אותו לפני זמן רב, הן עברו ל"past". פשוט הרץ שוב את `0002_seed_demo_data.sql`.

**RTL לא עובד נכון**
ודא שיש `dir="rtl"` על ה־`<html>` ב־`app/layout.tsx`. הקובץ כבר כתוב נכון.

---

## טיפים לפיתוח

- **Cursor / Claude Code:** השתמש בהם לעריכה. הם יודעים את הקוד הזה היטב.
- **Supabase Studio:** אל תפחד לעבוד עם ה־Table Editor — זה כלי מצוין.
- **Server Actions:** הרבה שינויי DB עוברים דרכן (`app/trips/actions.ts`). מקור אחד, type-safe, אין צורך ב־API routes.
- **RLS:** אם משהו לא נטען — בדוק ב־Supabase logs. סביר להניח שזו policy.
- **git:** קומיט אחרי כל שינוי שעובד. תרגיל קל לחזור אחורה.

---

## קישורים שימושיים

- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Tailwind cheatsheet: https://nerdcave.com/tailwind-cheat-sheet
- date-fns Hebrew locale: https://date-fns.org/v3.6.0/docs/I18n

---

נבנה עם 🧡 על בסיס ה־`index.html` המקורי.
