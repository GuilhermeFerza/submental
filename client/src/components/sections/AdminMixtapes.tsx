import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

interface Mixtape {
    id: string;
    title: string;
    duration: string;
    youtubeId: string;
}

export function AdminMixtapes() {
    const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [youtubeInput, setYoutubeInput] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchMixtapes();
    }, []);

    const fetchMixtapes = async () => {
        try {
            const res = await fetch(`${API_URL}/api/mixtapes`);
            const data = await res.json();
            setMixtapes(data || []);
        } catch (error) {
            console.error("Erro ao buscar mixtapes:", error);
        }
    };

    const extractYouTubeId = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalYoutubeId = extractYouTubeId(youtubeInput);
        const token = localStorage.getItem('token')
        const payload = {
            title,
            duration,
            youtubeId: finalYoutubeId
        };

        const method = editingId ? "PUT" : "POST";
        const endpoint = editingId 
            ? `${API_URL}/api/admin/mixtapes/${editingId}` 
            : `${API_URL}/api/admin/mixtapes`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                resetForm();
                fetchMixtapes();
            } else {
                alert("Erro ao salvar mixtape.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja deletar este set?")) return;
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`${API_URL}/api/admin/mixtapes/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchMixtapes();
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const openEditForm = (mix: Mixtape) => {
        setEditingId(mix.id);
        setTitle(mix.title);
        setDuration(mix.duration);
        setYoutubeInput(`https://youtube.com/watch?v=${mix.youtubeId}`);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setDuration("");
        setYoutubeInput("");
        setIsFormOpen(false);
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <div className="flex justify-between items-center mb-10 border-b-2 border-white pb-4">
                <h1 className="text-4xl font-extrabold uppercase tracking-tight">Gestão de Sets</h1>
                {!isFormOpen && (
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="bg-white text-black px-6 py-2 font-bold uppercase hover:bg-zinc-300 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Novo Set
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-zinc-900 border-2 border-white p-6 mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold uppercase">{editingId ? "Editar Set" : "Adicionar Set"}</h2>
                        <button onClick={resetForm} className="hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Título do Set</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: VENENO.LIVE 001 - KAITO"
                                    className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Duração</label>
                                <input 
                                    type="text" 
                                    required
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="Ex: 54:20"
                                    className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Link do YouTube</label>
                            <input 
                                type="text" 
                                required
                                value={youtubeInput}
                                onChange={(e) => setYoutubeInput(e.target.value)}
                                placeholder="Cole o link completo do YouTube aqui..."
                                className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors w-full"
                            />
                            {youtubeInput && (
                                <span className="text-xs text-green-400 font-mono mt-1">
                                    ID Extraído: {extractYouTubeId(youtubeInput)}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button 
                                type="submit"
                                className="bg-white text-black px-8 py-3 font-bold uppercase hover:bg-zinc-300 transition-colors"
                            >
                                Salvar Mixtape
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mixtapes.map((mix) => (
                    <div key={mix.id} className="bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-colors p-4 flex flex-col justify-between">
                        <div>
                            <div className="aspect-video bg-black mb-4 relative overflow-hidden">
                                <img 
                                    src={`https://img.youtube.com/vi/${mix.youtubeId}/mqdefault.jpg`} 
                                    alt="Capa"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <span className="absolute bottom-2 right-2 bg-black px-2 py-1 text-xs font-bold font-mono border border-zinc-800">
                                    {mix.duration}
                                </span>
                            </div>
                            <h3 className="font-bold uppercase text-lg leading-tight mb-4">{mix.title}</h3>
                        </div>
                        
                        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4 mt-2">
                            <button 
                                onClick={() => openEditForm(mix)}
                                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-bold uppercase"
                            >
                                <Edit2 size={16} /> Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(mix.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-bold uppercase"
                            >
                                <Trash2 size={16} /> Apagar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}