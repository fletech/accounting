import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CreditCard, Receipt } from "lucide-react";
import StatCard from "./StatCard";
import DetailDrawer from "./DetailDrawer";
import MonthlyBalance from "./MonthlyBalance";
import IncomePanel from "./IncomePanel";
import ExpensesPanel from "./ExpensesPanel";
import CategoryList from "./CategoryList";
import TrendGraph from "./TrendGraph";

export default function DashboardContent({
  businessUnits = [],
  incomes = [],
  expenses = [],
  categories = [],
  currentPeriod,
  companyId,
  onUpdate,
  trendsData = { incomes: [], expenses: [] },
}) {
  const [activeModal, setActiveModal] = useState(null);

  // Cálculos para stats
  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const profit = totalIncome - totalExpenses;

  // TODO: Calcular trends reales comparando con mes anterior
  const previousMonthIncome =
    trendsData.incomes[trendsData.incomes.length - 2]?.amount || totalIncome;
  const incomeTrend =
    ((totalIncome - previousMonthIncome) / previousMonthIncome) * 100;

  const previousMonthExpenses =
    trendsData.expenses[trendsData.expenses.length - 2]?.amount ||
    totalExpenses;
  const expensesTrend =
    ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

  // Preparar datos para los gráficos
  const lastSixMonths = [...Array(6)]
    .map((_, i) => {
      const date = new Date(currentPeriod);
      date.setMonth(date.getMonth() - i);
      return `${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}${date.getFullYear()}`;
    })
    .reverse();

  const incomeData = lastSixMonths.map((period) => ({
    date: period,
    amount:
      trendsData.incomes.find((inc) => inc.period_date === period)?.amount || 0,
  }));

  const expenseData = lastSixMonths.map((period) => ({
    date: period,
    amount:
      trendsData.expenses.find((exp) => exp.period_date === period)?.amount ||
      0,
  }));

  // Preparar datos para categorías
  const expensesByCategory =
    categories.length > 0
      ? expenses.reduce((acc, expense) => {
          const category = categories.find((c) => c.id === expense.category_id);
          if (!category) return acc;

          if (!acc[category.id]) {
            acc[category.id] = {
              id: category.id,
              name: category.name,
              amount: 0,
            };
          }
          acc[category.id].amount += Number(expense.amount);
          return acc;
        }, {})
      : {};

  return (
    <>
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div onClick={() => setActiveModal("income")}>
          <StatCard
            title="Ingresos"
            amount={totalIncome}
            trend={incomeTrend || 0}
            icon={CreditCard}
          />
        </div>
        <div onClick={() => setActiveModal("expenses")}>
          <StatCard
            title="Gastos"
            amount={totalExpenses}
            trend={expensesTrend || 0}
            icon={Receipt}
          />
        </div>
        <StatCard
          title="Resultado"
          amount={profit}
          trend={profit > 0 ? incomeTrend : expensesTrend}
        />
      </div>

      {/* Graphs */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-4">Evolución Ingresos</h3>
          <TrendGraph data={incomeData} color="#10B981" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-4">Evolución Gastos</h3>
          <TrendGraph data={expenseData} color="#EF4444" />
        </div>
      </div>

      {/* Categories */}
      {expenses.length > 0 &&
        categories.length > 0 &&
        Object.keys(expensesByCategory).length > 0 && (
          <div className="mb-6">
            <CategoryList
              categories={Object.values(expensesByCategory)}
              type="expense"
            />
          </div>
        )}

      {/* Balance Mensual */}
      <MonthlyBalance
        incomes={incomes}
        expenses={expenses}
        categories={categories}
      />

      {/* Drawers */}
      <AnimatePresence>
        {activeModal === "income" && (
          <DetailDrawer
            onClose={() => setActiveModal(null)}
            title="Gestión de Ingresos"
          >
            <IncomePanel
              businessUnits={businessUnits}
              incomes={incomes}
              currentPeriod={currentPeriod}
              companyId={companyId}
              onUpdate={() => {
                onUpdate();
                setActiveModal(null);
              }}
            />
          </DetailDrawer>
        )}

        {activeModal === "expenses" && (
          <DetailDrawer
            onClose={() => setActiveModal(null)}
            title="Gestión de Gastos"
          >
            <ExpensesPanel
              expenses={expenses}
              categories={categories}
              currentPeriod={currentPeriod}
              companyId={companyId}
              onUpdate={() => {
                onUpdate();
                setActiveModal(null);
              }}
            />
          </DetailDrawer>
        )}
      </AnimatePresence>
    </>
  );
}
// import { useState } from "react";
// import { AnimatePresence } from "framer-motion";
// import { CreditCard, Receipt } from "lucide-react";
// import StatCard from "./StatCard";
// import DetailDrawer from "./DetailDrawer";
// import MonthlyBalance from "./MonthlyBalance";
// import IncomePanel from "./IncomePanel";
// import ExpensesPanel from "./ExpensesPanel";

// export default function DashboardContent({
//   businessUnits,
//   incomes,
//   expenses,
//   categories,
//   currentPeriod,
//   companyId,
//   onUpdate,
// }) {
//   const [activeModal, setActiveModal] = useState(null);

//   // Cálculos para stats
//   const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
//   const totalExpenses = expenses.reduce(
//     (sum, exp) => sum + Number(exp.amount),
//     0
//   );
//   const profit = totalIncome - totalExpenses;

//   // TODO: Calcular trends reales
//   const incomeTrend = 5.3;
//   const expensesTrend = -2.1;

//   return (
//     <>
//       {/* Stats Cards */}
//       <div className="grid md:grid-cols-3 gap-6 mb-6">
//         <div onClick={() => setActiveModal("income")}>
//           <StatCard
//             title="Incomes"
//             amount={totalIncome}
//             trend={incomeTrend}
//             icon={CreditCard}
//           />
//         </div>
//         <div onClick={() => setActiveModal("expenses")}>
//           <StatCard
//             title="Expenses"
//             amount={totalExpenses}
//             trend={expensesTrend}
//             icon={Receipt}
//           />
//         </div>
//         <StatCard
//           title="Result"
//           amount={profit}
//           trend={profit > 0 ? incomeTrend : expensesTrend}
//         />
//       </div>

//       {/* Balance Mensual */}
//       <MonthlyBalance
//         incomes={incomes}
//         expenses={expenses}
//         categories={categories}
//       />

//       {/* Drawers */}
//       <AnimatePresence>
//         {activeModal === "income" && (
//           <DetailDrawer
//             onClose={() => setActiveModal(null)}
//             title="Gestión de Ingresos"
//           >
//             <IncomePanel
//               businessUnits={businessUnits}
//               incomes={incomes}
//               currentPeriod={currentPeriod}
//               companyId={companyId}
//               onUpdate={() => {
//                 onUpdate();
//                 setActiveModal(null);
//               }}
//             />
//           </DetailDrawer>
//         )}

//         {activeModal === "expenses" && (
//           <DetailDrawer
//             onClose={() => setActiveModal(null)}
//             title="Gestión de Gastos"
//           >
//             <ExpensesPanel
//               expenses={expenses}
//               categories={categories}
//               currentPeriod={currentPeriod}
//               companyId={companyId}
//               onUpdate={() => {
//                 onUpdate();
//                 setActiveModal(null);
//               }}
//             />
//           </DetailDrawer>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
