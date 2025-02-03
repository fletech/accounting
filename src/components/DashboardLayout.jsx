// import { useState } from "react";
// import {
//   CreditCard,
//   Receipt,
//   TrendingUp,
//   TrendingDown,
//   Circle,
// } from "lucide-react";
// import { motion } from "framer-motion";

// import { CategoryList } from "./CategoryList";
// import { StatCard } from "./StatCard";
// import { TrendGraph } from "./TrendGraph";

// export default function DashboardLayout({ incomeData, expenseData, children }) {
//   // Procesamiento de datos
//   const totalIncome = incomeData.total;
//   const totalExpenses = expenseData.total;
//   const profit = totalIncome - totalExpenses;

//   const incomeTrend = 5.2; // Calcular desde data
//   const expensesTrend = -2.1; // Calcular desde data

//   return (
//     <div className="space-y-6">
//       {/* Top Stats */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <StatCard
//           title="Incomes"
//           amount={totalIncome}
//           trend={incomeTrend}
//           icon={CreditCard}
//         />
//         <StatCard
//           title="Expenses"
//           amount={totalExpenses}
//           trend={expensesTrend}
//           icon={Receipt}
//         />
//         <StatCard
//           title="Result"
//           amount={profit}
//           trend={(profit / totalIncome) * 100}
//           icon={profit >= 0 ? TrendingUp : TrendingDown}
//         />
//       </div>

//       {/* Graphs Section */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h3 className="text-sm text-gray-600 mb-4">Evolución Ingresos</h3>
//           <TrendGraph data={incomeData.trend} />
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h3 className="text-sm text-gray-600 mb-4">Evolución Gastos</h3>
//           <TrendGraph data={expenseData.trend} />
//         </div>
//       </div>

//       {/* Categories */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <CategoryList categories={incomeData.categories} type="income" />
//         <CategoryList categories={expenseData.categories} type="expense" />
//       </div>

//       {children}
//     </div>
//   );
// }
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CreditCard, Receipt } from "lucide-react";
import StatCard from "./StatCard";
import DetailDrawer from "./DetailDrawer";
import MonthlyBalance from "./MonthlyBalance";
import IncomePanel from "./IncomePanel";
import ExpensesPanel from "./ExpensesPanel";

export default function DashboardContent({
  businessUnits,
  incomes,
  expenses,
  categories,
  currentPeriod,
  companyId,
  onUpdate,
}) {
  const [activeModal, setActiveModal] = useState(null);

  // Cálculos para stats
  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const profit = totalIncome - totalExpenses;

  // TODO: Calcular trends reales
  const incomeTrend = 5.3;
  const expensesTrend = -2.1;

  return (
    <>
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div onClick={() => setActiveModal("income")}>
          <StatCard
            title="Ingresos"
            amount={totalIncome}
            trend={incomeTrend}
            icon={CreditCard}
          />
        </div>
        <div onClick={() => setActiveModal("expenses")}>
          <StatCard
            title="Gastos"
            amount={totalExpenses}
            trend={expensesTrend}
            icon={Receipt}
          />
        </div>
        <StatCard
          title="Resultado"
          amount={profit}
          trend={profit > 0 ? incomeTrend : expensesTrend}
        />
      </div>

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
