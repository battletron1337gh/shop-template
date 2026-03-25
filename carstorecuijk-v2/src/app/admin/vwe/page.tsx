'use client';

import { useState, useEffect } from 'react';
import { vweClient } from '@/lib/vwe-client';

interface SyncStatus {
  lastSync: string | null;
  totalCars: number;
  vweCars: number;
  manualCars: number;
  isConfigured: boolean;
}

export default function VWEAdminPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Laad status bij opstart
  useEffect(() => {
    checkStatus();
  }, []);

  // Test VWE connectie
  const testConnection = async () => {
    setIsLoading(true);
    addLog('Testen VWE API connectie...');
    
    try {
      const result = await vweClient.testConnection();
      setTestResult(result);
      addLog(result.message);
    } catch (error) {
      addLog(`Fout: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Start handmatige sync
  const startSync = async () => {
    setIsLoading(true);
    addLog('🔄 Starten VWE sync...');
    
    try {
      const response = await fetch('/api/vwe/sync', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ Sync succesvol! ${result.imported} occasions geïmporteerd`);
        checkStatus();
      } else {
        addLog(`❌ Sync mislukt: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Fout: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check huidige status
  const checkStatus = async () => {
    try {
      const response = await fetch('/api/vwe/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Kon status niet laden:', error);
    }
  };

  // Voeg log toe
  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
  };

  // Clear logs
  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">VWE Admin</h1>
          <p className="text-white/60">Beheer de koppeling met VWE Vehicle Web Exchange</p>
        </div>

        {/* Status Cards */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
              <p className="text-white/40 text-sm mb-1">API Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${status.isConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-semibold">{status.isConfigured ? 'Verbonden' : 'Niet geconfigureerd'}</span>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
              <p className="text-white/40 text-sm mb-1">Totaal Occasions</p>
              <p className="text-2xl font-bold">{status.totalCars}</p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
              <p className="text-white/40 text-sm mb-1">VWE Auto's</p>
              <p className="text-2xl font-bold text-[#c8102e]">{status.vweCars}</p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
              <p className="text-white/40 text-sm mb-1">Handmatig</p>
              <p className="text-2xl font-bold">{status.manualCars}</p>
            </div>
          </div>
        )}

        {/* Acties */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold mb-4">Acties</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Testen...' : 'Test Connectie'}
            </button>
            
            <button
              onClick={startSync}
              disabled={isLoading}
              className="px-6 py-3 bg-[#c8102e] hover:bg-[#a00d24] rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sync bezig...' : 'Start Sync'}
            </button>
            
            <button
              onClick={checkStatus}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
            >
              Ververs Status
            </button>
          </div>

          {/* Test Resultaat */}
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <p className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                {testResult.message}
              </p>
            </div>
          )}
        </div>

        {/* Configuratie Help */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold mb-4">Configuratie</h2>
          
          <div className="space-y-3 text-sm">
            <p className="text-white/60">Om VWE te koppelen, voeg dit toe aan je <code className="bg-white/10 px-2 py-1 rounded">.env.local</code>:</p>
            
            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-green-400">
{`# VWE API Configuratie
VWE_API_KEY=your_api_key_here
VWE_CLIENT_ID=your_client_id_here
VWE_BASE_URL=https://api.vwe.nl/v1
VWE_WEBHOOK_SECRET=your_webhook_secret_here`}
            </pre>
            
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 font-semibold mb-2">💡 Webhook URL</p>
              <p className="text-white/60 text-sm">Registreer deze URL in je VWE Developers menu:</p>
              <code className="text-blue-300">https://jouw-website.nl/api/vwe/webhook</code>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Logs</h2>
            <button
              onClick={clearLogs}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              Wissen
            </button>
          </div>
          
          <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-white/40">Geen logs beschikbaar...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 text-white/70">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
