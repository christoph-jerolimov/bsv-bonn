/**
 * Central information about the association that is shown on many pages
 * (header, sidebar, footer and the markdown content).
 */
export const site = {
  name: 'BSV Bonn/Rhein-Sieg',
  shortName: 'BSV Bonn',
  organisation: 'Blinden- und Sehbehindertenverein Bonn/Rhein-Sieg e.V.',
  description:
    'Selbsthilfeorganisation blinder und sehbehinderter Menschen in Bonn, im Rhein-Sieg-Kreis und im Kreis Euskirchen. Beratung, Begleitung, Austausch und Freizeitangebote.',
  language: 'de',
  address: {
    street: 'Konrad-Adenauer-Platz 6',
    zip: '53225',
    city: 'Bonn',
  },
  phone: '0228 69 22 00',
  phoneHref: 'tel:+49228692200',
  infoPhone: '0228 40 987 50',
  infoPhoneHref: 'tel:+492284098750',
  email: 'bsv-bonn@t-online.de',
  officeHours: [
    { day: 'Dienstag', time: '10:00 – 12:00 Uhr' },
    { day: 'Donnerstag', time: '15:00 – 17:00 Uhr' },
  ],
  officeHoursNote: 'und nach telefonischer Vereinbarung',
  donation: {
    bank: 'Sparkasse KölnBonn',
    iban: 'DE95 3705 0198 0000 0869 75',
    bic: 'COLSDE33',
  },
  register: 'Amtsgericht Bonn, VR 2043',
  founded: 1921,
  original: 'https://bsv-bonn.de/',
} as const;

export type Site = typeof site;
