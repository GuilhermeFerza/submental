import { Disc3 } from 'lucide-react';

interface Release {
    id: string;
    artist: string;
    title: string;
    coverPlaceholder: string;
}

interface LatestDropsProps {
    releases: Release[];
}

export function LatestDrops({ releases }: LatestDropsProps) {
    return (
        <section>
            <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2">Latest Drops</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {releases.map((release) => (
                    <div key={release.id} className="flex flex-col gap-2 group cursor-pointer">
                        <div className="aspect-square bg-zinc-900 border border-zinc-700 group-hover:border-white transition-colors flex items-center justify-center relative overflow-hidden">
                            <span className="text-zinc-600 font-bold group-hover:opacity-0 transition-opacity">
                                {release.coverPlaceholder}
                            </span>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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