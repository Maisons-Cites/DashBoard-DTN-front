
// === 3. components/dashboard/TicketCard.tsx ===
import React from 'react';

interface TicketCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    status: {
        color: string;
        bg: string;
        type: string;
    };
    threshold?: number;
    createdToday?: number;
}

export function TicketCard({
                               label,
                               value,
                               icon,
                               status,
                               threshold,
                               createdToday,
                           }: TicketCardProps) {
    return (
        <div
            className={`${status.bg} rounded-xl p-5 border-2 border-gray-200 flex flex-col items-center justify-center shadow-lg min-h-[180px]`}
        >
            <div className="text-gray-600 mb-3">{icon}</div>

            <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>

            <span className={`text-5xl md:text-6xl font-extrabold ${status.color}`}>
        {value}
      </span>

            {label === 'Créés' && typeof threshold === 'number' && (
                <div className="mt-2 text-xs font-medium text-gray-500 flex items-center gap-1.5">
                    seuil :{' '}
                    <span
                        className={
                            status.type === 'error'
                                ? 'text-red-600 font-semibold'
                                : 'text-gray-700'
                        }
                    >
            {threshold}
          </span>
                </div>
            )}

            {label === 'Résolus' && createdToday !== undefined && (
                <div className="mt-2 text-xs text-gray-600">
                    {value >= createdToday
                        ? '✓ À jour'
                        : createdToday - value === 1
                            ? '1 ticket en retard'
                            : `${createdToday - value} tickets en retard`}
                </div>
            )}
        </div>
    );
}
