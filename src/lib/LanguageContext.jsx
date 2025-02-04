import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { translations } from "../locales";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLanguage() {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const companyId = "d7958f9a-7414-4f4c-bcb3-2de9e9e1c6f4";

        if (user) {
          // Try to get user settings
          const { data: settings } = await supabase
            .from("company_settings")
            .select("language")
            .eq("company_id", companyId)
            .single();

          if (settings?.language) {
            setLanguage(settings.language);
            return;
          }
        }

        // Fallback to browser language if no settings or no user
        const browserLang = navigator.language.split("-")[0];
        setLanguage(translations[browserLang] ? browserLang : "en");
      } catch (error) {
        console.error("Error loading language:", error);
        // Fallback to English on error
        setLanguage("en");
      } finally {
        setLoading(false);
      }
    }

    loadLanguage();
  }, []);

  function t(key) {
    if (!language) return "";

    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      if (!value?.[k]) return key;
      value = value[k];
    }

    return value;
  }

  const value = {
    language,
    setLanguage,
    t,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
