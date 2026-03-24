'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import {
  LayoutDashboard,
  Car,
  Receipt,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ritten', href: '/dashboard/ritten', icon: Car },
  { name: 'Kosten', href: '/dashboard/kosten', icon: Receipt },
  { name: 'Belasting', href: '/dashboard/belasting', icon: FileText },
  { name: 'Instellingen', href: '/dashboard/instellingen', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72">
      {/* Sidebar background with gradient */}
      <div className="flex flex-col flex-grow bg-slate-900 overflow-y-auto">
        {/* Logo Area */}
        <div className="flex items-center h-20 px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">TaxiBoek</span>
              <p className="text-xs text-slate-400">Boekhouding</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                )} />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-white/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5" />
            Uitloggen
          </button>
        </div>
      </div>
    </div>
  );
}
