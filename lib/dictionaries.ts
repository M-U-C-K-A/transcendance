import { Locale } from '../i18n-config';

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  fr: () => import('./locales/fr.json').then((module) => module.default),
  es: () => import('./locales/es.json').then((module) => module.default),
  ru: () => import('./locales/ru.json').then((module) => module.default),
  de: () => import('./locales/de.json').then((module) => module.default),
  ch: () => import('./locales/ch.json').then((module) => module.default),
  na: () => import('./locales/na.json').then((module) => module.default),
  id: () => import('./locales/id.json').then((module) => module.default),
}satisfies Record<Locale, () => Promise<any>>; // Type safety

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale];
  if (!loader) {
    throw new Error(`No dictionary loader found for locale: ${locale}`);
  }
  return loader();
};
