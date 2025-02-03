// import { TrendingUp, TrendingDown } from "lucide-react";

// export function StatCard({
//   title,
//   amount,
//   trend,
//   period = "vs mes anterior",
//   icon: Icon,
// }) {
//   const isPositive = trend >= 0;

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//       <div className="flex justify-between items-start mb-2">
//         <div className="flex items-center gap-2">
//           {Icon && <Icon className="w-4 h-4 text-gray-400" />}
//           <h3 className="text-sm text-gray-600">{title}</h3>
//         </div>
//         <div
//           className={`flex items-center gap-1 text-sm ${
//             isPositive ? "text-green-600" : "text-red-500"
//           }`}
//         >
//           {isPositive ? (
//             <TrendingUp className="w-4 h-4" />
//           ) : (
//             <TrendingDown className="w-4 h-4" />
//           )}
//           <span>{Math.abs(trend)}%</span>
//         </div>
//       </div>
//       <div className="flex items-baseline gap-2">
//         <span className="text-2xl font-medium">
//           DKK {amount.toLocaleString("da-DK")}
//         </span>
//       </div>
//       <p className="text-xs text-gray-500 mt-1">{period}</p>
//     </div>
//   );
// }
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  amount,
  trend,
  period = "vs mes anterior",
  icon: Icon,
}) {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <h3 className="text-sm text-gray-600">{title}</h3>
        </div>
        <div
          className={`flex items-center gap-1 text-sm ${
            isPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-medium">
          DKK {amount.toLocaleString("da-DK")}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{period}</p>
    </div>
  );
}
