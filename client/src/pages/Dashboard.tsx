import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Eventos from '../components/sections/Eventos';
import { AdminMixtapes } from '../components/sections/AdminMixtapes';
import { AdminReleases } from '../components/sections/AdminReleases';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'visao_geral' | 'releases' |'eventos' | 'set'>('visao_geral');
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/');
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'eventos':
        return <Eventos />;
      case 'set':
        return <AdminMixtapes />
      case 'releases':
        return <AdminReleases />
      case 'visao_geral':
      default:
        return (
          <>
            <header className="mb-10 border-b-4 border-white pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <h2 className="text-4xl font-black uppercase tracking-widest">
                Dashboard
              </h2>
              <span className="text-sm opacity-70 uppercase tracking-widest">
                Visão Geral
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
                <button 
                  onClick={() => setActiveTab('eventos')}
                  className="border-2 border-black font-black uppercase py-2 hover:bg-black hover:text-white transition-colors"
                >
                  Gerenciar Eventos
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col md:flex-row">
      
      <aside className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest mb-8 border-b-4 border-white pb-4">
            Submental
          </h1>
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => setActiveTab('visao_geral')}
              className={`text-left uppercase font-bold p-3 border-2 transition-colors ${
                activeTab === 'visao_geral' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-white border-transparent hover:border-white'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('releases')}
              className={`text-left uppercase font-bold p-3 border-2 transition-colors ${
                activeTab === 'releases' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-white border-transparent hover:border-white'
              }`}
            >
              Lançamentos
            </button>
            <button 
              onClick={() => setActiveTab('eventos')}
              className={`text-left uppercase font-bold p-3 border-2 transition-colors ${
                activeTab === 'eventos' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-white border-transparent hover:border-white'
              }`}
            >
              Eventos
            </button>
            <button 
              onClick={() => setActiveTab('set')}
              className={`text-left uppercase font-bold p-3 border-2 transition-colors ${
                activeTab === 'set' 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-white border-transparent hover:border-white'
              }`}
            >
              SET
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
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>

    </div>
  );
}