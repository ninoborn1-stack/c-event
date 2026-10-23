import type { Catalog, DayAvailability, ReviewSummary, SiteSettings, SocialFeed } from './domain';
import type { Inquiry, InquiryInput, InquiryStatus } from './inquiry';

/**
 * Service-Interfaces. Die UI und die API kennen nur diese Verträge.
 * Demo: packages/services-demo. Live: später eigene Implementierungen
 * (Mailversand, Kalender, CMS), ohne dass sich UI oder API ändern.
 */
export interface InquiryService {
  create(input: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry>;
  get(id: string): Promise<Inquiry | null>;
  list(): Promise<Inquiry[]>;
  /** Admin: Status und interne Notizen ändern. */
  update(id: string, patch: { status?: InquiryStatus; adminNotes?: string }): Promise<Inquiry | null>;
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

/** Social Feed (Demo: Beispielposts, live: Instagram Graph API). */
export interface SocialFeedService {
  getFeed(limit?: number): Promise<SocialFeed>;
}

/** Rezensionen (Demo: Beispiele, live: Google Places API oder Business Profile API). */
export interface ReviewsService {
  getSummary(): Promise<ReviewSummary>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: string;
}

/** Login für /admin. Demo: ein fester Demo-User. Live: echter Anbieter (z. B. Auth.js, Clerk, Supabase). */
export interface AuthService {
  login(email: string, password: string): Promise<AdminSession | null>;
  verify(token: string): Promise<AdminUser | null>;
  logout(token: string): Promise<void>;
}

export interface Services {
  mode: 'demo' | 'live';
  inquiries: InquiryService;
  mail: MailService;
  availability: AvailabilityService;
  catalog: CatalogService;
  settings: SettingsService;
  social: SocialFeedService;
  reviews: ReviewsService;
  auth: AuthService;
}

export type { InquiryInput };
