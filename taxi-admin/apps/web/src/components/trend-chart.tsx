'use client';

import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '@/lib/api';
import { useState } from 'react';

export function TrendChart() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['chart', period],
    queryFn: async () => {
      const response = await api.get(`/dashboard/chart?period=${period}`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />;
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Geen data beschikbaar
      </div>
    );
  }

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 text-sm rounded-md ${
              period === p
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p === 'week' && 'Week'}
            {p === 'month' && 'Maand'}
            {p === 'quarter' && 'Kwartaal'}
            {p === 'year' && 'Jaar'}
          </button>
        ))}
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat('nl-NL', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(value)
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              name="Omzet"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Kosten"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Winst"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
