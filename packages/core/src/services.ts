import type { Catalog, DayAvailability, SiteSettings } from './domain';
import type { Inquiry, InquiryInput } from './inquiry';

/**
 * Service-Interfaces. Die UI und die API kennen nur diese Verträge.
 * Demo: packages/services-demo. Live: später eigene Implementierungen
 * (Mailversand, Kalender, CMS), ohne dass sich UI oder API ändern.
 */
export interface InquiryService {
  create(input: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry>;
  get(id: string): Promise<Inquiry | null>;
  list(): Promise<Inquiry[]>;
}

export interface OutgoingMail {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /** z. B. „kunde-bestaetigung“, „agentur-anfrage“ */
  kind: string;
  inquiryId?: string;
}

export interface SentMail extends OutgoingMail {
  id: string;
  sentAt: string;
  transport: 'demo-postfach' | 'live';
}

export interface MailService {
  send(mail: OutgoingMail): Promise<SentMail>;
  /** Nur Demo: alle „gesendeten“ Mails. Live-Implementierungen geben [] zurück. */
  list(): Promise<SentMail[]>;
}

export interface AvailabilityService {
  getRange(from: string, to: string): Promise<DayAvailability[]>;
}

export interface CatalogService {
  getCatalog(): Promise<Catalog>;
}

export interface SettingsService {
  get(): Promise<SiteSettings>;
}

export interface Services {
  mode: 'demo' | 'live';
  inquiries: InquiryService;
  mail: MailService;
  availability: AvailabilityService;
  catalog: CatalogService;
  settings: SettingsService;
}

export type { InquiryInput };
