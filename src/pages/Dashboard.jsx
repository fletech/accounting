// import { useState, useEffect } from "react";
// import { getPeriodDates } from "../lib/dateUtils";
// import { supabase } from "../lib/supabase";
// import IncomePanel from "../components/IncomePanel";
// import PeriodSelector from "../components/PeriodSelector";
// import ExpensesPanel from "../components/ExpensesPanel";
// import MonthlyBalance from "../components/MonthlyBalance";

// export default function Dashboard() {
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const [currentPeriod, setCurrentPeriod] = useState(new Date());
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [periodData, setPeriodData] = useState({
//     incomes: [],
//     expenses: [],
//     settings: null,
//     businessUnits: [],
//   });

//   const companyId = "d7958f9a-7414-4f4c-bcb3-2de9e9e1c6f4";

//   useEffect(() => {
//     loadPeriodData();
//   }, [currentPeriod]);

//   async function loadPeriodData() {
//     setIsLoading(true);
//     try {
//       const { firstDay, lastDay } = getPeriodDates(currentPeriod);
//       const period = `${String(currentPeriod.getMonth() + 1).padStart(
//         2,
//         "0"
//       )}${currentPeriod.getFullYear()}`;

//       const { data: businessUnits } = await supabase
//         .from("business_units")
//         .select("*")
//         .eq("active", true);

//       const [incomesData, expensesData, settingsData] = await Promise.all([
//         supabase
//           .from("monthly_incomes")
//           .select("*, business_units(name)")
//           .eq("period_date", period),

//         supabase
//           .from("expenses")
//           .select("*, expense_categories(name, has_vat)")
//           .gte("period_date", firstDay)
//           .lte("period_date", lastDay),

//         supabase
//           .from("monthly_settings")
//           .select()
//           .gte("period_date", firstDay)
//           .lte("period_date", lastDay)
//           .maybeSingle(),
//       ]);

//       const { data: expenseCategories } = await supabase
//         .from("expense_categories")
//         .select("*")
//         .eq("company_id", companyId);

//       setPeriodData({
//         businessUnits: businessUnits || [],
//         incomes: incomesData.data || [],
//         expenses: expensesData.data || [],
//         settings: settingsData.data,
//         expenseCategories: expenseCategories || [],
//       });
//     } catch (error) {
//       console.error("Error loading period data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <nav className="border-b border-gray-200 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-xl font-bold text-black">EF Accounting</h1>
//             </div>
//             <div className="flex items-center gap-4">
//               <PeriodSelector
//                 value={currentPeriod}
//                 onChange={setCurrentPeriod}
//               />
//               <button
//                 onClick={() => supabase.auth.signOut()}
//                 className="text-black hover:text-blueBrand"
//               >
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       {/* Main Content */}

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <DashboardContent
//             businessUnits={periodData.businessUnits}
//             incomes={periodData.incomes}
//             expenses={periodData.expenses}
//             categories={periodData.expenseCategories}
//             currentPeriod={currentPeriod}
//             companyId={companyId}
//             onUpdate={loadPeriodData}
//           />
// <div className="grid gap-6">
//   <IncomePanel
//     businessUnits={periodData.businessUnits}
//     incomes={periodData.incomes}
//     currentPeriod={currentPeriod}
//     companyId={companyId}
//     onUpdate={loadPeriodData}
//   />

//   <ExpensesPanel
//     expenses={periodData.expenses}
//     categories={periodData.expenseCategories}
//     currentPeriod={currentPeriod}
//     companyId={companyId}
//     onUpdate={loadPeriodData}
//   />
//   <MonthlyBalance
//     incomes={periodData.incomes}
//     expenses={periodData.expenses}
//     categories={periodData.expenseCategories}
//   />
// </div>
//         )}
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { getPeriodDates } from "../lib/dateUtils";
import { supabase } from "../lib/supabase";
import DashboardContent from "../components/DashboardContent";
import PeriodSelector from "../components/PeriodSelector";
import {
  LoadingOverlay,
  LoadingScreen,
  LoadingSpinner,
} from "../components/LoadingSpinner";

export default function Dashboard() {
  const [currentPeriod, setCurrentPeriod] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [periodData, setPeriodData] = useState({
    incomes: [],
    expenses: [],
    settings: null,
    businessUnits: [],
    expenseCategories: [],
  });

  const companyId = "d7958f9a-7414-4f4c-bcb3-2de9e9e1c6f4";

  async function loadPeriodData() {
    setIsLoading(true);
    try {
      const { firstDay, lastDay } = getPeriodDates(currentPeriod);
      const period = `${String(currentPeriod.getMonth() + 1).padStart(
        2,
        "0"
      )}${currentPeriod.getFullYear()}`;

      const [
        { data: businessUnits },
        { data: incomes },
        { data: expenses },
        { data: settings },
        { data: categories },
      ] = await Promise.all([
        supabase.from("business_units").select("*").eq("active", true),
        supabase
          .from("monthly_incomes")
          .select("*, business_units(name)")
          .eq("period_date", period),
        supabase
          .from("expenses")
          .select("*, expense_categories(name, has_vat)")
          .gte("period_date", firstDay)
          .lte("period_date", lastDay),
        supabase
          .from("monthly_settings")
          .select()
          .eq("period_date", period)
          .maybeSingle(),
        supabase
          .from("expense_categories")
          .select("*")
          .eq("company_id", companyId),
      ]);

      setPeriodData({
        businessUnits: businessUnits || [],
        incomes: incomes || [],
        expenses: expenses || [],
        settings: settings || null,
        expenseCategories: categories || [],
      });
    } catch (error) {
      console.error("Error loading period data:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }

  useEffect(() => {
    loadPeriodData();
  }, [currentPeriod]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center max-w-[200px]">
              <img src="/logo.svg" alt="" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-black hover:text-blueBrand"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="py-4 border-b border-gray-200 mb-6">
          <PeriodSelector value={currentPeriod} onChange={setCurrentPeriod} />
        </div>

        {isInitialLoad ? (
          <LoadingScreen />
        ) : (
          <div className="relative">
            {isLoading && <LoadingOverlay />}
            <DashboardContent
              businessUnits={periodData.businessUnits}
              incomes={periodData.incomes}
              expenses={periodData.expenses}
              categories={periodData.expenseCategories}
              currentPeriod={currentPeriod}
              companyId={companyId}
              onUpdate={loadPeriodData}
            />
          </div>
        )}
        {/* {isLoading ? (
          <div>Loading...</div>
        ) : (
          <DashboardContent
            businessUnits={periodData.businessUnits}
            incomes={periodData.incomes}
            expenses={periodData.expenses}
            categories={periodData.expenseCategories}
            currentPeriod={currentPeriod}
            companyId={companyId}
            onUpdate={loadPeriodData}
          />
        )} */}
      </main>
    </div>
  );
}
