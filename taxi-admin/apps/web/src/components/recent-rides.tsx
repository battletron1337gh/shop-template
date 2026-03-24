import { formatCurrency, formatDate } from '@/lib/utils';
import { PlatformType } from '@prisma/client';
import { Car, ArrowUpRight, Clock, MapPin } from 'lucide-react';

interface Ride {
  id: string;
  platform: PlatformType;
  rideDate: string;
  netAmount: number;
  paymentMethod: string;
  description?: string;
  distanceKm?: number;
}

interface RecentRidesProps {
  rides: Ride[];
}

const PLATFORM_CONFIG = {
  uber: {
    label: 'Uber',
    bg: 'bg-black',
    text: 'text-white',
    icon: '🚗',
  },
  bolt: {
    label: 'Bolt',
    bg: 'bg-green-500',
    text: 'text-white',
    icon: '⚡',
  },
  manual: {
    label: 'Handmatig',
    bg: 'bg-gray-500',
    text: 'text-white',
    icon: '📝',
  },
  other: {
    label: 'Overig',
    bg: 'bg-gray-400',
    text: 'text-white',
    icon: '🚕',
  },
};

const PAYMENT_ICONS: Record<string, string> = {
  cash: '💵',
  card: '💳',
  tikkie: '📱',
  other: '💰',
};

export function RecentRides({ rides }: RecentRidesProps) {
  if (rides.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen ritten gevonden</h3>
        <p className="text-gray-500 mb-4">Voeg je eerste rit toe om te beginnen</p>
        <a
          href="/dashboard/ritten/nieuw"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          Rit toevoegen
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Platform
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Datum
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Betaalmethode
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Bedrag
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rides.map((ride) => {
            const platform = PLATFORM_CONFIG[ride.platform] || PLATFORM_CONFIG.other;
            
            return (
              <tr 
                key={ride.id} 
                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium",
                      platform.bg,
                      platform.text
                    )}>
                      {platform.label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(ride.rideDate)}
                    </span>
                    {ride.distanceKm && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {ride.distanceKm} km
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg" title={ride.paymentMethod}>
                    {PAYMENT_ICONS[ride.paymentMethod] || '💰'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(Number(ride.netAmount))}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Helper voor cn functie
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
