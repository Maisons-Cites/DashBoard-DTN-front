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

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dashboard-dtn.maisonsetcites.fr';

export default function Dashboard() {
    const { data: permanence, error: errPerm } = useSWR(
        `${BACKEND_URL}/api/permanence`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const { data: tickets, error: errTick } = useSWR(
        `${BACKEND_URL}/api/tickets`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const { data: as400Prod, error: errAsProd } = useSWR(
        `${BACKEND_URL}/api/as400/prod`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const { data: as400Test, error: errAsTest } = useSWR(
        `${BACKEND_URL}/api/as400/test`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const { data: as400Form, error: errAsForm } = useSWR(
        `${BACKEND_URL}/api/as400/form`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const { data: as400PreProd, error: errAsPreProd } = useSWR(
        `${BACKEND_URL}/api/as400/preProd`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const hasError = errPerm || errTick || errAsProd || errAsTest || errAsForm || errAsPreProd;

    if (hasError) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600 text-xl">
                Erreur de chargement des données
            </div>
        );
    }

    if (!permanence || !permanence.permanence_aujourdhui) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500 text-xl">
                Données de permanence non disponibles
            </div>
        );
    }

    const isLoading = !permanence || !tickets || !as400Prod || !as400Test || !as400Form || !as400PreProd;
    if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-500 text-xl">Chargement...</div>;

    const { date, p1_by_team, p2_by_team, total_p1, total_p2, users } = permanence.permanence_aujourdhui;

    const currentHour = new Date().getHours();
    const isMorning = currentHour >= 8 && currentHour < 13;
    const isAfternoon = currentHour >= 13 && currentHour < 17;
    const currentPeriod = isMorning ? 'morning' : isAfternoon ? 'afternoon' : 'none';
    const currentTeams = isMorning ? p1_by_team : isAfternoon ? p2_by_team : {};
    const currentTotal = isMorning ? total_p1 : isAfternoon ? total_p2 : 0;
    const periodLabel = isMorning ? 'MATIN' : isAfternoon ? 'APRÈS-MIDI' : '';
    const periodTime = isMorning ? '8h30 – 12h' : isAfternoon ? '13h – 17h' : '';

    const getTicketStatus = (count: number, threshold?: number) => {
        if (!threshold) return { color: 'text-gray-700', bg: 'bg-gray-50', type: 'neutral' };
        if (count >= threshold * 1.5) return { color: 'text-red-700', bg: 'bg-red-50', type: 'error' };
        if (count >= threshold) return { color: 'text-orange-700', bg: 'bg-orange-50', type: 'warning' };
        return { color: 'text-green-700', bg: 'bg-green-50', type: 'good' };
    };

    const as400Environments = [
        { name: 'PROD', data: as400Prod, color: 'bg-blue-600', icon: Building2 },
        { name: 'TEST', data: as400Test, color: 'bg-purple-600', icon: Activity },
        { name: 'FORM', data: as400Form, color: 'bg-orange-600', icon: Users2 },
        { name: 'PRE-PROD', data: as400PreProd, color: 'bg-indigo-600', icon: HardDrive },
    ];

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white overflow-hidden">
            <div className="h-full flex flex-col p-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="text-4xl font-bold flex items-center justify-center gap-4">
                        <Gauge size={40} className="text-blue-400" />
                        DASHBOARD DTN
                    </h1>
                    <p className="text-lg text-gray-400 mt-1 flex items-center justify-center gap-2">
                        <Calendar size={18} />
                        {date} — {periodLabel && `${periodLabel} (${periodTime})`}
                    </p>
                </div>

                {/* Contenu principal */}
                <div className="flex-1 grid grid-rows-[auto_1fr] gap-5 min-h-0">
                    {/* 1. PERMANENCE – plein largeur */}
                    {currentPeriod !== 'none' && (
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-5 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Timer size={32} className="text-blue-400" />
                                    Permanence {periodLabel}
                                </h2>
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full text-3xl font-bold shadow-lg">
                                    {currentTotal}
                                </div>
                            </div>

                            {/* Vignettes full-width avec scroll horizontal */}
                            <div className="overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                <div className="flex gap-4 min-w-max">
                                    {Object.entries(currentTeams).map(([team, trigrams]) => (
                                        <div key={team} className="min-w-[220px] bg-gray-800/70 rounded-xl p-4 border border-gray-700">
                                            <p className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">{team}</p>
                                            <div className="space-y-3">
                                                {(trigrams as string[]).map((trigram) => {
                                                    const user = users[trigram];
                                                    return (
                                                        <div key={trigram} className="flex items-center gap-3">
                                                            {user?.photoBase64 ? (
                                                                <img
                                                                    src={user.photoBase64}
                                                                    alt={user.displayName}
                                                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40 shadow-md"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                                    {trigram}
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <p className="font-medium truncate">{user?.displayName || trigram}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Tickets + Statut IBM i – grille de petites cartes */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
                        {/* Tickets – 2 cartes */}
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-5 col-span-2 lg:col-span-2 flex flex-col">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock3 size={24} />
                                Tickets en attente
                            </h3>
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                {[
                                    { label: 'En cours', value: tickets?.tickets_en_cours ?? 0, threshold: 400, icon: Ticket },
                                    { label: 'Non assignés', value: tickets?.tickets_non_assignes ?? 0, threshold: 100, icon: AlertTriangle },
                                ].map((item, i) => {
                                    const status = getTicketStatus(item.value, item.threshold);
                                    return (
                                        <div
                                            key={i}
                                            className={`${status.bg} rounded-xl p-4 flex flex-col items-center justify-center border border-gray-700/30 shadow-sm hover:scale-[1.03] transition-transform`}
                                        >
                                            <item.icon size={36} className="mb-2 opacity-80" />
                                            <p className="text-sm text-gray-300 mb-1">{item.label}</p>
                                            <p className={`text-4xl font-extrabold ${status.color}`}>
                                                {item.value}
                                            </p>
                                            {item.threshold && (
                                                <p className="text-xs text-gray-500 mt-1">seuil {item.threshold}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-5 col-span-2 lg:col-span-2 flex flex-col">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Activity size={24} />
                                Activité jour
                            </h3>
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                {[
                                    { label: 'Résolus', value: tickets?.resolus_aujourdhui ?? 0, icon: CheckCircle2 },
                                    { label: 'Créés', value: tickets?.crees_aujourdhui ?? 0, icon: MessageSquare },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-900/40 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-700/30 shadow-sm hover:scale-[1.03] transition-transform"
                                    >
                                        <item.icon size={36} className="mb-2 text-blue-400" />
                                        <p className="text-sm text-gray-300 mb-1">{item.label}</p>
                                        <p className="text-4xl font-extrabold text-white">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Statut IBM i – 4 petites cartes */}
                        {as400Environments.map((env, i) => {
                            if (!env.data) return null;
                            const { available, host, version, responseTime, timestamp } = env.data;
                            return (
                                <div
                                    key={i}
                                    className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform"
                                >
                                    <div className={`${env.color} text-white px-3 py-1 rounded-lg text-sm font-bold mb-3 inline-block`}>
                                        {env.name}
                                    </div>

                                    <div className="flex items-center justify-center gap-3 my-2">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                                                available ? 'bg-green-600' : 'bg-red-600'
                                            }`}
                                        >
                                            <div className="w-5 h-5 rounded-full bg-white/30"></div>
                                        </div>
                                        <p className={`font-bold ${available ? 'text-green-400' : 'text-red-400'}`}>
                                            {available ? 'OK' : 'HS'}
                                        </p>
                                    </div>

                                    <div className="text-xs space-y-1 mt-2 text-center">
                                        <p className="font-medium truncate">{host}</p>
                                        <p>v{version}</p>
                                        <p className="text-blue-300">{responseTime}</p>
                                        <p className="text-gray-500 mt-2">
                                            {new Date(timestamp).toLocaleTimeString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}