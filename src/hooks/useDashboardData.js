import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getPeriodDates } from "../lib/dateUtils";

export function useDashboardData(currentPeriod) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [periodData, setPeriodData] = useState({
    incomes: [],
    expenses: [],
    settings: null,
    businessUnits: [],
    expenseCategories: [],
  });
  const [trendsData, setTrendsData] = useState({
    incomes: [],
    expenses: [],
  });

  const companyId = "d7958f9a-7414-4f4c-bcb3-2de9e9e1c6f4";

  async function loadTrendsData() {
    try {
      // Calcular rango de 6 meses
      const sixMonthsAgo = new Date(currentPeriod);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

      // Formatear período para monthly_incomes (MMYYYY)
      const startPeriod = `${String(sixMonthsAgo.getMonth() + 1).padStart(
        2,
        "0"
      )}${sixMonthsAgo.getFullYear()}`;
      const endPeriod = `${String(currentPeriod.getMonth() + 1).padStart(
        2,
        "0"
      )}${currentPeriod.getFullYear()}`;

      console.log("Trend periods:", { startPeriod, endPeriod });

      // Query ingresos
      const { data: incomes, error: incomesError } = await supabase
        .from("monthly_incomes")
        .select("period_date, amount")
        .gte("period_date", startPeriod)
        .lte("period_date", endPeriod)
        .order("period_date");

      if (incomesError) {
        console.error("Error querying incomes:", incomesError);
      }
      console.log("Income results:", incomes);

      // Formatear fechas para gastos (YYYY-MM-DD)
      const startDate = `${sixMonthsAgo.getFullYear()}-${String(
        sixMonthsAgo.getMonth() + 1
      ).padStart(2, "0")}-01`;
      const endDate = `${currentPeriod.getFullYear()}-${String(
        currentPeriod.getMonth() + 1
      ).padStart(2, "0")}-31`;

      // Query gastos
      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("amount, period_date")
        .gte("period_date", startDate)
        .lte("period_date", endDate)
        .order("period_date");

      if (expensesError) {
        console.error("Error querying expenses:", expensesError);
      }
      console.log("Expense results:", expenses);

      // Procesar gastos por mes
      const expensesByMonth = {};
      expenses?.forEach((expense) => {
        const date = new Date(expense.period_date);
        const monthKey = `${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}${date.getFullYear()}`;
        expensesByMonth[monthKey] =
          (expensesByMonth[monthKey] || 0) + Number(expense.amount);
      });

      setTrendsData({
        incomes: incomes || [],
        expenses: Object.entries(expensesByMonth).map(
          ([period_date, amount]) => ({
            period_date,
            amount,
          })
        ),
      });
    } catch (error) {
      console.error("Error in loadTrendsData:", error);
    }
  }

  async function loadPeriodData() {
    setIsLoading(true);
    try {
      const { firstDay, lastDay } = getPeriodDates(currentPeriod);
      const period = `${String(currentPeriod.getMonth() + 1).padStart(
        2,
        "0"
      )}${currentPeriod.getFullYear()}`;

      console.log("Loading period:", period, { firstDay, lastDay });

      // Query all data in parallel
      const [
        { data: businessUnits, error: businessUnitsError },
        { data: incomes, error: incomesError },
        { data: expenses, error: expensesError },
        { data: settings, error: settingsError },
        { data: categories, error: categoriesError },
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

      // Log errors if any
      if (businessUnitsError)
        console.error("Error loading business units:", businessUnitsError);
      if (incomesError) console.error("Error loading incomes:", incomesError);
      if (expensesError)
        console.error("Error loading expenses:", expensesError);
      if (settingsError)
        console.error("Error loading settings:", settingsError);
      if (categoriesError)
        console.error("Error loading categories:", categoriesError);

      console.log("Period data loaded:", {
        businessUnits,
        incomes,
        expenses,
        settings,
        categories,
      });

      setPeriodData({
        businessUnits: businessUnits || [],
        incomes: incomes || [],
        expenses: expenses || [],
        settings: settings || null,
        expenseCategories: categories || [],
      });

      await loadTrendsData();
    } catch (error) {
      console.error("Error in loadPeriodData:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }

  useEffect(() => {
    loadPeriodData();
  }, [currentPeriod]);

  return {
    isLoading,
    isInitialLoad,
    periodData,
    trendsData,
    companyId,
    refresh: loadPeriodData,
  };
}
