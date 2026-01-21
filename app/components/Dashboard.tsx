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

const fetcher = (url: string) => fetch(url).then(res => res.json());
const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://dashboard-dtn.maisonsetcites.fr';

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function UserRow({ user, trigram }: any) {
    return (
        <div className="flex items-center gap-4 p-2 rounded-lg bg-white shadow-sm">
            {user?.photoBase64 ? (
                <img
                    src={user.photoBase64}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-500"
                    alt={user.displayName}
                />
            ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {trigram}
                </div>
            )}

            <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 truncate">
                    {user?.displayName || trigram}
                </p>
                <p className="text-sm text-gray-500">En permanence</p>
            </div>
        </div>
    );
}

function PermanenceTeam({ team, users, trigrams }: any) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
            <h3 className="text-sm font-extrabold text-gray-700 mb-4 uppercase tracking-widest">
                {team}
            </h3>

            <div className="space-y-3">
                {trigrams.map((tri: string) => (
                    <UserRow key={tri} trigram={tri} user={users[tri]} />
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                 DASHBOARD                                  */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
    const { data: permanence } = useSWR(
        `${BACKEND_URL}/api/permanence`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const { data: tickets } = useSWR(
        `${BACKEND_URL}/api/tickets`,
        fetcher,
        { refreshInterval: 300000 }
    );

    const { data: as400Prod } = useSWR(`${BACKEND_URL}/api/as400/prod`, fetcher);
    const { data: as400Test } = useSWR(`${BACKEND_URL}/api/as400/test`, fetcher);
    const { data: as400Form } = useSWR(`${BACKEND_URL}/api/as400/form`, fetcher);
    const { data: as400PreProd } = useSWR(
        `${BACKEND_URL}/api/as400/preProd`,
        fetcher
    );

    const [as400Index, setAs400Index] = useState(0);

    useEffect(() => {
        const i = setInterval(() => setAs400Index(v => (v + 1) % 4), 6000);
        return () => clearInterval(i);
    }, []);

    if (!permanence || !tickets) {
        return (
            <div className="h-screen flex items-center justify-center text-xl text-gray-300">
                Chargement…
            </div>
        );
    }

    const {
        date,
        p1_by_team,
        p2_by_team,
        total_p1,
        total_p2,
        users,
    } = permanence.permanence_aujourdhui;

    const hour = new Date().getHours();
    const isMorning = hour < 13;

    const teams = isMorning ? p1_by_team : p2_by_team;
    const total = isMorning ? total_p1 : total_p2;

    const as400s = [
        { name: 'PRODUCTION', data: as400Prod, icon: Building2 },
        { name: 'TEST', data: as400Test, icon: Activity },
        { name: 'FORMATION', data: as400Form, icon: Users2 },
        { name: 'PRÉ-PROD', data: as400PreProd, icon: HardDrive },
    ];

    const currentAs400 = as400s[as400Index];

    /* ---------------------------------------------------------------------- */

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 p-6">
            {/* HEADER */}
            <header className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-white flex justify-center gap-3">
                    <Gauge size={40} /> DASHBOARD DTN
                </h1>
                <p className="text-lg text-gray-300 flex justify-center gap-2 mt-1">
                    <Calendar size={18} /> {date}
                </p>
            </header>

            {/* GRID */}
            <div className="grid grid-cols-3 gap-6 h-[calc(100%-120px)]">
                {/* PERMANENCE */}
                <section className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex gap-2">
                            <Timer /> PERMANENCE {isMorning ? 'MATIN' : 'APRÈS-MIDI'}
                        </h2>
                        <div className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-extrabold">
                            {total}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 overflow-auto">
                        {Object.entries(teams).map(([team, trigrams]) => (
                            <PermanenceTeam
                                key={team}
                                team={team}
                                trigrams={trigrams}
                                users={users}
                            />
                        ))}
                    </div>
                </section>

                {/* TICKETS */}
                <section className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-center text-center">
                    <h2 className="text-2xl font-bold mb-6 flex justify-center gap-2">
                        <Activity /> ACTIVITÉ DU JOUR
                    </h2>

                    <div className="flex justify-around">
                        <div>
                            <CheckCircle2 size={48} className="mx-auto text-green-600" />
                            <p className="text-5xl font-extrabold text-gray-900 mt-2">
                                {tickets.resolus_aujourdhui}
                            </p>
                            <p className="text-gray-500">Résolus</p>
                        </div>

                        <div>
                            <MessageSquare size={48} className="mx-auto text-blue-600" />
                            <p className="text-5xl font-extrabold text-gray-900 mt-2">
                                {tickets.crees_aujourdhui}
                            </p>
                            <p className="text-gray-500">Créés</p>
                        </div>
                    </div>
                </section>

                {/* IBM i */}
                <section className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-center text-center">
                    <h2 className="text-2xl font-bold mb-6 flex justify-center gap-2">
                        <Server /> STATUT IBM i
                    </h2>

                    <currentAs400.icon
                        size={42}
                        className="mx-auto mb-4 text-blue-600"
                    />

                    <p className="text-2xl font-bold mb-2">
                        {currentAs400.name}
                    </p>

                    <div
                        className={`mx-auto w-24 h-24 rounded-full ${
                            currentAs400.data.available ? 'bg-green-500' : 'bg-red-500'
                        } flex items-center justify-center`}
                    >
                        <div className="w-10 h-10 bg-white rounded-full" />
                    </div>

                    <p className="mt-4 text-xl font-bold">
                        {currentAs400.data.available ? 'DISPONIBLE' : 'INDISPONIBLE'}
                    </p>

                    <p className="text-gray-500 mt-2">
                        {currentAs400.data.host}
                    </p>
                </section>
            </div>
        </div>
    );
}
