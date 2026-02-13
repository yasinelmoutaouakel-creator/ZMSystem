
import React, { useState } from 'react';
import { useApp } from '../store';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate slight delay for professional feel
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid username or password. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden relative border border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          
          <div className="text-center mb-10">
             <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                <Lock className="text-indigo-600" size={32} />
             </div>
             <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">ZMSystem</h2>
             <p className="text-slate-400 font-medium">Mennan & Baguerri Service</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                 <AlertCircle size={18} />
                 <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Username</label>
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                 <input 
                   type="text" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-bold placeholder:font-medium"
                   placeholder="Enter your username"
                   required
                 />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-bold placeholder:font-medium"
                   placeholder="••••••••"
                   required
                 />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
             <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-widest">M&B Services</p>
             <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded-xl text-[9px] text-slate-500 font-bold border border-slate-100">
                    <span className="text-indigo-600"> 2025 - 2026</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-[9px] text-slate-500 font-bold border border-slate-100">
                    <span className="text-indigo-600"> Your Project in Your Hands</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
