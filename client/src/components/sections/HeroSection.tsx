import { ArrowDownRight } from 'lucide-react';

interface HeroEventData {
    headliners: string[];
    guests: string[];
    date: string;
    location: string;
}

interface HeroSectionProps {
    data: HeroEventData | null;
}

export function HeroSection({ data }: HeroSectionProps) {
    if (!data) {
        return <div className="text-4xl font-bold animate-pulse uppercase">Carregando...</div>;
    }

    return (
        <section className="flex flex-col uppercase">
            <div className="flex flex-col">
                {data.headliners.map((name, index) => (
                    <h1 key={index} className="text-[12vw] leading-[0.8] font-black tracking-tighter break-words">   
                        {name}
                    </h1>
                ))}
            </div>

            <div className="flex justify-between items-end mt-8 border-t-4 border-white pt-4">
                <div className="text-4xl md:text-7xl font-bold tracking-tight flex flex-col">
                    {data.guests.map((guest, index) => (
                        <span key={index}>{guest}</span>
                    ))}
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="flex gap-1 mb-2">
                        <ArrowDownRight size={36} strokeWidth={3} />
                        <ArrowDownRight size={36} strokeWidth={3} />
                        <ArrowDownRight size={36} strokeWidth={3} />
                    </div>
                    <p className="font-bold text-sm md:text-xl uppercase max-w-[200px]">
                        {data.date} <br />{data.location}
                    </p>
                </div>
            </div>
        </section>
    );
}