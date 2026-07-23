import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Admin(){

    const navigate = useNavigate();

    // useEffect(()=>{
    //     const token = localStorage.getItem('token')
    //     if(!token){
    //         navigate('/admin');
    //     }
    // }, [navigate])

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col md:flex-row">
      
      <aside className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest mb-8 border-b-4 border-white pb-4">
            Submental
          </h1>
          <nav className="flex flex-col gap-4">
            <button className="text-left uppercase font-bold bg-white text-black p-3 border-2 border-white transition-colors">
              Visão Geral
            </button>
            <button className="text-left uppercase font-bold p-3 border-2 border-transparent hover:border-white transition-colors">
              Eventos
            </button>
            <button className="text-left uppercase font-bold p-3 border-2 border-transparent hover:border-white transition-colors">
              Mixtapes
            </button>
          </nav>
        </div>
        
        <button 
          onClick={handleLogout}
          className="mt-12 bg-transparent text-red-500 border-2 border-red-500 font-bold uppercase py-3 hover:bg-red-500 hover:text-black transition-colors"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-10 border-b-4 border-white pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <h2 className="text-4xl font-black uppercase tracking-widest">
            Dashboard
          </h2>
          <span className="text-sm opacity-70 uppercase tracking-widest">
            Painel de Controle
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="border-4 border-white p-6 flex flex-col justify-between min-h-[160px]">
            <h3 className="text-lg font-bold uppercase">Mixtapes Ativas</h3>
            <p className="text-6xl font-black">12</p>
          </div>

          <div className="border-4 border-white p-6 flex flex-col justify-between min-h-[160px]">
            <h3 className="text-lg font-bold uppercase">Próximo Evento</h3>
            <div>
              <p className="font-bold text-xl uppercase">Submental Invites</p>
              <p className="text-sm opacity-70">24 OUT 2026</p>
            </div>
          </div>

          <div className="border-4 border-white p-6 bg-white text-black flex flex-col justify-between min-h-[160px]">
            <h3 className="text-lg font-bold uppercase">Ações Rápidas</h3>
            <button className="border-2 border-black font-black uppercase py-2 hover:bg-black hover:text-white transition-colors">
              + Novo Evento
            </button>
          </div>

        </div>
      </main>

    </div>
  );

}