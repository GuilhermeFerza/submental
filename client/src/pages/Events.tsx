import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ArrowRight } from 'lucide-react';

interface EventData {
    id: string;
    name: string;
    date: string;
    location: string;
    status: 'upcoming' | 'past';
}

export function Events() {
    const [events, setEvents] = useState<EventData[]>([]);

    useEffect(() => {
        const fetchAllEvents = async () => {
            setEvents([
                { id: "1", name: "BASS SESH V3", date: "18/04", location: "VENENO.LIVE", status: "upcoming" },
                { id: "2", name: "DUBSTEP INVASION", date: "12/05", location: "SÃO PAULO/SP", status: "upcoming" },
                { id: "3", name: "TESTE DA SILVA", date: "24/07", location: "SALVADOR/BA", status: "past" },
                { id: "4", name: "BASS SESH V2", date: "10/01", location: "VENENO.LIVE", status: "past" },
            ]);
        };
        fetchAllEvents();
    }, []);

    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const pastEvents = events.filter(e => e.status === 'past');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow px-6 py-12 flex flex-col gap-24 mb-24">
                <header className="border-b-4 border-white pb-8">
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">Sesh Archive</h1>
                    <p className="text-xl text-zinc-400 font-bold uppercase mt-4">Onde o grave bate de verdade.</p>
                </header>

                <section>
                    <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2 text-white">Upcoming Sesh</h2>
                    <ul className="flex flex-col">
                        {upcomingEvents.map((evento) => (
                            <li className="flex justify-between items-center py-6 border-b border-white/30 hover:bg-white hover:text-black transition-colors cursor-pointer px-4 group" key={evento.id}>   
                                <div className="flex items-center gap-8 w-full">
                                    <span className="text-2xl md:text-4xl font-bold w-24 md:w-32">{evento.date}</span>
                                    <span className="text-2xl md:text-4xl font-black tracking-widest flex-grow">{evento.name}</span>
                                    <span className="text-xl font-medium hidden md:block">{evento.location}</span>
                                </div>
                                <ArrowRight size={36} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2" />
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-zinc-600 pb-2 text-zinc-500">Past Sesh</h2>
                    <ul className="flex flex-col text-zinc-500">
                        {pastEvents.map((evento) => (
                            <li className="flex justify-between items-center py-4 border-b border-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer px-4" key={evento.id}>   
                                <div className="flex items-center gap-8 w-full">
                                    <span className="text-xl font-bold w-24">{evento.date}</span>
                                    <span className="text-xl font-black tracking-widest flex-grow line-through decoration-zinc-700">{evento.name}</span>
                                    <span className="text-lg font-medium hidden md:block">{evento.location}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            <Footer />
        </div>
    );
}