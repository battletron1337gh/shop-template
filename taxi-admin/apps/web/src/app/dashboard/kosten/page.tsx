'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Receipt, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Expense {
  id: string;
  expenseDate: string;
  category: string;
  description: string;
  amount: number;
  vatAmount: number;
  receipt?: {
    status: string;
  };
}

const CATEGORIES: Record<string, string> = {
  brandstof: 'Brandstof',
  onderhoud: 'Onderhoud',
  verzekering: 'Verzekering',
  wegenvignet: 'Wegenvignet',
  parkeerkosten: 'Parkeerkosten',
  telefoon: 'Telefoon',
  administratie: 'Administratie',
  overig: 'Overig',
};

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', page],
    queryFn: async () => {
      const response = await api.get(`/expenses?skip=${(page - 1) * 20}&take=20`);
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Kost verwijderd');
    },
  });

  if (isLoading) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />;
  }

  const expenses = data?.expenses || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Kosten</h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard/kosten/upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Receipt className="h-4 w-4 mr-2" />
            Bonnetje uploaden
          </Link>
          <Link
            href="/dashboard/kosten/nieuw"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Kost toevoegen
          </Link>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Omschrijving</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">BTW</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Totaal</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Bon</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense: Expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(expense.expenseDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {CATEGORIES[expense.category] || expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(Number(expense.vatAmount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(Number(expense.amount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {expense.receipt ? (
                      <span className="text-green-600">
                        {expense.receipt.status === 'completed' ? '✓' : <Loader2 className="h-4 w-4 animate-spin inline" />}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        if (confirm('Weet je zeker dat je deze kost wilt verwijderen?')) {
                          deleteMutation.mutate(expense.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {expenses.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Geen kosten gevonden. Voeg je eerste kost toe!
          </div>
        )}

        {total > 20 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Vorige
            </button>
            <span className="text-sm text-gray-600">
              Pagina {page} van {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Volgende
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
