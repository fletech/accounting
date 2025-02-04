import { createContext, useContext } from "react";
import { useCompanySettings } from "../hooks/useCompanySettings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { settings, loading, error, updateSettings, refreshSettings } =
    useCompanySettings();

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings,
  };

  if (loading) return null;

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
