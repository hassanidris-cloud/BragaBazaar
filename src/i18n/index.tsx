import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import pt from "./pt";
import en from "./en";
import type { TranslationKeys } from "./pt";

export type Locale = "pt" | "en";

type Translations = Record<TranslationKeys, string>;

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

const translations: Record<Locale, Translations> = { pt, en };

const I18nContext = createContext<I18nContextValue>({
  locale: "pt",
  t: pt,
  setLocale: () => {},
  toggleLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "pt" ? "en" : "pt"));
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: translations[locale], setLocale, toggleLocale }),
    [locale, toggleLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
