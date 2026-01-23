
// === 9. app/dashboard/page.tsx (ou components/Dashboard.tsx) ===
'use client';

import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PermanenceSection } from '@/components/dashboard/PermanenceSection';
import { TicketsSection } from '@/components/dashboard/TicketsSection';
import { IBMiSection } from '@/components/dashboard/IBMISection';

export default function Dashboard() {
    const {
        permData,
        ticketsData,
        as400Prod,
        as400Test,
        as400Form,
        as400PreProd,
        isLoading,
        hasError,
    } = useDashboardData();

    if (hasError) {
        return (
            <div className="h-screen flex items-center justify-center text-red-400 text-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950">
                Erreur de chargement des données
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-300 text-2xl bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900">
                Chargement...
            </div>
        );
    }

    const permanenceToday = permData?.permanence_aujourdhui ?? {};
    const { date, p1_by_team = {}, p2_by_team = {}, users = {} } = permanenceToday;

    const hour = new Date().getHours();
    const isMorning = hour >= 8 && hour < 13;
    const isAfternoon = hour >= 13 && hour < 17;

    const currentTeams = isMorning ? p1_by_team : isAfternoon ? p2_by_team : {};
    const periodLabel = isMorning ? 'MATIN' : isAfternoon ? 'APRÈS-MIDI' : '';
    const periodTime = isMorning ? '8h30 – 12h' : isAfternoon ? '13h – 17h' : '';

    const tickets = {
        enCours: ticketsData?.tickets_en_cours ?? 0,
        nonAssignes: ticketsData?.tickets_non_assignes ?? 0,
        resolus: ticketsData?.resolus_aujourdhui ?? 0,
        crees: ticketsData?.crees_aujourdhui ?? 0,
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-gray-800 to-blue-900 overflow-hidden">
            <div className="h-full flex flex-col p-4">
                <DashboardHeader date={date} />

                <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                    <PermanenceSection
                        date={date}
                        currentTeams={currentTeams}
                        users={users}
                        periodLabel={periodLabel}
                        periodTime={periodTime}
                    />

                    <TicketsSection tickets={tickets} />

                    <IBMiSection
                        as400Prod={as400Prod}
                        as400Test={as400Test}
                        as400Form={as400Form}
                        as400PreProd={as400PreProd}
                    />
                </div>
            </div>
        </div>
    );
}