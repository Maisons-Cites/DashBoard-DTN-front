
// === 7. lib/hooks/useDashboardData.ts ===
'use client';

import useSWR from 'swr';

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
    });

const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://dashboard-dtn-t.maisonsetcites.fr';

export function useDashboardData() {
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

    return {
        permData,
        ticketsData,
        as400Prod,
        as400Test,
        as400Form,
        as400PreProd,
        isLoading,
        hasError,
    };
}
