import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
  },
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel, 
  subtitle,
  color = 'blue' 
}: StatCardProps) {
  const colors = colorClasses[color];
  const isPositive = trend && trend >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
          
          {trend !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              )}>
                {isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {isPositive ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-gray-400">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl",
          colors.bg
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
