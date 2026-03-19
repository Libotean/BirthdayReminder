import ro from './ro';
import en from './en';

export type Lang = 'ro' | 'en';

const translations = { ro, en };

export function t(lang: Lang) {
    return translations[lang] ?? translations.ro;
}

export type Translations = ReturnType<typeof t>;