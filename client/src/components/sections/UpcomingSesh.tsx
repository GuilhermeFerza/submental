import { ArrowRight } from 'lucide-react';

interface UpComing {
    id?: string;
    name: string;
    date: string;
    location: string;
    status: string;
    headliners?: string[];
    guests?: string[];
}

interface UpcomingSeshProps {
    events: UpComing[];
    onEventClick: (evento: UpComing) => void;
}

export function UpcomingSesh({ events, onEventClick }: UpcomingSeshProps) {
    return (
        <section>
            <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2">Upcoming Sesh</h2>
            {events.length === 0 ? (
                <div className="text-4xl font-bold animate-pulse uppercase">Carregando...</div>
            ) : (
                <div className="flex flex-col">
                    <ul className="flex flex-col">
                        {events.map((evento, index) => (
                            <li 
                                key={index}
                                onClick={() => {
                                    if (evento.status !== 'past') {
                                        onEventClick(evento);
                                    }
                                }}
                                className={`flex justify-between items-center py-6 border-b border-white/30 transition-colors px-4 group ${
                                    evento.status === 'past' 
                                        ? 'line-through text-zinc-600 cursor-not-allowed'
                                        : 'hover:bg-white hover:text-black cursor-pointer'
                                }`} 
                            >   
                                <div className="flex items-center gap-8 w-full">
                                    <span className="text-2xl font-bold w-20">{evento.date}</span>
                                    <span className="text-xl font-black tracking-widest flex-grow">{evento.name}</span>
                                    <span className="text-lg font-medium hidden md:block">{evento.location}</span>
                                </div>
                                
                                {evento.status !== 'past' && (
                                    <ArrowRight size={28} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2" />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}