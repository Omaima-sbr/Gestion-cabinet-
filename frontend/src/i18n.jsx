// hooks/I18nProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// 🔹 Import de tous les fichiers de traduction (une seule fois)
const locales = import.meta.glob('../locales/*.json', { eager: true });

// 🔹 Création du contexte
export const I18nContext = createContext();

// 🔹 Provider
export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => localStorage.getItem('locale') || 'fr');
  const [translations, setTranslations] = useState({});

  // Charger les traductions dynamiquement selon la langue
  useEffect(() => {
    const file = locales[`../locales/${locale}.json`]; // utilise le même path que dans import.meta.glob
    if (file) {
      setTranslations(file.default);
    } else {
      console.error(`Traductions pour la langue "${locale}" non trouvées`);
      setTranslations({});
    }

    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  // 🔹 Fonction pour changer la langue
  const changeLocale = (newLocale) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  // 🔹 Fonction pour récupérer la traduction d'une clé
  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined || value === null) return key;
    }
    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// 🔹 Hook à utiliser dans les composants
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation doit être utilisé à l’intérieur d’un I18nProvider');
  }
  return context;
};
