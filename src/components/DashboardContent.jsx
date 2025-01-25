import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CreditCard, Receipt } from "lucide-react";
import BriefingCard from "./BriefingCard";
import DetailDrawer from "./DetailDrawer";

import IncomePanel from "./IncomePanel";
import ExpensesPanel from "./ExpensesPanel";
import MonthlyBalance from "./monthlyBalance";

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

  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <BriefingCard
          title="Total Ingresos"
          amount={totalIncome}
          icon={CreditCard}
          trend={5.2}
          onClick={() => setActiveModal("income")}
        />
        <BriefingCard
          title="Total Gastos"
          amount={totalExpenses}
          icon={Receipt}
          trend={-2.1}
          onClick={() => setActiveModal("expenses")}
        />
      </div>

      <MonthlyBalance
        incomes={incomes}
        expenses={expenses}
        categories={categories}
      />

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
