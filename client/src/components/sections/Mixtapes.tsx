import { Play } from 'lucide-react';
import { useState } from 'react';

interface Mixtape {
    id: string;
    title: string;
    duration: string;
    youtubeId: string;
}

interface VenenoSetsProps {
    mixtapes: Mixtape[];
}

export function Mixtapes({ mixtapes }: VenenoSetsProps) {
    const [playingId, setPlayingId] = useState<string | null>(null);

    return (
        <section>
            <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-white pb-2">Past Sets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mixtapes.map((mix) => (
                    <div key={mix.id} className="flex flex-col gap-3 group">
                        <div 
                            className="aspect-video bg-zinc-900 border border-zinc-700 group-hover:border-white transition-colors relative overflow-hidden cursor-pointer"
                            onClick={() => setPlayingId(mix.id)}
                        >
                            {playingId === mix.id ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${mix.youtubeId}?autoplay=1`}
                                    title={mix.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0"
                                ></iframe>
                            ) : (
                                <>
                                    <img 
                                        src={`https://img.youtube.com/vi/${mix.youtubeId}/maxresdefault.jpg`} 
                                        alt={mix.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                    />
                                    
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={64} strokeWidth={2} fill="white" className="transform group-hover:scale-110 transition-transform" />
                                    </div>
                                    
                                    <span className="absolute bottom-2 right-2 bg-black px-2 py-1 text-xs font-bold font-mono">
                                        {mix.duration}
                                    </span>
                                </>
                            )}
                        </div>
                        <h3 className="font-bold uppercase text-lg group-hover:underline leading-tight cursor-pointer" onClick={() => setPlayingId(mix.id)}>
                            {mix.title}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}