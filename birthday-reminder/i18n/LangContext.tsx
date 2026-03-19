import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/database/settings';
import { t, Lang, Translations } from './index';

type LangContextType = {
    lang: Lang;
    setLang: (l: Lang) => void;
    tr: Translations;
};

const LangContext = createContext<LangContextType>({
    lang: 'ro',
    setLang: () => {},
    tr: t('ro'),
});

export function LangProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>('ro');

    useEffect(() => {
        const settings = getSettings();
        setLangState((settings.lang as Lang) ?? 'ro');
    }, []);

    const setLang = (l: Lang) => {
        setLangState(l);
        updateSettings({ ...getSettings(), lang: l });
    };

    return (
        <LangContext.Provider value={{ lang, setLang, tr: t(lang) }}>
            {children}
        </LangContext.Provider>
    );
}

export const useLang = () => useContext(LangContext);