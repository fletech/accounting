// src/hooks/useUserSettings.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useCompanySettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const companyId = "d7958f9a-7414-4f4c-bcb3-2de9e9e1c6f4";
  async function loadSettings() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get user settings
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .eq("company_id", companyId)
        .single();

      if (error) throw error;

      // If no settings exist, create default ones
      if (!data) {
        const defaultSettings = {
          company_id: companyId,
          language:
            navigator.language.split("-")[0] === "es"
              ? "es"
              : navigator.language.split("-")[0] === "da"
              ? "dk"
              : "en",
          currency_format: "DKK",
          date_format: "DD/MM/YYYY",
          vat_period: "MONTHLY",
        };

        const { data: newSettings, error: insertError } = await supabase
          .from("company_settings")
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      } else {
        setSettings(data);
      }
    } catch (err) {
      console.error("Error loading user settings:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateSettings(newSettings) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("company_settings")
        .update(newSettings)
        .eq("company_id", companyId)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      return data;
    } catch (err) {
      console.error("Error updating user settings:", err);
      throw err;
    }
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: loadSettings,
  };
}
