/**
 * Main navigation of the website. The structure mirrors the menu of bsv-bonn.de.
 * Every `path` has to match a markdown page in `src/content/pages`.
 */
export interface NavItem {
  title: string;
  path: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  { title: 'Startseite', path: '/' },
  {
    title: 'Aktuelles',
    path: '/aktuelles',
    children: [
      { title: 'Veranstaltungen', path: '/aktuelles/veranstaltungen' },
      { title: 'Ständige Termine', path: '/aktuelles/regelmaessigetermine' },
      { title: 'Sportangebote', path: '/aktuelles/sportangebote' },
      { title: 'Rückblick', path: '/aktuelles/rueckblick' },
    ],
  },
  {
    title: 'Wir',
    path: '/wir',
    children: [
      { title: 'Vorstand', path: '/wir/vorstand' },
      { title: 'Mitglied werden', path: '/wir/mitglied-werden' },
      { title: 'Spenden', path: '/wir/spenden' },
      { title: 'Vereinsgeschichte', path: '/wir/vereinsgeschichte' },
      { title: 'Impressum', path: '/wir/impressum' },
      { title: 'Datenschutzerklärung', path: '/wir/datenschutzerklaerung' },
    ],
  },
  {
    title: 'Rat und Hilfe',
    path: '/rat-und-hilfe',
    children: [
      { title: 'Austausch / Vernetzung', path: '/rat-und-hilfe/austausch-vernetzung' },
      { title: 'Orientierung / Mobilität', path: '/rat-und-hilfe/orientierung-mobilitaet' },
      { title: 'Alltagshelfer', path: '/rat-und-hilfe/alltagshelfer' },
      { title: 'Technische Hilfsmittel', path: '/rat-und-hilfe/technische-hilfsmittel' },
      { title: 'Begleitung', path: '/rat-und-hilfe/begleitung' },
      { title: 'Nachteilsausgleiche', path: '/rat-und-hilfe/nachteilsausgleiche' },
      { title: 'Rechtsberatung', path: '/rat-und-hilfe/rechtsberatung' },
    ],
  },
  { title: 'Aktiv bleiben', path: '/aktiv-bleiben' },
  { title: '100-Jahr-Feier', path: '/100-jahrfeier' },
];

export const footerNavigation: NavItem[] = [
  { title: 'Impressum', path: '/wir/impressum' },
  { title: 'Datenschutzerklärung', path: '/wir/datenschutzerklaerung' },
  { title: 'Spenden', path: '/wir/spenden' },
  { title: 'Mitglied werden', path: '/wir/mitglied-werden' },
];

/** Flattens the navigation tree into a list of all items. */
export function flattenNavigation(items: NavItem[] = navigation): NavItem[] {
  return items.flatMap((item) => [item, ...flattenNavigation(item.children ?? [])]);
}

/** Finds the top level section an item belongs to. */
export function findSection(path: string, items: NavItem[] = navigation): NavItem | undefined {
  return items.find(
    (item) => item.path === path || item.children?.some((child) => child.path === path),
  );
}

/** Builds the breadcrumb trail for a path, starting with the home page. */
export function breadcrumbsFor(path: string, items: NavItem[] = navigation): NavItem[] {
  const home = items.find((item) => item.path === '/');
  const trail: NavItem[] = home ? [home] : [];
  if (path === '/') {
    return trail;
  }
  const section = findSection(path, items);
  if (!section) {
    return trail;
  }
  trail.push(section);
  const child = section.children?.find((item) => item.path === path);
  if (child) {
    trail.push(child);
  }
  return trail;
}
