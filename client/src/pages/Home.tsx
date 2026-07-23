import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { HeroSection } from "../components/sections/HeroSection";
import { UpcomingSesh } from "../components/sections/UpcomingSesh";
import { LatestDrops } from "../components/sections/LatestDrops";
import { Mixtapes} from "../components/sections/Mixtapes";
import { EventModal } from "../components/ui/EventModal";

interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    status: string;
    headliners: string[];
    guests: string[];
}

interface Mixtape {
    id: string;
    title: string;
    duration: string;
    youtubeId: string;
}

export function Home() {
    const [heroData, setHeroData] = useState<Event | null>(null);
    const [upComing, setUpComing] = useState<Event[]>([]);
    const [releases, setReleases] = useState<any[]>([]);
    const [mixtapes, setMixtapes] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(()=>{
        fetch(`${API_URL}/api/events`)
            .then((response)=>response.json())
            .then((data: Event[]) => {
                if(data && data.length > 0){
                    const nextUpcomingEvent = data.find(event => event.status === 'upcoming')
                    setHeroData(nextUpcomingEvent || data[0]);
                    setUpComing(data)
                }
            })
    },[])

    useEffect(()=>{
        fetch(`${API_URL}/api/releases`)
            .then((response)=>response.json())
            .then((data)=>{
                setReleases(data)
            })
    },[])


    useEffect(()=>{
        fetch(`${API_URL}/api/mixtapes`)
            .then((response)=> response.json())
            .then((data: Mixtape[])=>{
                setMixtapes(data || [])
            })
            .catch((error)=>console.error("Erro ao carregar mixtapes", error))
    }, [API_URL])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow px-6 py-12 flex flex-col gap-32 mb-24">
                <HeroSection data={heroData} />
                <UpcomingSesh
                    events={upComing} 
                    onEventClick={(evento) => setSelectedEvent(evento)}
                />
                <EventModal 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                />
                <LatestDrops releases={releases} />
                <Mixtapes mixtapes={mixtapes} />
            </main>

            <Footer />
        </div>
    );
}