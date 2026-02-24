import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PostsChartProps {
  data?: Array<{ name: string; value: number }>;
  total: number;
}

export function PostsChart({ data, total }: PostsChartProps) {
  // Default data if none provided - simulate posts trend over time
  const defaultData = [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 600 },
    { name: 'Mar', value: 800 },
    { name: 'Abr', value: 1000 },
    { name: 'Mai', value: 1500 },
    { name: 'Jun', value: 1800 },
    { name: 'Jul', value: 2433 },
  ];

  const chartData = data || defaultData;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Posts Totais</h3>
        <p className="text-4xl font-bold text-gray-900">{total}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
