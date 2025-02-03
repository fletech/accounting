import { motion } from "framer-motion";

export default function CategoryList({ categories, type = "expense" }) {
  console.log(categories);
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm text-gray-600 mb-4">
        Distribución por Categorías
      </h3>
      <div className="space-y-4">
        {categories.map((cat, idx) => {
          const percentage = (cat.amount / total) * 100;
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      colors[idx % colors.length]
                    }`}
                  />
                  <span className="text-sm">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm font-medium">
                    DKK {cat.amount.toLocaleString("da-DK")}
                  </span>
                </div>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${colors[idx % colors.length]}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
