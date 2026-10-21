import type { BudgetRange, InquiryCategory, Occasion } from '@c-event/core';

export const categoryLabels: Record<InquiryCategory, string> = {
  'bar-catering': 'Bar-Catering',
  personalvermittlung: 'Personalvermittlung',
  catering: 'Catering',
  'event-management': 'Event-Management',
  'event-organisation': 'Event-Organisation',
  dekoration: 'Dekoration',
  'equipment-mieten': 'Equipment-Vermietung',
  'social-media': 'Social Media & Content',
  konfigurator: 'Rider aus dem Konfigurator',
  allgemein: 'Allgemeine Anfrage',
};

export const occasionLabels: Record<Occasion, string> = {
  weihnachtsfeier: 'Weihnachtsfeier',
  sommerfest: 'Sommerfest',
  firmenevent: 'Firmenevent / Konferenz',
  'release-event': 'Release- oder Brand-Event',
  produktion: 'Musikvideo / Film / Produktion',
  hochzeit: 'Hochzeit',
  geburtstag: 'Geburtstag',
  'private-feier': 'Private Feier',
  sonstiges: 'Etwas ganz anderes',
};

export const budgetLabels: Record<BudgetRange, string> = {
  'bis-2500': 'bis 2.500 €',
  '2500-5000': '2.500 – 5.000 €',
  '5000-10000': '5.000 – 10.000 €',
  '10000-25000': '10.000 – 25.000 €',
  'ueber-25000': 'über 25.000 €',
  offen: 'Noch offen',
};

export const labelFns = {
  category: (id: string) => categoryLabels[id as InquiryCategory] ?? id,
  occasion: (id: string | undefined) => (id ? (occasionLabels[id as Occasion] ?? id) : '–'),
  budget: (id: string | undefined) => (id ? (budgetLabels[id as BudgetRange] ?? id) : '–'),
};
