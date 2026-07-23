import { useEffect, useState, useRef } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Disc3 } from 'lucide-react';

interface Release {
    id: string;
    artist: string;
    title: string;
    coverUrl: string;
    year: number;
    previewUrl?: string;
    soundCloudUrl?: string;
}

export function Releases() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/releases`)
            .then((response) => response.json())
            .then((data) => {
                setReleases(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar releases", error);
                setLoading(false);
            });
    }, []);

    const handleMouseEnter = (release: Release) => {
        if (!release.previewUrl) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(release.previewUrl);
        audioRef.current = audio;
        audio.loop = true;
        
        audio.play().then(() => {
            setPlayingId(release.id);
        }).catch((err) => {
            console.error("Erro ao reproduzir áudio:", err);
        });
    };

    const handleMouseLeave = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlayingId(null);
    };
    
    if (loading) return <p>Loading...</p>;

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
                        <a 
                            key={release.id} 
                            href={release.soundCloudUrl || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col gap-3 group cursor-pointer"
                            onMouseEnter={() => handleMouseEnter(release)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="aspect-square bg-zinc-900 border border-zinc-700 group-hover:border-white transition-colors relative overflow-hidden">
                                {release.coverUrl ? (
                                    <img 
                                        src={release.coverUrl} 
                                        alt={`Capa de ${release.title}`} 
                                        className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900" />
                                )}
                                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${playingId === release.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} pointer-events-none`}>
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
                        </a>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    );
}