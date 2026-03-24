'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Menu, X, Bell, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="lg:hidden sticky top-0 z-40">
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaxiBoek
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/ritten/nieuw"
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </Link>
            <button className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white">
            <nav className="px-4 py-3 space-y-1">
              {[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Ritten', href: '/dashboard/ritten' },
                { name: 'Kosten', href: '/dashboard/kosten' },
                { name: 'Belasting', href: '/dashboard/belasting' },
                { name: 'Instellingen', href: '/dashboard/instellingen' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
