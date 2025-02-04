import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../lib/LanguageContext";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div
              className="flex items-center max-w-[200px] cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <img src="/logo.svg" alt="EF Accounting" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                title={t("common.settings")}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                title={t("common.logout")}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
