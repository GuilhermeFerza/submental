import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Disc3, Upload } from "lucide-react";

interface Release {
    id: string;
    artist: string;
    title: string;
    coverUrl: string;
    year: number;
}

export function AdminReleases() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [year, setYear] = useState<number | string>("");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchReleases();
    }, []);

    const fetchReleases = async () => {
        try {
            const res = await fetch(`${API_URL}/api/releases`);
            const data = await res.json();
            setReleases(data || []);
        } catch (error) {
            console.error("Erro ao buscar releases:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("year", year.toString());
        
        if (coverFile) {
            formData.append("cover_image", coverFile);
        }

        const method = editingId ? "PUT" : "POST";
        const endpoint = editingId 
            ? `${API_URL}/api/admin/releases/${editingId}` 
            : `${API_URL}/api/admin/releases`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            if (res.ok) {
                resetForm();
                fetchReleases();
            } else {
                alert("Erro ao salvar release.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja deletar este lançamento?")) return;
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${API_URL}/api/admin/releases/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) fetchReleases();
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const openEditForm = (rel: Release) => {
        setEditingId(rel.id);
        setTitle(rel.title);
        setArtist(rel.artist);
        setCoverFile(null);
        setYear(rel.year);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setArtist("");
        setCoverFile(null);
        setYear("");
        setIsFormOpen(false);
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <div className="flex justify-between items-center mb-10 border-b-2 border-white pb-4">
                <h1 className="text-4xl font-extrabold uppercase tracking-tight">Gestão de Lançamentos</h1>
                {!isFormOpen && (
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="bg-white text-black px-6 py-2 font-bold uppercase hover:bg-zinc-300 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Novo Lançamento
                    </button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-zinc-900 border-2 border-white p-6 mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold uppercase">{editingId ? "Editar Lançamento" : "Adicionar Lançamento"}</h2>
                        <button onClick={resetForm} className="hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Título</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Artista</label>
                                <input 
                                    type="text" 
                                    required
                                    value={artist}
                                    onChange={(e) => setArtist(e.target.value)}
                                    className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Upload da Capa</label>
                                <label className="bg-black border border-zinc-700 hover:border-white transition-colors p-3 flex items-center gap-3 cursor-pointer text-white">
                                    <Upload size={20} className="text-zinc-400" />
                                    <span className="truncate">
                                        {coverFile ? coverFile.name : "Escolher arquivo..."}
                                    </span>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        required={!editingId}
                                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Ano</label>
                                <input 
                                    type="number" 
                                    required
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button 
                                type="submit"
                                className="bg-white text-black px-8 py-3 font-bold uppercase hover:bg-zinc-300 transition-colors"
                            >
                                Salvar Lançamento
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {releases.map((rel) => (
                    <div key={rel.id} className="bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-colors p-4 flex flex-col justify-between group">
                        <div>
                            <div className="aspect-square bg-black border border-zinc-800 mb-4 flex items-center justify-center relative overflow-hidden">
                                {rel.coverUrl ? (
                                    <img 
                                        src={`${API_URL}${rel.coverUrl}`}
                                        alt={`Capa de ${rel.title}`} 
                                        className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <Disc3 size={48} strokeWidth={2} className="animate-[spin_3s_linear_infinite]" />
                                </div>
                            </div>
                            <h3 className="font-bold uppercase text-lg leading-tight truncate">{rel.title}</h3>
                            <p className="text-sm font-bold text-zinc-400 uppercase truncate mt-1">{rel.artist}</p>
                            <span className="inline-block mt-2 text-xs font-mono font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5">
                                {rel.year}
                            </span>
                        </div>
                        
                        <div className="flex justify-between border-t border-zinc-800 pt-4 mt-4">
                            <button 
                                onClick={() => openEditForm(rel)}
                                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold uppercase"
                            >
                                <Edit2 size={14} /> Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(rel.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-bold uppercase"
                            >
                                <Trash2 size={14} /> Apagar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}