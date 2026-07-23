import { X } from 'lucide-react';
import React from 'react';

interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  status: string;
  headliners: string[];
  guests: string[];
}

interface EventModalProps {
  event: EventData | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-black border-4 border-white w-full max-w-2xl p-6 md:p-8 text-white relative flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white text-black font-black px-3 py-1 hover:bg-red-500 hover:text-white transition-colors"
        >
          <X size={36}/>
        </button>
        <div>
          <span className="text-xs uppercase tracking-widest opacity-70 border border-white px-2 py-1 inline-block mb-3">
            {event.status === 'upcoming' ? 'Próximo Evento' : 'Edição Passada'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider">{event.name}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y-2 border-white py-4">
          <div>
            <p className="text-xs uppercase opacity-70">Data</p>
            <p className="font-bold text-lg">
              {new Date(`${event.date}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase opacity-70">Local / Plataforma</p>
            <p className="font-bold text-lg uppercase">{event.location}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {event.headliners && event.headliners.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase opacity-70 mb-1">Line-up Principal</h3>
              <ul className="flex flex-wrap gap-2">
                {event.headliners.map((item, index) => (
                  <li key={index} className="border-2 border-white px-3 py-1 font-bold uppercase text-sm bg-white text-black">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.guests && event.guests.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase opacity-70 mb-1">Convidados / Suporte</h3>
              <ul className="flex flex-wrap gap-2">
                {event.guests.map((item, index) => (
                  <li key={index} className="border-2 border-white px-3 py-1 font-bold uppercase text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="pt-4 border-t-2 border-white flex justify-end">
        </div>

      </div>
    </div>
  );
}