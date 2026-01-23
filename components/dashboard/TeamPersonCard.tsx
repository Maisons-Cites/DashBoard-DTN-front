// === 1. components/dashboard/TeamPersonCard.tsx ===
import React from 'react';

interface TeamPersonCardProps {
    team: string;
    trigram: string;
    user?: {
        photoBase64?: string;
        displayName?: string;
    };
}

export function TeamPersonCard({ team, trigram, user }: TeamPersonCardProps) {
    return (
        <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 flex flex-col shadow">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-600 mb-2">
                {team}
            </p>

            <div className="flex flex-col items-center justify-center flex-1">
                {user?.photoBase64 ? (
                    <img
                        src={user.photoBase64}
                        alt={user.displayName}
                        className="w-24 h-24 rounded-full object-cover shadow-lg mb-3"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-3">
                        {trigram}
                    </div>
                )}

                <p className="text-lg font-bold text-gray-900 text-center leading-tight">
                    {user?.displayName || trigram}
                </p>
            </div>
        </div>
    );
}