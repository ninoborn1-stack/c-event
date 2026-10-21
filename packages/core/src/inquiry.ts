import { z } from 'zod';
import { cartSchema } from './cart';
import { BUDGET_RANGES, INQUIRY_CATEGORIES, OCCASIONS } from './domain';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Bitte höchstens ${max} Zeichen.` })
    .optional()
    .transform((v) => (v ? v : undefined));

const emptyToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);

/**
 * EIN Schema für Client und Server. Das Formular validiert damit live,
 * die API validiert dieselben Daten noch einmal.
 */
export const inquiryInputSchema = z.object({
  category: z.enum(INQUIRY_CATEGORIES, { error: 'Bitte wähle eine Kategorie.' }),
  name: z.string().trim().min(2, { error: 'Bitte gib deinen Namen an.' }).max(120),
  company: optionalText(160),
  email: z.email({ error: 'Bitte gib eine gültige E-Mail-Adresse an.' }).max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+()\d\s/-]*$/, { error: 'Bitte nur Ziffern, Leerzeichen und + ( ) / -.' })
    .optional()
    .transform((v) => (v ? v : undefined)),
  occasion: z.preprocess(emptyToUndefined, z.enum(OCCASIONS).optional()),
  date: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Bitte ein gültiges Datum wählen.' })
      .optional(),
  ),
  dateFlexible: z.boolean().optional().default(false),
  location: optionalText(200),
  guests: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ error: 'Bitte eine Zahl angeben.' })
      .int({ error: 'Bitte eine ganze Zahl angeben.' })
      .min(1, { error: 'Mindestens 1 Gast.' })
      .max(100000)
      .optional(),
  ),
  budget: z.preprocess(emptyToUndefined, z.enum(BUDGET_RANGES).optional()),
  message: optionalText(4000),
  cart: cartSchema.optional().default([]),
  privacy: z.literal(true, { error: 'Bitte stimme der Datenschutzerklärung zu.' }),
  /** Honeypot: muss leer bleiben. */
  website: z.string().max(0).optional().default(''),
  /** Zeitpunkt, zu dem das Formular geöffnet wurde (Spam-Schutz). */
  startedAt: z.number().optional(),
});

export type InquiryFormValues = z.input<typeof inquiryInputSchema>;
export type InquiryInput = z.output<typeof inquiryInputSchema>;

export interface InquiryCartSnapshot {
  name: string;
  qty: number;
  unit: string;
  unitCents: number | null;
  totalCents: number | null;
  kind: 'item' | 'package';
}

export interface Inquiry extends Omit<InquiryInput, 'privacy' | 'website' | 'startedAt' | 'cart'> {
  id: string;
  createdAt: string;
  status: 'neu' | 'in-bearbeitung' | 'angebot-gesendet';
  cart: InquiryCartSnapshot[];
  cartSubtotalCents: number;
  cartHasOnRequest: boolean;
  consentAt: string;
}

/** Feldfehler als flaches Objekt { feld: meldung } – fürs Formular. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Einfacher Spam-Check zusätzlich zum Schema: Honeypot und Mindest-Ausfüllzeit. */
export function looksLikeSpam(input: { website?: string; startedAt?: number }, now = Date.now()): boolean {
  if (input.website) return true;
  if (input.startedAt && now - input.startedAt < 2500) return true;
  return false;
}
