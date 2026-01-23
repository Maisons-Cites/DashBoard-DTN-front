
// === 5. components/dashboard/IBMiCard.tsx ===
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IBMiCardProps {
    name: string;
    color: string;
    icon: LucideIcon;
    data: {
        available: boolean;
        host?: string;
        version?: string;
        responseTime?: string;
    };
}

export function IBMiCard({ name, color, icon: Icon, data }: IBMiCardProps) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 shadow">
            <div
                className={`${color} text-white px-3 py-2 rounded-lg mb-3 flex items-center justify-center gap-2`}
            >
                <Icon size={20} />
                <span className="font-bold text-sm">{name}</span>
            </div>

            <p
                className={`text-lg font-bold text-center mb-1 ${
                    data?.available ? 'text-green-600' : 'text-red-600'
                }`}
            >
                {data?.available ? 'DISPONIBLE' : 'INDISPONIBLE'}
            </p>

            <p className="text-xs text-center text-gray-600">
                {data?.host || '—'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                <div>
                    <p className="text-xs text-gray-500">Version</p>
                    <p className="font-bold">{data?.version || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Réponse</p>
                    <p className="font-bold text-blue-600">
                        {data?.responseTime || '—'}
                    </p>
                </div>
            </div>
        </div>
    );
}