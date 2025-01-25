import { TrendingUp, TrendingDown } from "lucide-react";

export default function BriefingCard({
  title,
  amount,
  icon: Icon,
  trend,
  onClick,
}) {
  const isPositive = trend >= 0;

  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blueBrand" />
          </div>
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {amount.toLocaleString("da-DK")} DKK
      </p>
    </div>
  );
}
