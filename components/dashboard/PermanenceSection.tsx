
// === 2. components/dashboard/PermanenceSection.tsx ===
import React from 'react';
import { Timer } from 'lucide-react';
import { TeamPersonCard } from './TeamPersonCard';

interface PermanenceSectionProps {
    date?: string;
    currentTeams: Record<string, string[]>;
    users: Record<string, any>;
    periodLabel: string;
    periodTime: string;
}

export function PermanenceSection({
                                      date,
                                      currentTeams,
                                      users,
                                      periodLabel,
                                      periodTime,
                                  }: PermanenceSectionProps) {
    return (
        <section className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-lg flex gap-2">
                    <Timer size={20} /> PERMANENCE {periodLabel}
                </h2>
            </div>

            <p className="text-xs text-gray-500 text-center mb-3">
                {periodTime}
            </p>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {Object.entries(currentTeams).flatMap(([team, trigrams]) =>
                    trigrams.map((tri: string) => (
                        <TeamPersonCard
                            key={`${team}-${tri}`}
                            team={team}
                            trigram={tri}
                            user={users[tri]}
                        />
                    ))
                )}
            </div>
        </section>
    );
}