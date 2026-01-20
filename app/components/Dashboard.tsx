'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
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
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://dashboard-backend:8080';

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

    const [currentAs400Index, setCurrentAs400Index] = useState(0);
    const [currentTicketView, setCurrentTicketView] = useState(0);

    const isLoading = !permanence || !tickets || !as400Prod || !as400Test || !as400Form || !as400PreProd;
    const hasError = errPerm || errTick || errAsProd || errAsTest || errAsForm || errAsPreProd;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAs400Index((prev) => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTicketView((prev) => (prev + 1) % 2);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

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

    const permanenceToday = permanence.permanence_aujourdhui;
    if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-500 text-xl">Chargement...</div>;

    const { date, p1_by_team, p2_by_team, total_p1, total_p2, users } = permanence.permanence_aujourdhui;

    const as400Environments = [
        { name: 'PRODUCTION', data: as400Prod, color: 'bg-blue-500', icon: Building2 },
        { name: 'TEST', data: as400Test, color: 'bg-purple-500', icon: Activity },
        { name: 'FORMATION', data: as400Form, color: 'bg-orange-500', icon: Users2 },
        { name: 'PRÉ-PROD', data: as400PreProd, color: 'bg-indigo-500', icon: HardDrive },
    ];

    const currentAs400 = as400Environments[currentAs400Index];

    const currentHour = new Date().getHours();
    const isMorning = currentHour >= 8 && currentHour < 13;
    const isAfternoon = currentHour >= 13 && currentHour < 17;
    const currentPeriod = isMorning ? 'morning' : isAfternoon ? 'afternoon' : 'none';
    const currentTeams = isMorning ? p1_by_team : isAfternoon ? p2_by_team : {};
    const currentTotal = isMorning ? total_p1 : isAfternoon ? total_p2 : 0;
    const periodLabel = isMorning ? 'MATIN' : 'APRÈS-MIDI';
    const periodTime = isMorning ? '8h30 - 12h' : '13h - 17h';

    const getTicketStatus = (count: number, threshold?: number) => {
        if (!threshold) return { color: 'text-gray-700', bg: 'bg-gradient-to-br from-gray-50 to-gray-100', type: 'neutral' };
        if (count >= threshold * 1.5) return { color: 'text-red-600', bg: 'bg-gradient-to-br from-red-50 to-red-100', type: 'error' };
        if (count >= threshold) return { color: 'text-orange-600', bg: 'bg-gradient-to-br from-orange-50 to-orange-100', type: 'warning' };
        return { color: 'text-green-600', bg: 'bg-gradient-to-br from-green-50 to-green-100', type: 'good' };
    };

    const ticketViews = [
        {
            title: 'TICKETS EN ATTENTE',
            icon: <Clock3 size={28} />,
            items: [
                { label: 'En cours', value: tickets.tickets_en_cours, threshold: 400, icon: <Ticket size={48} strokeWidth={1.5} /> },
                { label: 'Non assignés', value: tickets.tickets_non_assignes, threshold: 100, icon: <AlertTriangle size={48} strokeWidth={1.5} /> },
            ],
        },
        {
            title: 'ACTIVITÉ DU JOUR',
            icon: <Activity size={28} />,
            items: [
                { label: 'Résolus', value: tickets.resolus_aujourdhui, icon: <CheckCircle2 size={48} strokeWidth={1.5} /> },
                { label: 'Créés', value: tickets.crees_aujourdhui, icon: <MessageSquare size={48} strokeWidth={1.5} /> },
            ],
        },
    ];

    const currentTickets = ticketViews[currentTicketView];
    const CurrentAs400Icon = currentAs400.icon;

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-gray-800 to-blue-900 overflow-hidden">
            <div className="h-full flex flex-col p-4">
                {/* Header */}
                <div className="text-center mb-3">
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-3">
                        <Gauge size={36} />
                        DASHBOARD DTN
                    </h1>
                    <p className="text-lg text-gray-300 flex items-center justify-center gap-2">
                        <Calendar size={18} />
                        {date}
                    </p>
                </div>

                {/* Grid principal - 3 colonnes égales */}
                <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                    {/* Permanence Section - Même hauteur que les autres */}
                    {currentPeriod !== 'none' && (
                        <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Timer size={28} />
                                    PERMANENCE {periodLabel}
                                </h2>
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full text-2xl font-bold shadow-lg">
                                    {currentTotal}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 text-center">{periodTime}</p>

                            <div className="grid grid-cols-2 gap-3 flex-1 overflow-auto">
                                {Object.entries(currentTeams).map(([team, trigrams]) => (
                                    <div key={team} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border-2 border-gray-200">
                                        <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">{team}</p>
                                        <div className="space-y-2">
                                            {(trigrams as string[]).map((trigram) => {
                                                const user = users[trigram];
                                                return (
                                                    <div key={trigram} className="flex items-center gap-2">
                                                        {user?.photoBase64 ? (
                                                            <img
                                                                src={user.photoBase64}
                                                                alt={user.displayName}
                                                                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                                                {trigram}
                                                            </div>
                                                        )}
                                                        <p className="text-xs font-semibold text-gray-900 truncate">
                                                            {user?.displayName || trigram}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tickets Carousel */}
                    <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {currentTickets.icon}
                                {currentTickets.title}
                            </h2>
                            <div className="flex space-x-2">
                                {ticketViews.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            idx === currentTicketView ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 flex-1">
                            {currentTickets.items.map((item, idx) => {
                                const status = getTicketStatus(item.value, 'threshold' in item ? item.threshold : undefined);

                                return (
                                    <div
                                        key={idx}
                                        className={`${status.bg} rounded-xl p-4 border-2 border-gray-200 hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center shadow-lg`}
                                    >
                                        <div className="text-gray-600 mb-3">
                                            {item.icon}
                                        </div>

                                        <div className="text-center mb-4">
                                            <p className="text-gray-700 font-semibold text-lg">{item.label}</p>
                                            {'threshold' in item && item.threshold && (
                                                <p className="text-xs text-gray-500 mt-1">Seuil : {item.threshold}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {status.type === 'good' ? (
                                                <CheckCircle size={42} className="text-green-600" strokeWidth={1.8} />
                                            ) : status.type === 'warning' ? (
                                                <AlertTriangle size={42} className="text-orange-600" strokeWidth={1.8} />
                                            ) : status.type === 'error' ? (
                                                <XCircle size={42} className="text-red-600" strokeWidth={1.8} />
                                            ) : (
                                                <Ticket size={42} className="text-gray-600" strokeWidth={1.8} />
                                            )}

                                            <span className={`text-6xl font-extrabold ${status.color} tracking-tight`}>
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Mis à jour : {new Date(tickets.updated_at).toLocaleTimeString('fr-FR')}
                        </p>
                    </div>

                    {/* IBM i Carousel */}
                    <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Server size={28} />
                                STATUT IBM i
                            </h2>
                            <div className="flex space-x-2">
                                {as400Environments.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            idx === currentAs400Index ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200 flex-1 flex flex-col justify-center">
                            <div className={`${currentAs400.color} text-white px-4 py-2 rounded-xl text-center mb-5 shadow-lg flex items-center justify-center gap-3`}>
                                <CurrentAs400Icon size={28} />
                                <span className="text-xl font-bold">{currentAs400.name}</span>
                            </div>

                            <div className="flex items-center justify-center gap-8 mb-5">
                                <div
                                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl animate-pulse ${
                                        currentAs400.data.available ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white"></div>
                                </div>
                                <div className="text-center">
                                    <p className={`text-2xl font-bold mb-1 ${currentAs400.data.available ? 'text-green-600' : 'text-red-600'}`}>
                                        {currentAs400.data.available ? 'DISPONIBLE' : 'INDISPONIBLE'}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800">{currentAs400.data.host}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 text-center shadow">
                                    <p className="text-gray-600 text-xs mb-1">Version</p>
                                    <p className="text-xl font-bold text-gray-900">{currentAs400.data.version}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center shadow">
                                    <p className="text-gray-600 text-xs mb-1">Temps de réponse</p>
                                    <p className="text-xl font-bold text-blue-600">{currentAs400.data.responseTime}</p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Mis à jour : {new Date(currentAs400.data.timestamp).toLocaleTimeString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}