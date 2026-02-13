
import React, { useState } from 'react';
import { useApp } from '../store';
import { User, Phone, MapPin, Key, Save, Image as ImageIcon } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    photo: currentUser?.photo || '',
  });
  const [passwordData, setPasswordData] = useState({
    old: '',
    new: '',
    confirm: ''
  });
  const [status, setStatus] = useState('');

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setStatus('Info updated successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('Passwords do not match');
      return;
    }
    updateProfile({ password: passwordData.new });
    setPasswordData({ old: '', new: '', confirm: '' });
    setStatus('Password changed successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800">MY PROFILE</h2>
        {status && (
          <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-bold border border-green-100 animate-in fade-in zoom-in">
            {status}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Quick Info */}
        <div className="md:col-span-1 space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-48 bg-slate-900 relative">
                 {formData.photo ? (
                   <img src={formData.photo} alt="Profile" className="w-full h-full object-cover opacity-80" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-100"><User size={48} /></div>
                 )}
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center p-1">
                    <div className="w-full h-full bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                       {currentUser?.name.charAt(0)}
                    </div>
                 </div>
              </div>
              <div className="pt-10 pb-8 px-6 text-center">
                 <h3 className="text-xl font-bold text-slate-800">{currentUser?.name}</h3>
                 <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-1">{currentUser?.role.replace('_', ' ')}</p>
                 <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Shift</p>
                       <p className="text-sm font-bold text-slate-700">{currentUser?.shift}</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                       <p className="text-sm font-bold text-green-500">ACTIVE</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Forms */}
        <div className="md:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><User className="text-indigo-600" /> Personal Details</h3>
              <form onSubmit={handleInfoSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Full Name</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Phone Number</label>
                       <input 
                         type="text" 
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Home Address</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Photo URL</label>
                    <input 
                      type="text" 
                      value={formData.photo}
                      onChange={(e) => setFormData({...formData, photo: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                    />
                 </div>
                 <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    <Save size={18} /> Update Info
                 </button>
              </form>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><Key className="text-amber-500" /> Security Settings</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordData.old}
                      onChange={(e) => setPasswordData({...passwordData, old: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                      placeholder="••••••••"
                    />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">New Password</label>
                       <input 
                         type="password" 
                         value={passwordData.new}
                         onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                         placeholder="••••••••"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Confirm New Password</label>
                       <input 
                         type="password" 
                         value={passwordData.confirm}
                         onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                         placeholder="••••••••"
                       />
                    </div>
                 </div>
                 <button type="submit" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all">
                    <Key size={18} /> Change Password
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};
