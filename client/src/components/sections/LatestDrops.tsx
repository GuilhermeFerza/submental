import React, { useState, useRef } from 'react';
import { Disc3 } from 'lucide-react';

interface Release {
    id: string;
    artist: string;
    title: string;
    coverUrl: string;
    previewUrl?: string;
    soundCloudUrl?: string;
}

interface LatestDropsProps {
    releases: Release[];
}

export function LatestDrops({ releases }: LatestDropsProps) {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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

    return (
        <section>
            <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2">Latest Drops</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {releases.map((release) => (
                    <a 
                        key={release.id} 
                        href={release.soundCloudUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col gap-2 group cursor-pointer"
                        onMouseEnter={() => handleMouseEnter(release)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="aspect-square bg-zinc-900 border border-zinc-700 group-hover:border-white transition-colors relative overflow-hidden">
                            {release.coverUrl ? (
                                <img 
                                    src={release.coverUrl} 
                                    alt={`${release.artist} - ${release.title}`} 
                                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900" />
                            )}
                            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${playingId === release.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} pointer-events-none`}>
                                <Disc3 size={48} strokeWidth={2} className="animate-[spin_3s_linear_infinite]" />
                            </div>
                        </div>
                        <p className="font-bold uppercase text-sm group-hover:underline truncate">
                            {release.artist} - {release.title}
                        </p>
                    </a>
                ))}
            </div>
        </section>
    );
}