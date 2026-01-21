'use client';

import useSWR from 'swr';
import {
    Gauge,
    Calendar,
    Timer,
    Activity,
    Server,
    Ticket,
    AlertTriangle,
    CheckCircle2,
    MessageSquare,
    Building2,
    HardDrive,
    Users2,
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json();
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dashboard-dtn.maisonsetcites.fr';

/* -------------------------------------------------------------------------- */
/* COMPONENTS (identiques à ton mock) */
/* -------------------------------------------------------------------------- */

function TicketKpi({ icon: Icon, label, value, color }: any) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center shadow">
            <Icon size={32} className={`mx-auto mb-2 ${color}`} />
            <p className="text-4xl font-extrabold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
    );
}

function EnvCard({ env }: any) {
    const Icon = env.icon;
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center shadow flex flex-col justify-between">
            <div>
                <Icon size={28} className="mx-auto text-blue-600 mb-2" />
                <p className="font-bold text-gray-900">{env.name}</p>
            </div>
            <div
                className={`mx-auto my-3 w-12 h-12 rounded-full ${
                    env.status ? 'bg-green-500' : 'bg-red-500'
                } flex items-center justify-center`}
            >
                <div className="w-5 h-5 bg-white rounded-full" />
            </div>
            <div>
                <p
                    className={`text-sm font-bold ${
                        env.status ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {env.status ? 'DISPONIBLE' : 'INDISPONIBLE'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{env.host}</p>
            </div>
        </div>
    );
}

function TeamCard({ team, trigram, name }: any) {
    return (
        <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 flex flex-col shadow">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-600">
                {team}
            </p>
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
                    {trigram}
                </div>
                <p className="text-lg font-bold text-gray-900 text-center leading-tight">
                    {name}
                </p>
                <p className="text-sm text-gray-500 mt-1">En permanence</p>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* PAGE */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
    const { data: permData } = useSWR(`${BACKEND_URL}/api/permanence`, fetcher, {
        refreshInterval: 300_000,
    });
    const { data: ticketsData } = useSWR(`${BACKEND_URL}/api/tickets`, fetcher, {
        refreshInterval: 300_000,
    });
    const { data: as400Prod } = useSWR(`${BACKEND_URL}/api/as400/prod`, fetcher, { refreshInterval: 300_000 });
    const { data: as400Test } = useSWR(`${BACKEND_URL}/api/as400/test`, fetcher, { refreshInterval: 300_000 });
    const { data: as400Form } = useSWR(`${BACKEND_URL}/api/as400/form`, fetcher, { refreshInterval: 300_000 });
    const { data: as400PreProd } = useSWR(`${BACKEND_URL}/api/as400/preProd`, fetcher, { refreshInterval: 300_000 });

    const loading = !permData || !ticketsData || !as400Prod || !as400Test || !as400Form || !as400PreProd;
    const hasError = !permData || !ticketsData;

    if (hasError || loading) {
        return (
            <div className="h-screen flex items-center justify-center text-white text-2xl bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900">
                {hasError ? 'Erreur de chargement' : 'Chargement...'}
            </div>
        );
    }

    const { date, p1_by_team, p2_by_team, total_p1, total_p2, users } = permData.permanence_aujourdhui;

    // Détection de la période actuelle
    const currentHour = new Date().getHours();
    const isMorning = currentHour >= 8 && currentHour < 13;
    const isAfternoon = currentHour >= 13 && currentHour < 17;
    const isPermanenceTime = isMorning || isAfternoon;

    const currentTeams = isMorning ? p1_by_team : isAfternoon ? p2_by_team : {};
    const currentTotal = isMorning ? total_p1 : isAfternoon ? total_p2 : 0;
    const periodLabel = isMorning ? 'MATIN' : isAfternoon ? 'APRÈS-MIDI' : '';
    const periodTime = isMorning ? '8h30 – 12h' : isAfternoon ? '13h – 17h' : '';

    // Transformation : chaque équipe → une carte avec une personne (première du tableau)
    // Si tu veux afficher TOUTES les personnes d'une équipe, dis-le-moi, je change ça !
    const teamsList = Object.entries(currentTeams).map(([team, trigrams]: [string, any]) => {
        const trigram = (trigrams as string[])[0] || '';
        const name = users[trigram]?.displayName || trigram;
        return { team, trigram, name };
    });

    const tickets = {
        enCours: ticketsData.tickets_en_cours ?? 0,
        nonAssignes: ticketsData.tickets_non_assignes ?? 0,
        resolus: ticketsData.resolus_aujourdhui ?? 0,
        crees: ticketsData.crees_aujourdhui ?? 0,
    };

    const environments = [
        { name: 'PRODUCTION', host: as400Prod?.host ?? '-', status: !!as400Prod?.available, icon: Building2 },
        { name: 'TEST',       host: as400Test?.host ?? '-',  status: !!as400Test?.available,  icon: Activity },
        { name: 'FORMATION',  host: as400Form?.host ?? '-',  status: !!as400Form?.available,  icon: Users2 },
        { name: 'PRÉ-PROD',   host: as400PreProd?.host ?? '-', status: !!as400PreProd?.available, icon: HardDrive },
    ];

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 p-4">
            {/* HEADER */}
            <header className="text-center mb-4">
                <h1 className="text-3xl font-extrabold text-white flex justify-center gap-3">
                    <Gauge size={34} />
                    DASHBOARD DTN
                </h1>
                <p className="text-gray-300 flex justify-center gap-2 mt-1">
                    <Calendar size={16} />
                    {date}
                </p>
            </header>

            {/* MAIN GRID */}
            <div className="grid grid-cols-3 gap-4 h-[calc(100%-90px)]">
                {/* PERMANENCE */}
                <section className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-lg flex gap-2">
                            <Timer size={20} />
                            PERMANENCE {periodLabel}
                        </h2>
                        <span className="px-4 py-1 rounded-full bg-purple-600 text-white font-extrabold">
              {isPermanenceTime ? currentTotal : '-'}
            </span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-3">
                        {isPermanenceTime ? periodTime : 'Hors horaires de permanence'}
                    </p>

                    {isPermanenceTime && teamsList.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            {teamsList.map(({ team, trigram, name }) => (
                                <TeamCard key={team} team={team} trigram={trigram} name={name} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <p className="text-lg">Aucune permanence en cours</p>
                        </div>
                    )}
                </section>

                {/* TICKETS */}
                <section className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col">
                    <h2 className="font-bold text-lg flex gap-2 mb-4 justify-center">
                        <Activity size={20} />
                        TICKETS
                    </h2>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        <TicketKpi icon={Ticket} label="En cours" value={tickets.enCours} color="text-blue-600" />
                        <TicketKpi icon={AlertTriangle} label="Non assignés" value={tickets.nonAssignes} color="text-orange-600" />
                        <TicketKpi icon={CheckCircle2} label="Résolus" value={tickets.resolus} color="text-green-600" />
                        <TicketKpi icon={MessageSquare} label="Créés" value={tickets.crees} color="text-indigo-600" />
                    </div>
                </section>

                {/* ENVIRONNEMENTS */}
                <section className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col">
                    <h2 className="font-bold text-lg flex gap-2 mb-4 justify-center">
                        <Server size={20} />
                        ENVIRONNEMENTS IBM i
                    </h2>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {environments.map((env) => (
                            <EnvCard key={env.name} env={env} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}