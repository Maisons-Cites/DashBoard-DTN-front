
// === 4. components/dashboard/TicketsSection.tsx ===
import React from 'react';
import { Clock3, Ticket, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { TicketCard } from './TicketCard';

interface TicketsSectionProps {
    tickets: {
        enCours: number;
        nonAssignes: number;
        resolus: number;
        crees: number;
    };
}

export function TicketsSection({ tickets }: TicketsSectionProps) {
    const getTicketStatus = (
        item: { label: string; value: number; threshold?: number },
        createdToday: number
    ) => {
        const count = item.value;

        if (item.label === 'Résolus') {
            if (count >= createdToday) {
                return {
                    color: 'text-green-600',
                    bg: 'bg-gradient-to-br from-green-50 to-green-100',
                    type: 'good',
                };
            }
            if (count >= createdToday - 5) {
                return {
                    color: 'text-orange-600',
                    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
                    type: 'warning',
                };
            }
            return {
                color: 'text-red-600',
                bg: 'bg-gradient-to-br from-red-50 to-red-100',
                type: 'error',
            };
        }

        if (typeof item.threshold !== 'number') {
            return {
                color: 'text-gray-700',
                bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
                type: 'neutral',
            };
        }

        if (count >= item.threshold * 1.5) {
            return {
                color: 'text-red-600',
                bg: 'bg-gradient-to-br from-red-50 to-red-100',
                type: 'error',
            };
        }

        if (count >= item.threshold) {
            return {
                color: 'text-orange-600',
                bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
                type: 'warning',
            };
        }

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
            threshold: 40,
            icon: <MessageSquare size={40} />,
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-2xl p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock3 size={28} />
                TICKETS
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {ticketCards.map((item, i) => {
                    const status = getTicketStatus(item, tickets.crees);

                    return (
                        <TicketCard
                            key={i}
                            label={item.label}
                            value={item.value}
                            icon={item.icon}
                            status={status}
                            threshold={item.threshold}
                            createdToday={tickets.crees}
                        />
                    );
                })}
            </div>
        </div>
    );
}
