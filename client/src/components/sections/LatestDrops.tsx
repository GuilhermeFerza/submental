import { Disc3 } from 'lucide-react';

interface Release {
    id: string;
    artist: string;
    title: string;
    coverUrl: string;
}

interface LatestDropsProps {
    releases: Release[];
}

export function LatestDrops({ releases }: LatestDropsProps) {
    const API_URL = import.meta.env.VITE_API_URL;
    
    return (
        <section>
            <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2">Latest Drops</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {releases.map((release) => (
                    <div key={release.id} className="flex flex-col gap-2 group cursor-pointer">
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
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <Disc3 size={48} strokeWidth={2} className="animate-[spin_3s_linear_infinite]" />
                            </div>
                        </div>
                        <p className="font-bold uppercase text-sm group-hover:underline truncate">
                            {release.artist} - {release.title}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}