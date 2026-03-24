'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'tax'>('profile');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Instellingen</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profiel
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'subscription'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Abonnement
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'tax'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Belasting
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Naam</label>
                <p className="mt-1 text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              <div className="pt-4 border-t">
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Uitloggen
                </button>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Huidig plan</p>
                <p className="text-2xl font-bold text-gray-900">Pro</p>
                <p className="text-sm text-gray-500">€25/maand</p>
              </div>
              <button className="text-primary-600 hover:text-primary-800 font-medium">
                Abonnement wijzigen
              </button>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">KVK nummer</label>
                <input
                  type="text"
                  placeholder="12345678"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">BTW nummer</label>
                <input
                  type="text"
                  placeholder="NL123456789B01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Kleine Ondernemers Regeling (KOR)
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
