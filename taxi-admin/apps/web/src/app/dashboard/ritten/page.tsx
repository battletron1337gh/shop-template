'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Plus, Search, Filter, Trash2, Edit, Car, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PlatformType } from '@prisma/client';

interface Ride {
  id: string;
  platform: PlatformType;
  rideDate: string;
  grossAmount: number;
  platformCommission: number;
  netAmount: number;
  paymentMethod: string;
  description?: string;
}

const PLATFORM_CONFIG = {
  uber: { label: 'Uber', bg: 'bg-black', icon: '🚗' },
  bolt: { label: 'Bolt', bg: 'bg-green-500', icon: '⚡' },
  manual: { label: 'Handmatig', bg: 'bg-gray-500', icon: '📝' },
  other: { label: 'Overig', bg: 'bg-gray-400', icon: '🚕' },
};

export default function RidesPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<PlatformType | ''>('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['rides', page, filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('skip', String((page - 1) * 20));
      params.append('take', '20');
      if (filter) params.append('platform', filter);
      
      const response = await api.get(`/rides?${params.toString()}`);
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/rides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Rit verwijderd');
    },
    onError: () => {
      toast.error('Kon rit niet verwijderen');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const rides = data?.rides || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ritten</h1>
          <p className="text-gray-500 mt-1">Beheer al je ritten op één plek</p>
        </div>
        <Link
          href="/dashboard/ritten/nieuw"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all btn-shine"
        >
          <Plus className="h-5 w-5" />
          Rit toevoegen
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek ritten..."
              className="flex-1 outline-none text-gray-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as PlatformType | '')}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="">Alle platforms</option>
              <option value="uber">Uber</option>
              <option value="bolt">Bolt</option>
              <option value="manual">Handmatig</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Car className="h-5 w-5 text-blue-100" />
            <span className="text-blue-100 text-sm">Totaal ritten</span>
          </div>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-emerald-100 text-sm">Netto omzet</span>
          </div>
          <p className="text-3xl font-bold">
            {formatCurrency(rides.reduce((sum: number, r: any) => sum + Number(r.netAmount), 0))}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-purple-100 text-sm">Gemiddelde rit</span>
          </div>
          <p className="text-3xl font-bold">
            {formatCurrency(rides.length > 0 ? rides.reduce((sum: number, r: any) => sum + Number(r.netAmount), 0) / rides.length : 0)}
          </p>
        </div>
      </div>

      {/* Rides Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {rides.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen ritten gevonden</h3>
            <p className="text-gray-500 mb-4">Voeg je eerste rit toe</p>
            <Link
              href="/dashboard/ritten/nieuw"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Rit toevoegen
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Datum</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Platform</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Omschrijving</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Bruto</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Commissie</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Netto</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rides.map((ride: Ride) => {
                    const platform = PLATFORM_CONFIG[ride.platform] || PLATFORM_CONFIG.other;
                    
                    return (
                      <tr key={ride.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(ride.rideDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{platform.icon}</span>
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-white",
                              platform.bg
                            )}>
                              {platform.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {ride.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(Number(ride.grossAmount))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                          -{formatCurrency(Number(ride.platformCommission))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600 text-right">
                          {formatCurrency(Number(ride.netAmount))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => {
                              if (confirm('Weet je zeker dat je deze rit wilt verwijderen?')) {
                                deleteMutation.mutate(ride.id);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > 20 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors"
                >
                  Vorige
                </button>
                <span className="text-sm text-gray-600">
                  Pagina {page} van {Math.ceil(total / 20)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors"
                >
                  Volgende
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
