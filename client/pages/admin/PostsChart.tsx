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
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Posts Totais</h3>
        <p className="text-4xl font-bold text-gray-900">{total}</p>
      </div>

      {/* Simple SVG chart */}
      <svg width="100%" height="300" viewBox="0 0 600 300" className="w-full">
        {/* Grid lines */}
        <g stroke="#e5e7eb" strokeDasharray="4">
          <line x1="40" y1="50" x2="580" y2="50" />
          <line x1="40" y1="100" x2="580" y2="100" />
          <line x1="40" y1="150" x2="580" y2="150" />
          <line x1="40" y1="200" x2="580" y2="200" />
          <line x1="40" y1="250" x2="580" y2="250" />
        </g>

        {/* Chart line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={chartData.map((d, i) => {
            const x = 40 + (i / (chartData.length - 1)) * 540;
            const y = 250 - (d.value / maxValue) * 200;
            return `${x},${y}`;
          }).join(' ')}
        />

        {/* Data points */}
        {chartData.map((d, i) => {
          const x = 40 + (i / (chartData.length - 1)) * 540;
          const y = 250 - (d.value / maxValue) * 200;
          return (
            <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" />
          );
        })}

        {/* X axis labels */}
        {chartData.map((d, i) => {
          const x = 40 + (i / (chartData.length - 1)) * 540;
          return (
            <text key={`label-${i}`} x={x} y="280" textAnchor="middle" fontSize="12" fill="#9ca3af">
              {d.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
