'use client';

import { PlatformType } from '@prisma/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PlatformData {
  platform: PlatformType;
  amount: number;
  count: number;
}

interface PlatformChartProps {
  data: PlatformData[];
}

const COLORS = {
  uber: '#000000',
  bolt: '#24f800',
  manual: '#6b7280',
  other: '#9ca3af',
};

const PLATFORM_NAMES = {
  uber: 'Uber',
  bolt: 'Bolt',
  manual: 'Handmatig',
  other: 'Overig',
};

export function PlatformChart({ data }: PlatformChartProps) {
  const chartData = data.map((item) => ({
    name: PLATFORM_NAMES[item.platform],
    value: item.amount,
    color: COLORS[item.platform],
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Geen data beschikbaar
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('nl-NL', {
                style: 'currency',
                currency: 'EUR',
              }).format(value)
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
