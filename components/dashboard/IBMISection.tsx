
// === 6. components/dashboard/IBMiSection.tsx ===
import React from 'react';
import { Server, Building2, Activity, Users2, HardDrive } from 'lucide-react';
import { IBMiCard } from './IBMICard';

interface IBMiSectionProps {
    as400Prod: any;
    as400Test: any;
    as400Form: any;
    as400PreProd: any;
}

export function IBMiSection({
                                as400Prod,
                                as400Test,
                                as400Form,
                                as400PreProd,
                            }: IBMiSectionProps) {
    const as400Environments = [
        { name: 'PRODUCTION', data: as400Prod, color: 'bg-blue-500', icon: Building2 },
        { name: 'TEST', data: as400Test, color: 'bg-purple-500', icon: Activity },
        { name: 'FORMATION', data: as400Form, color: 'bg-orange-500', icon: Users2 },
        { name: 'PRÉ-PROD', data: as400PreProd, color: 'bg-indigo-500', icon: HardDrive },
    ];

    return (
        <div className="bg-white rounded-xl shadow-2xl p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Server size={28} />
                STATUT IBM i
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {as400Environments.map((env, i) => (
                    <IBMiCard
                        key={i}
                        name={env.name}
                        color={env.color}
                        icon={env.icon}
                        data={env.data}
                    />
                ))}
            </div>
        </div>
    );
}
