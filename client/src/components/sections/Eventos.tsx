    import React, { useState, useEffect } from 'react';

    interface Evento {
    id: string;
    name: string;
    date: string;
    location: string;
    status: string;
    headliners: string[];
    guests: string[];
    }

    export default function Eventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        status: 'upcoming',
        headliners: '',
        guests: ''
    });

    const API_URL = import.meta.env.VITE_API_URL;
    const fetchEventos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/admin/eventos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            });

            if (!response.ok) {
            throw new Error('Falha de autenticação ou erro no servidor');
            }

            const data = await response.json();
            setEventos(data || []);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar os eventos.');
        } finally {
            setLoading(false);
        }
        };
        useEffect(() => {
            fetchEventos();
        }, [API_URL]);

        const handleEditClick = (evento: Evento) => {
        setFormData({
        name: evento.name,
        date: evento.date, 
        location: evento.location,
        status: evento.status.toLowerCase(),
        headliners: evento.headliners ? evento.headliners.join(', ') : '',
        guests: evento.guests ? evento.guests.join(', ') : ''
        });
        setEditingId(evento.id);
        setIsCreating(true);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                headliners: formData.headliners.split(',').map((s) => s.trim()).filter(Boolean),
                guests: formData.guests.split(',').map((s) => s.trim()).filter(Boolean)
            };

            const method = editingId ? 'PUT' : 'POST';
            const endpoint = editingId 
                ? `${API_URL}/api/admin/eventos/${editingId}` 
                : `${API_URL}/api/admin/eventos`;

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Erro ao salvar evento');
            
            await fetchEventos();
            
            setIsCreating(false);
            setEditingId(null);
            setFormData({ name: '', date: '', location: '', status: 'upcoming', headliners: '', guests: '' });

        } catch (err) {
            console.error(err);
            alert('Falha ao salvar o evento. Verifique o console.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("CERTEZA QUE DESEJA EXCLUIR ESTE EVENTO? ESTA AÇÃO É IRREVERSÍVEL.")) return;

        try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/admin/eventos/${id}`, {
            method: 'DELETE',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao excluir evento');
        setEventos(eventos.filter((evento) => evento.id !== id));
        } catch (err) {
        console.error(err);
        alert('Falha ao excluir o evento. Verifique o console.');
        }
    };

    if (loading) return <div className="animate-pulse uppercase font-bold">Carregando dados estruturais...</div>;
    if (error) return <div className="text-red-500 border-2 border-red-500 p-4 font-bold uppercase">{error}</div>;

    return (
        <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b-4 border-white pb-4">
            <h2 className="text-2xl font-black uppercase tracking-widest">
            {isCreating ? 'Novo Evento' : 'Gestão de Eventos'}
            </h2>
            <button 
            onClick={() => setIsCreating(!isCreating)}
            className="bg-white text-black font-black uppercase px-4 py-2 hover:bg-black hover:text-white border-2 border-white transition-colors"
            >
            {isCreating ? 'VOLTAR' : '+ NOVO'}
            </button>
        </div>

        {isCreating ? (
            
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-6 border-4 border-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                <label className="uppercase font-bold tracking-widest">Nome do Evento *</label>
                <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-black text-white border-2 border-white p-3 uppercase focus:outline-none focus:border-red-500 transition-colors"
                />
                </div>

                <div className="flex flex-col gap-2">
                <label className="uppercase font-bold tracking-widest">Data *</label>
                <input 
                    required
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="bg-black text-white border-2 border-white p-3 uppercase focus:outline-none focus:border-red-500 transition-colors cursor-text"
                />
                </div>

                <div className="flex flex-col gap-2">
                <label className="uppercase font-bold tracking-widest">Local *</label>
                <input 
                    required
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-black text-white border-2 border-white p-3 uppercase focus:outline-none focus:border-red-500 transition-colors"
                />
                </div>

                <div className="flex flex-col gap-2">
                <label className="uppercase font-bold tracking-widest">Status</label>
                <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="bg-black text-white border-2 border-white p-3 uppercase focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
                >
                    <option value="upcoming">UPCOMING (EM BREVE)</option>
                    <option value="past">PAST (HISTÓRICO)</option>
                </select>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                <label className="uppercase font-bold tracking-widest">Headliners (separados por vírgula)</label>
                <input 
                    type="text" 
                    placeholder="EX: ARTISTA A, ARTISTA B"
                    value={formData.headliners}
                    onChange={(e) => setFormData({...formData, headliners: e.target.value})}
                    className="bg-black text-white border-2 border-white p-3 uppercase focus:outline-none focus:border-red-500 transition-colors"
                />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                <label className="uppercase font-bold tracking-widest">Convidados (separados por vírgula)</label>
                <input 
                    type="text" 
                    placeholder="EX: DJ 1, VJ 2"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="bg-black text-white border-2 border-white p-3 uppercase focus:outline-none focus:border-red-500 transition-colors"
                />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t-4 border-white mt-4">
                <button 
                type="submit" 
                disabled={isSubmitting}
                className={`bg-white text-black font-black uppercase px-8 py-3 hover:bg-red-500 hover:text-white hover:border-red-500 border-2 border-white transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                {isSubmitting ? 'SALVANDO...' : 'SALVAR EVENTO'}
                </button>
            </div>
            </form>

        ) : (
            
            <>
            {eventos.length === 0 ? (
                <p className="opacity-50 uppercase">Nenhum evento registrado no sistema.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                {eventos.map((evento) => (
                    <div key={evento.id} className="border-2 border-white p-4 flex flex-col md:flex-row justify-between md:items-center hover:bg-white hover:text-black transition-colors group gap-4">
                    
                    <div>
                        <h3 className="font-bold uppercase text-lg">{evento.name}</h3>
                        <div className="flex items-center gap-2 text-sm font-mono mt-1">
                        <span className="opacity-70">
                            {evento.date ? evento.date.split('-').slice(1, 3).reverse().join('/') : ''}
                        </span>
                        <span className="opacity-30">|</span>
                        <span className="opacity-70 truncate uppercase">{evento.location}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`border-2 px-2 py-1 text-xs uppercase font-bold self-center ${
                            evento.status?.toLowerCase() === 'upcoming' ? 'border-current' : 'border-dashed border-current opacity-70'
                        }`}>
                        {evento.status}
                        </span>
                        <div className="flex gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleEditClick(evento)}
                            className="underline font-bold uppercase hover:text-gray-400"
                            >
                            Editar
                        </button>
                        <button 
                            onClick={() => handleDelete(evento.id)}
                            className="underline font-bold uppercase text-red-500 hover:text-red-400"
                        >
                            Excluir
                        </button>
                        </div>
                    </div>

                    </div>
                ))}
                </div>
            )}
            </>
        )}

        </div>
    );
    }