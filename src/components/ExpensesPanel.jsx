import { useState } from "react";
import { supabase } from "../lib/supabase";
import { format, parseISO } from "date-fns";
import { calculateVAT } from "../lib/vatUtils";
import { formatPeriodDate } from "../lib/dateUtils";

export default function ExpensesPanel({
  expenses = [],
  categories = [],
  currentPeriod,
  companyId,
  onUpdate,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category_id: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  async function handleAddExpense(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const category = categories.find((c) => c.id === newExpense.category_id);
      const totalAmount = Number(newExpense.amount);
      const expenseDate = parseISO(newExpense.date);

      // Calcula VAT si la categoría lo tiene
      const vatRate = category?.has_vat ? category.vat_rate || 25 : 0;
      const net = totalAmount / (1 + vatRate / 100);
      const vat = category?.has_vat ? totalAmount - net : 0;

      const expense = {
        company_id: companyId,
        category_id: newExpense.category_id,
        period_date: expenseDate,
        amount: Number(net.toFixed(2)),
        vat_amount: Number(vat.toFixed(2)),
        notes: newExpense.notes,
      };

      const { error } = await supabase.from("expenses").insert(expense);
      if (error) throw error;

      setIsAdding(false);
      setNewExpense({
        category_id: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
      onUpdate();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Error adding expense");
    } finally {
      setLoading(false);
    }
  }

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const totalVAT = expenses.reduce(
    (sum, exp) => sum + (Number(exp.vat_amount) || 0),
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">Expenses</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blueBrand text-white rounded-lg hover:bg-blueBrand"
        >
          Add Expense
        </button>
      </div>

      {/* Lista de gastos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-black">Date</th>
              <th className="text-left py-3 text-black">Category</th>
              <th className="text-right py-3 text-black">Amount</th>
              <th className="text-right py-3 text-black">VAT</th>
              <th className="text-left py-3 text-black">Notes</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-gray-200">
                <td className="py-2 text-black">
                  {expense.period_date
                    ? format(parseISO(expense.period_date), "dd/MM/yyyy")
                    : "-"}
                </td>
                <td className="py-2 text-black">
                  {categories.find((c) => c.id === expense.category_id)?.name ||
                    "-"}
                </td>
                <td className="py-2 text-right text-black">
                  {Number(expense.amount).toLocaleString("da-DK")} DKK
                </td>
                <td className="py-2 text-right text-black">
                  {expense.vat_amount
                    ? `${Number(expense.vat_amount).toLocaleString(
                        "da-DK"
                      )} DKK`
                    : "-"}
                </td>
                <td className="py-2 text-black">{expense.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 font-bold">
              <td colSpan={2} className="py-3 text-black">
                Total
              </td>
              <td className="py-3 text-right text-black">
                {totalExpenses.toLocaleString("da-DK")} DKK
              </td>
              <td className="py-3 text-right text-black">
                {totalVAT.toLocaleString("da-DK")} DKK
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal para agregar gasto */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-black mb-1">
                  Category
                </label>
                <select
                  value={newExpense.category_id}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      category_id: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg text-black"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-black mb-1">
                  Amount (DKK)
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg text-black"
                  required
                />
              </div>

              {categories.find((c) => c.id === newExpense.category_id)
                ?.has_vat && (
                <div>
                  <label className="block text-sm text-black mb-1">
                    VAT Amount (DKK)
                  </label>
                  <input
                    type="number"
                    value={newExpense.vat_amount}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        vat_amount: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-black"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-black mb-1">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      date: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-black mb-1">Notes</label>
                <textarea
                  value={newExpense.notes}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      notes: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg text-black"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blueBrand text-white rounded-lg hover:bg-blueBrand disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Resto del componente sigue igual...

// import { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { format, parseISO } from "date-fns";

// export default function ExpensesPanel({
//   expenses = [],
//   categories = [],
//   currentPeriod,
//   companyId,
//   onUpdate,
// }) {
//   const [isAdding, setIsAdding] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Form para nuevo gasto
//   const [newExpense, setNewExpense] = useState({
//     category_id: "",
//     amount: "",
//     vat_amount: "",
//     period_date: format(new Date(), "yyyy-MM-dd"),
//     notes: "",
//   });

//   async function handleAddExpense(e) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const period =
//         String(currentPeriod.getMonth() + 1).padStart(2, "0") +
//         String(currentPeriod.getFullYear());

//       const expense = {
//         company_id: companyId,
//         category_id: newExpense.category_id,
//         period_date: period,
//         amount: Number(newExpense.amount),
//         vat_amount: Number(newExpense.amount) * 0.25,
//         notes: newExpense.notes,
//       };

//       const { error } = await supabase.from("expenses").insert(expense);

//       if (error) throw error;

//       setIsAdding(false);
//       setNewExpense({
//         category_id: "",
//         amount: "",
//         vat_amount: "",
//         period_date: format(new Date(), "yyyy-MM-dd"),
//         notes: "",
//       });
//       onUpdate();
//     } catch (error) {
//       console.error("Error adding expense:", error);
//       alert("Error adding expense");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const totalExpenses = expenses.reduce(
//     (sum, exp) => sum + Number(exp.amount),
//     0
//   );
//   const totalVAT = expenses.reduce(
//     (sum, exp) => sum + (Number(exp.vat_amount) || 0),
//     0
//   );

//   return (
//     <div className="bg-white p-6 rounded-lg border border-gray-200">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold text-black">Expenses</h2>
//         <button
//           onClick={() => setIsAdding(true)}
//           className="px-4 py-2 bg-blueBrand text-white rounded-lg hover:bg-blueBrand"
//         >
//           Add Expense
//         </button>
//       </div>

//       {/* Lista de gastos */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-gray-200">
//               <th className="text-left py-3 text-black">Date</th>
//               <th className="text-left py-3 text-black">Category</th>
//               <th className="text-right py-3 text-black">Amount</th>
//               <th className="text-right py-3 text-black">VAT</th>
//               <th className="text-left py-3 text-black">Notes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {expenses.map((expense) => (
//               <tr key={expense.id} className="border-b border-gray-200">
//                 <td className="py-2 text-black">
//                   {expense.period_date
//                     ? format(parseISO(expense.period_date), "dd/MM/yyyy")
//                     : "-"}
//                 </td>
//                 <td className="py-2 text-black">
//                   {categories.find((c) => c.id === expense.category_id)?.name ||
//                     "-"}
//                 </td>
//                 <td className="py-2 text-right text-black">
//                   {Number(expense.amount).toLocaleString("da-DK")} DKK
//                 </td>
//                 <td className="py-2 text-right text-black">
//                   {expense.vat_amount
//                     ? `${Number(expense.vat_amount).toLocaleString(
//                         "da-DK"
//                       )} DKK`
//                     : "-"}
//                 </td>
//                 <td className="py-2 text-black">{expense.notes || "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr className="border-t border-gray-200 font-bold">
//               <td colSpan={2} className="py-3 text-black">
//                 Total
//               </td>
//               <td className="py-3 text-right text-black">
//                 {totalExpenses.toLocaleString("da-DK")} DKK
//               </td>
//               <td className="py-3 text-right text-black">
//                 {totalVAT.toLocaleString("da-DK")} DKK
//               </td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>

//       {/* Modal para agregar gasto */}
//       {isAdding && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <form onSubmit={handleAddExpense} className="space-y-4">
//               <div>
//                 <label className="block text-sm text-black mb-1">
//                   Category
//                 </label>
//                 <select
//                   value={newExpense.category_id}
//                   onChange={(e) =>
//                     setNewExpense({
//                       ...newExpense,
//                       category_id: e.target.value,
//                     })
//                   }
//                   className="w-full p-2 border border-gray-200 rounded-lg text-black"
//                   required
//                 >
//                   <option value="">Select category</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-black mb-1">
//                   Amount (DKK)
//                 </label>
//                 <input
//                   type="number"
//                   value={newExpense.amount}
//                   onChange={(e) =>
//                     setNewExpense({
//                       ...newExpense,
//                       amount: e.target.value,
//                     })
//                   }
//                   className="w-full p-2 border border-gray-200 rounded-lg text-black"
//                   required
//                 />
//               </div>

//               {categories.find((c) => c.id === newExpense.category_id)
//                 ?.has_vat && (
//                 <div>
//                   <label className="block text-sm text-black mb-1">
//                     VAT Amount (DKK)
//                   </label>
//                   <input
//                     type="number"
//                     value={newExpense.vat_amount}
//                     onChange={(e) =>
//                       setNewExpense({
//                         ...newExpense,
//                         vat_amount: e.target.value,
//                       })
//                     }
//                     className="w-full p-2 border border-gray-200 rounded-lg text-black"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm text-black mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={newExpense.date}
//                   onChange={(e) =>
//                     setNewExpense({
//                       ...newExpense,
//                       date: e.target.value,
//                     })
//                   }
//                   className="w-full p-2 border border-gray-200 rounded-lg text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-black mb-1">Notes</label>
//                 <textarea
//                   value={newExpense.notes}
//                   onChange={(e) =>
//                     setNewExpense({
//                       ...newExpense,
//                       notes: e.target.value,
//                     })
//                   }
//                   className="w-full p-2 border border-gray-200 rounded-lg text-black"
//                   rows={3}
//                 />
//               </div>

//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsAdding(false)}
//                   className="px-4 py-2 text-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-blueBrand text-white rounded-lg hover:bg-blueBrand disabled:opacity-50"
//                 >
//                   {loading ? "Adding..." : "Add Expense"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
