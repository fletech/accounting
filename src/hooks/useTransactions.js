import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useTransactions(period) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select(
            `
            *,
            categories(name, type)
          `
          )
          .order("date", { ascending: false })
          .limit(10);

        if (error) throw error;
        setTransactions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [period]);

  return { transactions, loading, error };
}
