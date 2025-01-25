import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

function TabContent({ label, value, highlight = false, profit = false }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span
        className={`font-medium ${
          highlight
            ? profit
              ? "text-green-600"
              : "text-red-600"
            : "text-black"
        }`}
      >
        {value.toLocaleString("da-DK")} DKK
      </span>
    </div>
  );
}

export default function MonthlyBalance({ incomes, expenses, categories }) {
  const [activeTab, setActiveTab] = useState("accrual");

  // Cálculos compartidos
  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const incomeVAT = totalIncome * 0.25;
  const netIncome = totalIncome - incomeVAT;

  const deductibleExpenses = expenses.filter(
    (exp) => categories.find((cat) => cat.id === exp.category_id)?.has_vat
  );

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const deductibleTotal = deductibleExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const deductibleVAT = deductibleExpenses.reduce(
    (sum, exp) => sum + Number(exp.vat_amount),
    0
  );

  // Base devengada (Accrual)
  const vatBalance = incomeVAT - deductibleVAT;
  const netResult = netIncome - (totalExpenses - deductibleVAT);

  // Base de caja (Cash)
  const cashResult = totalIncome - totalExpenses;

  const tabs = [
    { id: "accrual", label: "Contable" },
    { id: "cash", label: "Flujo de Caja" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-black">Balance Mensual</h2>
        <div
          className={`px-3 py-1 rounded-full ${
            (activeTab === "accrual" ? netResult : cashResult) >= 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {(activeTab === "accrual" ? netResult : cashResult) >= 0
            ? "Ganancia"
            : "Pérdida"}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative py-4 px-1 
                ${
                  activeTab === tab.id
                    ? "text-blueBrand"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blueBrand"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accrual View */}
      {activeTab === "accrual" && (
        <div className="space-y-2">
          <TabContent
            label="Ingresos Totales (IVA incluido)"
            value={totalIncome}
          />
          <TabContent label="Ingresos Netos (sin IVA)" value={netIncome} />
          <TabContent label="IVA Recaudado (25%)" value={incomeVAT} />
          <TabContent
            label="Gastos Totales (IVA incluido)"
            value={totalExpenses}
          />
          <TabContent
            label="Gastos con IVA deducible"
            value={deductibleTotal}
          />
          <TabContent
            label="Base neta de gastos deducibles"
            value={deductibleTotal - deductibleVAT}
          />
          <TabContent label="IVA Deducible (de gastos)" value={deductibleVAT} />
          <TabContent label="Balance Mensual (IVA)" value={vatBalance} />
          <TabContent
            label="Resultado Neto (sin IVA)"
            value={netResult}
            highlight
            profit={netResult >= 0}
          />
        </div>
      )}

      {/* Cash Flow View */}
      {activeTab === "cash" && (
        <div className="space-y-2">
          <TabContent label="Ingresos Totales Cobrados" value={totalIncome} />
          <TabContent label="Gastos Totales Pagados" value={totalExpenses} />
          <TabContent
            label="Flujo de Caja Neto"
            value={cashResult}
            highlight
            profit={cashResult >= 0}
          />
        </div>
      )}
    </div>
  );
}
