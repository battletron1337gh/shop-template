'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { FileText, Download, Calendar } from 'lucide-react';

interface BtwQuarter {
  quarter: number;
  vatReceived: number;
  vatPaid: number;
  vatPayable: number;
}

interface BtwOverview {
  year: number;
  quarters: BtwQuarter[];
  totalVatReceived: number;
  totalVatPaid: number;
  totalVatPayable: number;
}

export default function TaxPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'btw' | 'annual'>('btw');

  const { data: btwData } = useQuery<BtwOverview>({
    queryKey: ['btw-overview', year],
    queryFn: async () => {
      const response = await api.get(`/tax-reports/btw-overview?year=${year}`);
      return response.data.data;
    },
  });

  const { data: annualData } = useQuery({
    queryKey: ['annual-summary', year],
    queryFn: async () => {
      const response = await api.get(`/tax-reports/annual-summary?year=${year}`);
      return response.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Belasting</h1>
        <div className="flex items-center gap-4">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('btw')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'btw'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            BTW Overzicht
          </button>
          <button
            onClick={() => setActiveTab('annual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'annual'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Jaaroverzicht
          </button>
        </nav>
      </div>

      {activeTab === 'btw' && btwData && (
        <div className="space-y-6">
          {/* BTW Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500">BTW ontvangen</p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {formatCurrency(btwData.totalVatReceived)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500">BTW betaald</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatCurrency(btwData.totalVatPaid)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500">BTW te betalen</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {formatCurrency(btwData.totalVatPayable)}
              </p>
            </div>
          </div>

          {/* Quarterly Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Per kwartaal</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwartaal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">BTW ontvangen</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">BTW betaald</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Te betalen</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {btwData.quarters.map((q) => (
                  <tr key={q.quarter} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Q{q.quarter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                      {formatCurrency(q.vatReceived)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                      {formatCurrency(q.vatPaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(q.vatPayable)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'annual' && annualData && (
        <div className="space-y-6">
          {/* Annual Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500">Totale omzet</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(annualData.income.net)}
              </p>
              <p className="text-sm text-gray-500">
                {annualData.income.totalRides} ritten
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500">Totale kosten</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatCurrency(annualData.expenses.total)}
              </p>
              <p className="text-sm text-gray-500">
                {annualData.expenses.totalExpenses} uitgaven
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500">Netto winst</p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {formatCurrency(annualData.profit)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500">BTW ontvangen</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {formatCurrency(annualData.income.vat)}
              </p>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
              <FileText className="h-4 w-4 mr-2" />
              Jaarrapport downloaden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
