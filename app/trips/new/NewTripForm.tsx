"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTrip, type CreateTripState } from "../actions";

const initialState: CreateTripState = {};

const REASONS = [
  "חברה",
  "טיפים מקומיים",
  "חלוקת הוצאות",
  "תרגול",
  "להכיר אנשים",
  "תמונות",
];

export function NewTripForm() {
  const [state, formAction] = useFormState(createTrip, initialState);

  return (
    <form action={formAction} className="paper-card p-6 space-y-5">
      <Field label="כותרת" required>
        <input
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={120}
          placeholder="למשל: רכיבת אופניים בעמק האלה"
          className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
        />
      </Field>

      <Field label="סוג תוכנית" required>
        <div className="flex gap-2 flex-wrap">
          <Radio name="trip_type" value="local" defaultChecked label="📍 מקומי" />
          <Radio name="trip_type" value="travel" label="✈ טיול" />
          <Radio name="trip_type" value="activity" label="✦ פעילות" />
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="מתי" required>
          <input
            name="starts_at"
            type="datetime-local"
            required
            className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
          />
        </Field>

        <Field label="כמה משתתפים" required>
          <input
            name="max_participants"
            type="number"
            required
            min={1}
            max={20}
            defaultValue={4}
            className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
          />
        </Field>
      </div>

      <Field label="איפה">
        <input
          name="location_text"
          type="text"
          maxLength={200}
          placeholder="קפה קפליקס שלמה המלך, תל אביב"
          className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
        />
      </Field>

      <Field label="תיאור — מה התוכנית?">
        <textarea
          name="description"
          rows={4}
          maxLength={1000}
          placeholder="הולכים לסיבוב, אוכלים בורקס בדרך, חוזרים בלי לחץ."
          className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none resize-none"
        />
      </Field>

      <Field label="למה להיפגש? (סמן כל מה שמתאים)">
        <div className="flex gap-2 flex-wrap">
          {REASONS.map((reason) => (
            <Checkbox
              key={reason}
              name="reasons"
              value={reason}
              label={reason}
            />
          ))}
        </div>
      </Field>

      {state.error && (
        <div className="bg-accent/10 border-r-4 border-accent text-accent-deep text-sm p-3 rounded-sm">
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1.5">
        {label}
        {required && <span className="text-accent mr-1">*</span>}
      </div>
      {children}
    </label>
  );
}

function Radio({
  name,
  value,
  label,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="inline-block px-3 py-1.5 text-sm border border-line/40 bg-paper rounded-sm peer-checked:bg-ink peer-checked:text-paper peer-checked:border-ink transition-colors">
        {label}
      </span>
    </label>
  );
}

function Checkbox({
  name,
  value,
  label,
}: {
  name: string;
  value: string;
  label: string;
}) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" name={name} value={value} className="peer sr-only" />
      <span className="inline-block px-3 py-1.5 text-sm border border-line/40 bg-paper rounded-sm peer-checked:bg-gold/30 peer-checked:border-gold transition-colors">
        {label}
      </span>
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-ink text-paper py-3 font-semibold hover:bg-accent transition-colors disabled:opacity-60"
    >
      {pending ? "מפרסם..." : "פרסם תוכנית"}
    </button>
  );
}
