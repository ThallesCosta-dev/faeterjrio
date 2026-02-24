import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'orange';
}

export function StatCard({ label, value, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsGridProps {
  drafts: number;
  published: number;
  activeUsers: number;
}

export function StatsGrid({ drafts, published, activeUsers }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Rascunhos" value={drafts} color="orange" />
      <StatCard label="Publicados" value={published} color="green" />
      <StatCard label="Usuários Ativos" value={activeUsers} color="blue" />
    </div>
  );
}
