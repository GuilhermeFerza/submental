import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Disc3 } from 'lucide-react';

interface Release {
    id: string;
    artist: string;
    title: string;
    coverPlaceholder: string;
    year: string;
}

export function Releases() {
    const [releases, setReleases] = useState<Release[]>([]);

    useEffect(() => {
        const fetchAllReleases = async () => {
            setReleases([
                { id: "1", artist: "FUTSU", title: "RIDDIM VIP", coverPlaceholder: "COVER 1", year: "2026" },
                { id: "2", artist: "KAITO", title: "DEEP DIVE", coverPlaceholder: "COVER 2", year: "2026" },
                { id: "3", artist: "SUBMENTAL", title: "COMPILATION V1", coverPlaceholder: "COVER 3", year: "2025" },
                { id: "4", artist: "ZETTA", title: "HEAVY BASS", coverPlaceholder: "COVER 4", year: "2025" },
                { id: "5", artist: "DJOTA", title: "UNDERGROUND", coverPlaceholder: "COVER 5", year: "2025" },
                { id: "6", artist: "FUTSU", title: "BASSLINES", coverPlaceholder: "COVER 6", year: "2024" },
            ]);
        };
        fetchAllReleases();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow px-6 py-12 flex flex-col gap-16 mb-24">
                <header className="border-b-4 border-white pb-8">
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">All Releases</h1>
                    <p className="text-xl text-zinc-400 font-bold uppercase mt-4">Catálogo completo Submental.</p>
                </header>

                <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {releases.map((release) => (
                        <div key={release.id} className="flex flex-col gap-3 group cursor-pointer">
                            <div className="aspect-square bg-zinc-900 border border-zinc-700 group-hover:border-white transition-colors flex items-center justify-center relative overflow-hidden">
                                <span className="text-zinc-600 font-bold group-hover:opacity-0 transition-opacity">
                                    {release.coverPlaceholder}
                                </span>
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Disc3 size={64} strokeWidth={2} className="animate-[spin_3s_linear_infinite]" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="font-black uppercase text-lg group-hover:underline truncate leading-none">
                                    {release.title}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="font-bold uppercase text-zinc-400 text-sm truncate">
                                        {release.artist}
                                    </p>
                                    <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5">
                                        {release.year}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    );
}