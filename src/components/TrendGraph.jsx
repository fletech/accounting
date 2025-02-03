import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TrendGraph({ data, height = 60, color = "#3b82f6" }) {
  const formatPeriod = (period) => {
    // period viene en formato "MMYYYY"
    const month = period.substring(0, 2);
    const year = period.substring(2);
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.1} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatPeriod}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            stroke="#9CA3AF"
          />
          <YAxis hide={true} domain={["dataMin - 1000", "dataMax + 1000"]} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600">
                      {formatPeriod(label)}
                    </p>
                    <p className="text-sm font-medium">
                      DKK {payload[0].value.toLocaleString("da-DK")}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={color}
            strokeWidth={2}
            fill="url(#colorGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
