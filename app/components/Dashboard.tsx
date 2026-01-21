'use client';

import useSWR from 'swr';
import { useState } from 'react';
import {
    Ticket,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Gauge,
    Calendar,
    Building2,
    Server,
    Activity,
    Timer,
    HardDrive,
    CheckCircle2,
    Clock3,
    Users2,
} from 'lucide-react';

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
    });

const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://dashboard-dtn.maisonsetcites.fr';

export default function Dashboard() {
    const { data: permData, error: errPerm } = useSWR(
        `${BACKEND_URL}/api/permanence`,
        fetcher,
        { refreshInterval: 300_000 }
    );

    const { data: ticketsData, error: errTickets } = useSWR(
        `${BACKEND_URL}/api/tickets`,
        fetcher,
        { refreshInterval: 300_000 }
    );

    const { data: as400Prod, error: errProd } = useSWR(
        `${BACKEND_URL}/api/as400/prod`,
        fetcher,
        { refreshInterval: 300_000 }
    );

    const { data: as400Test, error: errTest } = useSWR(
        `${BACKEND_URL}/api/as400/test`,
        fetcher,
        { refreshInterval: 300_000 }
    );

    const { data: as400Form, error: errForm } = useSWR(
        `${BACKEND_URL}/api/as400/form`,
        fetcher,
        { refreshInterval: 300_000 }
    );

    const { data: as400PreProd, error: errPreProd } = useSWR(
        `${BACKEND_URL}/api/as400/preProd`,
        fetcher,
        { refreshInterval: 300_000 }
    );

    const isLoading =
        !permData ||
        !ticketsData ||
        !as400Prod ||
        !as400Test ||
        !as400Form ||
        !as400PreProd;

    const hasError =
        errPerm || errTickets || errProd || errTest || errForm || errPreProd;

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


    function TeamPersonCard({
                                team,
                                trigram,
                                user,
                            }: {
        team: string;
        trigram: string;
        user?: any;
    }) {
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

    /* ---------------- PERMANENCE ---------------- */

    const permanenceToday = permData?.permanence_aujourdhui ?? {};
    const {
        date,
        p1_by_team = {},
        p2_by_team = {},
        total_p1 = 0,
        total_p2 = 0,
        users = {},
    } = permanenceToday;

    const hour = new Date().getHours();
    const isMorning = hour >= 8 && hour < 13;
    const isAfternoon = hour >= 13 && hour < 17;

    const currentTeams = isMorning
        ? p1_by_team
        : isAfternoon
            ? p2_by_team
            : {};

    const currentTotal = isMorning
        ? total_p1
        : isAfternoon
            ? total_p2
            : 0;

    const periodLabel = isMorning
        ? 'MATIN'
        : isAfternoon
            ? 'APRÈS-MIDI'
            : '';

    const periodTime = isMorning
        ? '8h30 – 12h'
        : isAfternoon
            ? '13h – 17h'
            : '';

    /* ---------------- TICKETS ---------------- */

    const tickets = {
        enCours: ticketsData?.tickets_en_cours ?? 0,
        nonAssignes: ticketsData?.tickets_non_assignes ?? 0,
        resolus: ticketsData?.resolus_aujourdhui ?? 0,
        crees: ticketsData?.crees_aujourdhui ?? 0,
    };

    const getTicketStatus = (count: number, threshold?: number) => {
        if (!threshold)
            return {
                color: 'text-gray-700',
                bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
                type: 'neutral',
            };

        if (count >= threshold * 1.5)
            return {
                color: 'text-red-600',
                bg: 'bg-gradient-to-br from-red-50 to-red-100',
                type: 'error',
            };

        if (count >= threshold)
            return {
                color: 'text-orange-600',
                bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
                type: 'warning',
            };

        return {
            color: 'text-green-600',
            bg: 'bg-gradient-to-br from-green-50 to-green-100',
            type: 'good',
        };
    };

    const ticketCards = [
        {
            label: 'En cours',
            value: tickets.enCours,
            threshold: 400,
            icon: <Ticket size={40} />,
        },
        {
            label: 'Non assignés',
            value: tickets.nonAssignes,
            threshold: 100,
            icon: <AlertTriangle size={40} />,
        },
        {
            label: 'Résolus',
            value: tickets.resolus,
            icon: <CheckCircle2 size={40} />,
        },
        {
            label: 'Créés',
            value: tickets.crees,
            icon: <MessageSquare size={40} />,
        },
    ];

    /* ---------------- IBM i ---------------- */

    const as400Environments = [
        { name: 'PRODUCTION', data: as400Prod, color: 'bg-blue-500', icon: Building2 },
        { name: 'TEST', data: as400Test, color: 'bg-purple-500', icon: Activity },
        { name: 'FORMATION', data: as400Form, color: 'bg-orange-500', icon: Users2 },
        { name: 'PRÉ-PROD', data: as400PreProd, color: 'bg-indigo-500', icon: HardDrive },
    ];

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-gray-800 to-blue-900 overflow-hidden">
            <div className="h-full flex flex-col p-4">
                {/* Header */}
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

                {/* GRID PRINCIPALE */}
                <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">

                    {/* PERMANENCE */}
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
                            {Object.entries(currentTeams).flatMap(
                                ([team, trigrams]: any) =>
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

                    {/* TICKETS – GRILLE */}
                    <div className="bg-white rounded-xl shadow-2xl p-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock3 size={28} />
                            TICKETS
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {ticketCards.map((item, i) => {
                                const status = getTicketStatus(
                                    item.value,
                                    item.threshold
                                );

                                return (
                                    <div
                                        key={i}
                                        className={`${status.bg} rounded-xl p-4 border-2 border-gray-200 flex flex-col items-center shadow-lg`}
                                    >
                                        <div className="text-gray-600 mb-2">
                                            {item.icon}
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            {item.label}
                                        </p>
                                        <span
                                            className={`text-5xl font-extrabold ${status.color}`}
                                        >
                                            {item.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* IBM i – GRILLE */}
                    <div className="bg-white rounded-xl shadow-2xl p-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Server size={28} />
                            STATUT IBM i
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {as400Environments.map((env, i) => {
                                const Icon = env.icon;
                                return (
                                    <div
                                        key={i}
                                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 shadow"
                                    >
                                        <div
                                            className={`${env.color} text-white px-3 py-2 rounded-lg mb-3 flex items-center justify-center gap-2`}
                                        >
                                            <Icon size={20} />
                                            <span className="font-bold text-sm">
                                                {env.name}
                                            </span>
                                        </div>

                                        <p
                                            className={`text-lg font-bold text-center mb-1 ${
                                                env.data?.available
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {env.data?.available
                                                ? 'DISPONIBLE'
                                                : 'INDISPONIBLE'}
                                        </p>

                                        <p className="text-xs text-center text-gray-600">
                                            {env.data?.host || '—'}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Version
                                                </p>
                                                <p className="font-bold">
                                                    {env.data?.version || '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Réponse
                                                </p>
                                                <p className="font-bold text-blue-600">
                                                    {env.data?.responseTime || '—'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
