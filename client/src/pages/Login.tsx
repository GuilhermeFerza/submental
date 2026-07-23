import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const API_URL = import.meta.env.VITE_API_URL

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()

        const dadosUser = {
            email,
            password,
        }

        try{
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosUser)
            })
            if(response.ok){
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/admin/dashboard');
            
            }else{
                toast.error("E-mail ou senha inválidos")
            }
        }catch(error){
            console.error("erro na req: ", error)
            toast.error("Erro ao entrar em contato com o servidor.")
        }
    }

  return (
    <main className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-md border-4 border-white p-8">
        
        <header className="mb-8 border-b-4 border-white pb-4">
          <h1 className="text-4xl font-black uppercase tracking-widest text-center">
            Submental
          </h1>
          <p className="text-center text-sm uppercase mt-2 opacity-70">
            Admin Access Only
          </p>
        </header>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="uppercase font-bold text-sm tracking-wide">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@submental.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="bg-transparent border-2 border-white p-3 text-white placeholder-gray-600 focus:outline-none focus:bg-white focus:text-black transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="uppercase font-bold text-sm tracking-wide">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="bg-transparent border-2 border-white p-3 text-white placeholder-gray-600 focus:outline-none focus:bg-white focus:text-black transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-white text-black border-2 border-white font-black uppercase tracking-widest py-4 hover:bg-black hover:text-white transition-colors duration-200"
          >
            Enter
          </button>
          
        </form>
      </div>
    </main>
  );
}