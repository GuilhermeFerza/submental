import { Play } from 'lucide-react';

interface Mixtape {
    id: string;
    title: string;
    duration: string;
}

interface VenenoSetsProps {
    mixtapes: Mixtape[];
}

export function VenenoSets({ mixtapes }: VenenoSetsProps) {
    return (
        <section>
            <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2">Veneno Sets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mixtapes.map((mix) => (
                    <div key={mix.id} className="flex flex-col gap-3 group cursor-pointer">
                        <div className="aspect-video bg-zinc-900 border border-zinc-700 group-hover:border-white transition-colors flex items-center justify-center relative overflow-hidden">
                            <span className="text-zinc-600 font-bold uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                                Video Thumbnail
                            </span>
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={64} strokeWidth={2} fill="white" className="transform group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black px-2 py-1 text-xs font-bold font-mono">
                                {mix.duration}
                            </span>
                        </div>
                        <h3 className="font-bold uppercase text-lg group-hover:underline leading-tight">{mix.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}