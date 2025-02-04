import { useState } from "react";
import DashboardContent from "../components/DashboardContent";
import PeriodSelector from "../components/PeriodSelector";
import { LoadingOverlay, LoadingScreen } from "../components/LoadingSpinner";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const [currentPeriod, setCurrentPeriod] = useState(new Date());
  const {
    isLoading,
    isInitialLoad,
    periodData,
    trendsData,
    companyId,
    refresh,
  } = useDashboardData(currentPeriod);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4 border-b border-gray-200 mb-6">
        <PeriodSelector value={currentPeriod} onChange={setCurrentPeriod} />
      </div>

      {isInitialLoad ? (
        <LoadingScreen />
      ) : (
        <div className="relative">
          {isLoading && <LoadingOverlay />}
          <DashboardContent
            {...periodData}
            currentPeriod={currentPeriod}
            companyId={companyId}
            trendsData={trendsData}
          />
        </div>
      )}
    </div>
  );
}
