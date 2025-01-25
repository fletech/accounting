import { format } from "date-fns";
import { es } from "date-fns/locale";

const months = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "Jun" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

export default function PeriodSelector({ value, onChange }) {
  const currentMonth = value.getMonth();
  const currentYear = value.getFullYear();

  const handleMonthChange = (month) => {
    const newDate = new Date(currentYear, month);
    onChange(newDate);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(year, currentMonth);
    onChange(newDate);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentMonth}
        onChange={(e) => handleMonthChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-200 rounded-lg text-black bg-white"
      >
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <select
        value={currentYear}
        onChange={(e) => handleYearChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-200 rounded-lg text-black bg-white"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
