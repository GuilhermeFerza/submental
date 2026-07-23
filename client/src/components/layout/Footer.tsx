import {  Disc3, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t-4 border-white mt-auto flex flex-col">
            <div className="px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
                <div className="flex flex-col gap-4">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Submental</h2>
                    <p className="font-bold text-zinc-400 max-w-sm uppercase text-sm leading-relaxed">
                        Fortalecendo a cena Bass Culture Brasileira. Dubs, Eventos e Veneno.
                    </p>
                </div>
                
                <div className="flex gap-12 md:gap-24">
                    <div className="flex flex-col gap-4 uppercase font-bold text-lg">
                        <a href="#" className="hover:underline hover:text-zinc-300 transition-colors">Eventos</a>
                        <a href="#" className="hover:underline hover:text-zinc-300 transition-colors">Lançamentos</a>
                        <a href="#" className="hover:underline hover:text-zinc-300 transition-colors">Veneno Sets</a>
                    </div>
                    <div className="flex flex-col gap-6">
                        <a href="#" className="hover:text-zinc-400 transition-colors group">
                            <Disc3 size={36} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
                        </a>
                        <a href="#" className="hover:text-zinc-400 transition-colors group">
                            <Disc3 size={36} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
                        </a>
                        <a href="#" className="hover:text-zinc-400 transition-colors group">
                            <Mail size={36} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="bg-white text-black p-4 text-center font-black uppercase text-sm tracking-widest">
                © 2026 SUBMENTAL. TODOS OS DIREITOS RESERVADOS.
            </div>
        </footer>
    );
}