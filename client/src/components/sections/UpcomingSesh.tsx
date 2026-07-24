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
}

export function UpcomingSesh({ events }: UpcomingSeshProps) {
    const filteredEvents = events.filter(
        evento => evento.status?.toLowerCase() === 'upcoming'
    );

    return (
        <section>
            <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2">Upcoming Sesh</h2>
            {filteredEvents.length === 0 ? (
                <div className="text-4xl font-bold animate-pulse uppercase">Nenhum evento próximo...</div>
            ) : (
                <div className="flex flex-col">
                    <ul className="flex flex-col">
                        {filteredEvents.map((evento, index) => (
                            <li 
                                key={evento.id || index}
                                className="flex justify-between items-center py-6 border-b border-white/30 transition-colors px-4 group hover:bg-white hover:text-black" 
                            >   
                                <div className="flex items-center gap-8 w-full">
                                    <span className="text-2xl font-bold w-20">
                                        {evento.date ? evento.date.split('-').slice(1, 3).reverse().join('/') : ''}
                                    </span>
                                    <span className="text-xl font-black tracking-widest flex-grow">{evento.name.toUpperCase()}</span>
                                    <span className="text-lg font-medium hidden md:block">{evento.location.toUpperCase()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}