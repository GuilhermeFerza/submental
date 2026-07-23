import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Disc3, Link as LinkIcon, Scissors, Upload } from "lucide-react";

interface Release {
    id: string;
    artist: string;
    title: string;
    coverUrl: string;
    year: number;
    soundCloudUrl?: string;
    previewUrl?: string;
}

export function AdminReleases() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [soundCloudUrl, setSoundCloudUrl] = useState("");
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState<number | string>("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [clipStart, setClipStart] = useState<number>(0);
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSoundCloudBlur = async () => {
        if (!soundCloudUrl) return;
        setIsFetchingMetadata(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/releases/soundcloud-meta?url=${encodeURIComponent(soundCloudUrl)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.title) setTitle(data.title);
                if (data.artist) setArtist(data.artist);
            }
        } catch (error) {
            console.error("Erro ao puxar dados do SoundCloud:", error);
        } finally {
            setIsFetchingMetadata(false);
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAudioFile(file);
        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(file);
        audio.onloadedmetadata = () => {
            setAudioDuration(audio.duration);
            setClipStart(0);
        };
    };

    const getCroppedAudioFile = async (file: File, startSec: number, durationSec: number): Promise<File> => {
        const arrayBuffer = await file.arrayBuffer();
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(startSec * sampleRate);
        const durationSamples = Math.floor(durationSec * sampleRate);
        const endSample = Math.min(startSample + durationSamples, audioBuffer.length);

        const newBuffer = audioCtx.createBuffer(
            audioBuffer.numberOfChannels,
            endSample - startSample,
            sampleRate
        );

        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
            const channelData = audioBuffer.getChannelData(i);
            const newChannelData = newBuffer.getChannelData(i);
            newChannelData.set(channelData.subarray(startSample, endSample));
        }

        const wavBlob = bufferToWav(newBuffer);
        return new File([wavBlob], "preview_30s.wav", { type: "audio/wav" });
    };

    const bufferToWav = (buffer: AudioBuffer) => {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const out = new DataView(new ArrayBuffer(length));
        let channels: Float32Array[] = [];
        let sampleRate = buffer.sampleRate;
        let offset = 0;
        let pos = 0;

        function writeString(str: string) {
            for (let i = 0; i < str.length; i++) {
                out.setUint8(pos++, str.charCodeAt(i));
            }
        }

        writeString('RIFF');
        out.setUint32(pos, length - 8, true); pos += 4;
        writeString('WAVE');
        writeString('fmt ');
        out.setUint32(pos, 16, true); pos += 4;
        out.setUint16(pos, 1, true); pos += 2;
        out.setUint16(pos, numOfChan, true); pos += 2;
        out.setUint32(pos, sampleRate, true); pos += 4;
        out.setUint32(pos, sampleRate * 2 * numOfChan, true); pos += 4;
        out.setUint16(pos, numOfChan * 2, true); pos += 2;
        out.setUint16(pos, 16, true); pos += 2;
        writeString('data');
        out.setUint32(pos, length - pos - 4, true); pos += 4;

        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (offset < buffer.length) {
            for (let i = 0; i < numOfChan; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                out.setInt16(pos, sample, true); pos += 2;
            }
            offset++;
        }

        return new Blob([out.buffer], { type: 'audio/wav' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("year", year.toString());
        formData.append("soundcloud_url", soundCloudUrl);
        formData.append("clip_start", clipStart.toString());
        formData.append("clip_duration", "30");
        
        if (audioFile) {
            try {
                const croppedFile = await getCroppedAudioFile(audioFile, clipStart, 30);
                formData.append("audio_clip", croppedFile);
            } catch (err) {
                console.error("Erro ao recortar áudio:", err);
                alert("Erro ao processar o corte do áudio.");
                setIsSubmitting(false);
                return;
            }
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
            alert("Falha de conexão com o servidor.");
        } finally {
            setIsSubmitting(false);
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
        setYear(rel.year);
        setSoundCloudUrl(rel.soundCloudUrl || "");
        setAudioFile(null);
        setAudioDuration(0);
        setClipStart(0);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setArtist("");
        setYear("");
        setSoundCloudUrl("");
        setAudioFile(null);
        setAudioDuration(0);
        setClipStart(0);
        setIsFormOpen(false);
        setIsSubmitting(false);
    };

    return (
        <div className="p-8 text-white min-h-screen font-mono">
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
                        <div className="flex flex-col gap-2">
                            <label className="uppercase font-bold text-sm tracking-wider text-zinc-400 flex items-center gap-2">
                                <LinkIcon size={16} /> Link do SoundCloud (Preenche Capa, Artista e Título Automaticamente)
                            </label>
                            <input 
                                type="url" 
                                placeholder="https://soundcloud.com/artista/faixa"
                                value={soundCloudUrl}
                                onChange={(e) => setSoundCloudUrl(e.target.value)}
                                onBlur={handleSoundCloudBlur}
                                className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                            />
                            {isFetchingMetadata && <span className="text-xs text-zinc-400 animate-pulse">Extraindo dados do SoundCloud...</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2 md:col-span-1">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Título</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2 md:col-span-1">
                                <label className="uppercase font-bold text-sm tracking-wider text-zinc-400">Artista</label>
                                <input 
                                    type="text" 
                                    required
                                    value={artist}
                                    onChange={(e) => setArtist(e.target.value)}
                                    className="bg-black border border-zinc-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-1">
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

                        <div className="border border-zinc-800 p-4 bg-black flex flex-col gap-4">
                            <h3 className="font-bold uppercase text-sm text-zinc-300 flex items-center gap-2">
                                <Scissors size={18} /> Trecho de Preview (MP3 / WAV - Seleção de 30 Segundos)
                            </h3>
                            
                            <label className="border border-zinc-700 hover:border-white transition-colors p-3 flex items-center gap-3 cursor-pointer text-white bg-zinc-950">
                                <Upload size={20} className="text-zinc-400" />
                                <span className="truncate">
                                    {audioFile ? audioFile.name : "Selecionar arquivo de áudio completo..."}
                                </span>
                                <input 
                                    type="file" 
                                    accept="audio/mp3,audio/wav,audio/mpeg"
                                    onChange={handleAudioUpload}
                                    className="hidden"
                                />
                            </label>

                            {audioFile && audioDuration > 0 && (
                                <div className="flex flex-col gap-3 mt-2">
                                    <div className="flex justify-between text-xs text-zinc-400">
                                        <span>Início do Corte: {Math.floor(clipStart)}s</span>
                                        <span>Duração total do arquivo: {Math.floor(audioDuration)}s</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min={0} 
                                        max={Math.max(0, audioDuration - 30)} 
                                        step={1}
                                        value={clipStart}
                                        onChange={(e) => setClipStart(Number(e.target.value))}
                                        className="w-full accent-white cursor-pointer"
                                    />
                                    <p className="text-xs text-zinc-500 uppercase">
                                        O trecho reproduzirá automaticamente dos {Math.floor(clipStart)}s até os {Math.floor(clipStart + 30)}s.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-white text-black px-8 py-3 font-bold uppercase hover:bg-zinc-300 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'SALVANDO LANÇAMENTO...' : 'SALVAR LANÇAMENTO'}
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
                                        src={rel.coverUrl}
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