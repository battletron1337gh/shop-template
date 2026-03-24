'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/stat-card';
import { RecentRides } from '@/components/recent-rides';
import { PlatformChart } from '@/components/platform-chart';
import { TrendChart } from '@/components/trend-chart';
import { formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Receipt, 
  Wallet, 
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const today = dashboardData?.today || {};
  const month = dashboardData?.thisMonth || {};
  const profitMargin = month.income > 0 ? ((month.profit / month.income) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('nl-NL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/ritten/nieuw"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all btn-shine"
          >
            <Plus className="h-5 w-5" />
            Rit toevoegen
          </Link>
          <Link
            href="/dashboard/kosten/nieuw"
            className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <Receipt className="h-5 w-5" />
            Kost toevoegen
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Omzet vandaag"
          value={formatCurrency(today.income || 0)}
          icon={Wallet}
          trend={+12}
          trendLabel="vs gisteren"
          color="blue"
          subtitle={`${today.rideCount || 0} ritten`}
        />
        <StatCard
          title="Winst deze maand"
          value={formatCurrency(month.profit || 0)}
          icon={TrendingUp}
          trend={+8}
          trendLabel="vs vorige maand"
          color="green"
          subtitle={`${profitMargin}% marge`}
        />
        <StatCard
          title="Ritten deze maand"
          value={month.rideCount || 0}
          icon={Car}
          color="purple"
          subtitle="Totaal"
        />
        <StatCard
          title="Kosten deze maand"
          value={formatCurrency(month.expenses || 0)}
          icon={Receipt}
          trend={-5}
          trendLabel="vs vorige maand"
          color="orange"
          subtitle={`${month.expenseCount || 0} uitgaven`}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Welkom terug! 👋</h2>
            <p className="text-blue-100 mt-1">
              Je hebt deze maand al <strong>{month.rideCount || 0} ritten</strong> gereden.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/belasting"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-all"
            >
              <Receipt className="h-4 w-4" />
              BTW bekijken
            </Link>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Omzet trends</h2>
              <p className="text-sm text-gray-500">Inkomsten vs kosten vs winst</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                +8%
              </span>
            </div>
          </div>
          <TrendChart />
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Per platform</h2>
              <p className="text-sm text-gray-500">Omzet verdeling</p>
            </div>
          </div>
          <PlatformChart data={dashboardData?.platformBreakdown || []} />
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recente ritten</h2>
            <p className="text-sm text-gray-500">Laatste 5 ritten</p>
          </div>
          <Link
            href="/dashboard/ritten"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            Alles bekijken
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <RecentRides rides={dashboardData?.recentRides || []} />
      </div>
    </div>
  );
}
