import { useState } from "react";
import { supabase } from "../lib/supabase";
import { getPeriodDates } from "../lib/dateUtils";

export default function IncomePanel({
  businessUnits,
  incomes,
  currentPeriod,
  companyId,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState(
    businessUnits.reduce(
      (acc, unit) => ({
        ...acc,
        [unit.id]:
          incomes.find((i) => i.business_unit_id === unit.id)?.amount || 0,
      }),
      {}
    )
  );

  async function handleSave() {
    setLoading(true);
    try {
      const period = `${String(currentPeriod.getMonth() + 1).padStart(
        2,
        "0"
      )}${currentPeriod.getFullYear()}`;

      const updates = Object.entries(values).map(
        ([businessUnitId, amount]) => ({
          business_unit_id: businessUnitId,
          period_date: period,
          amount: Number(amount),
          company_id: companyId,
        })
      );

      const { error } = await supabase.from("monthly_incomes").upsert(updates, {
        onConflict: "business_unit_id,period_date",
        ignoreDuplicates: false,
      });

      if (error) throw error;
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error saving incomes:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">Income</h2>
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blueBrand hover:text-blueBrand"
            >
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="text-gray-500 hover:text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="text-blueBrand hover:text-blueBrand disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {businessUnits.map((unit) => (
          <div key={unit.id} className="flex justify-between items-center">
            <span className="text-black">{unit.name}</span>
            {isEditing ? (
              <input
                type="number"
                value={values[unit.id]}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [unit.id]: e.target.value,
                  })
                }
                className="px-3 py-1 border border-gray-200 rounded w-32 text-right text-black"
              />
            ) : (
              <span className="text-black">
                {Number(values[unit.id]).toLocaleString("da-DK")} DKK
              </span>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-bold text-black">Total</span>
          <span className="font-bold text-black">
            {Object.values(values)
              .reduce((sum, val) => sum + Number(val), 0)
              .toLocaleString("da-DK")}{" "}
            DKK
          </span>
        </div>
      </div>
    </div>
  );
}
