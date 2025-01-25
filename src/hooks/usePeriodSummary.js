import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function usePeriodSummary(period) {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    vatToPay: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calculateSummary() {
      try {
        const { data, error } = await supabase.from("transactions").select(`
              amount,
              vat_amount,
              categories(type)
            `);

        if (error) throw error;

        const results = data.reduce(
          (acc, transaction) => {
            const amount = Number(transaction.amount);
            const vatAmount = Number(transaction.vat_amount || 0);

            if (transaction.categories?.type === "income") {
              acc.income += amount;
              acc.vatToPay += vatAmount;
            } else {
              acc.expenses += amount;
              acc.vatToPay -= vatAmount;
            }

            return acc;
          },
          {
            income: 0,
            expenses: 0,
            vatToPay: 0,
          }
        );

        setSummary(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    calculateSummary();
  }, [period]);

  return { summary, loading };
}
