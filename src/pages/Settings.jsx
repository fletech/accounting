import { LoadingScreen } from "../components/LoadingSpinner";
import { useLanguage } from "../lib/LanguageContext";
import { useSettings } from "../lib/SettingsContext";
import { AVAILABLE_LANGUAGES } from "../locales";

const VAT_PERIODS = [
  { value: "MONTHLY", label: "settings.vat_periods.monthly" },
  { value: "QUARTERLY", label: "settings.vat_periods.quarterly" },
  { value: "HALF_YEARLY", label: "settings.vat_periods.half_yearly" },
];

const CURRENCY_FORMATS = [
  { value: "DKK", label: "DKK" },
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
];

const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
];

function SelectInput({ label, value, options, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label?.startsWith("settings.")
              ? t(option.label)
              : option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Settings() {
  const { t, setLanguage, loading: langLoading } = useLanguage();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();

  async function handleSettingChange(key, value) {
    try {
      await updateSettings({ [key]: value });

      // Si el cambio es de idioma, actualizamos el contexto de idioma
      if (key === "language") {
        setLanguage(value);
      }
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  }
  if (langLoading || settingsLoading) {
    return <LoadingScreen />;
  }

  if (!settings) return null;

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-gray-500">{t("settings.subtitle")}</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-900">
              {t("settings.preferences.title")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("settings.preferences.subtitle")}
            </p>
          </div>

          <div className="grid gap-6 mt-4">
            <SelectInput
              label={t("settings.preferences.language")}
              value={settings.language}
              options={AVAILABLE_LANGUAGES}
              onChange={(value) => handleSettingChange("language", value)}
            />

            <SelectInput
              label={t("settings.preferences.currency_format")}
              value={settings.currency_format}
              options={CURRENCY_FORMATS}
              onChange={(value) =>
                handleSettingChange("currency_format", value)
              }
            />

            <SelectInput
              label={t("settings.preferences.date_format")}
              value={settings.date_format}
              options={DATE_FORMATS}
              onChange={(value) => handleSettingChange("date_format", value)}
            />

            <SelectInput
              label={t("settings.preferences.vat_period")}
              value={settings.vat_period}
              options={VAT_PERIODS}
              onChange={(value) => handleSettingChange("vat_period", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
