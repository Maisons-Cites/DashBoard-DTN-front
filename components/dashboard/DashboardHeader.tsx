
// === 8. components/dashboard/DashboardHeader.tsx ===
import React from 'react';
import { Gauge, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
    date?: string;
}

export function DashboardHeader({ date }: DashboardHeaderProps) {
    return (
        <div className="text-center mb-3">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                <Gauge size={36} />
                DASHBOARD DTN
            </h1>
            <p className="text-lg text-gray-300 flex items-center justify-center gap-2">
                <Calendar size={18} />
                {date || '—'}
            </p>
        </div>
    );
}