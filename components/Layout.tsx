
import React from 'react';
import { useApp } from '../store';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  Utensils, 
  Coffee, 
  ChefHat, 
  Wallet, 
  Users, 
  Box, 
  Truck, 
  LogOut,
  AlertCircle,
  Activity,
  UserCircle
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setCurrentUser, reclamations, activeAdminTab, setActiveAdminTab } = useApp();

  const menuItems = [
    { role: Role.SUPER_ADMIN, label: 'Analytics', icon: LayoutDashboard, tab: 'stats' },
    { role: Role.SUPER_ADMIN, label: 'Full Circuit', icon: Activity, tab: 'live' },
    { role: Role.SERVEUR, label: 'Tables', icon: Utensils, tab: 'tables' },
    { role: Role.BARISTA, label: 'Bar Queue', icon: Coffee, tab: 'bar' },
    { role: Role.CUISINIER, label: 'Kitchen Queue', icon: ChefHat, tab: 'kitchen' },
    { role: Role.CAISSIER, label: 'Payment Terminal', icon: Wallet, tab: 'cashier' },
  ];

  if (!currentUser) return <>{children}</>;

  const openRecs = reclamations.filter(r => r.status === 'OPEN').length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black">O</div>
          <span className="text-xl font-black tracking-tighter">OMNITCHEF</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => {
            // Only show roles matching current user OR all for Super Admin
            if (currentUser.role !== Role.SUPER_ADMIN && currentUser.role !== item.role) return null;
            
            const isActive = activeAdminTab === item.tab;

            return (
              <button
                key={`${item.role}-${item.label}`}
                onClick={() => {
                  if (item.tab) setActiveAdminTab(item.tab as any);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800 space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account</p>
            <button 
              onClick={() => setActiveAdminTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeAdminTab === 'profile' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserCircle size={20} /> <span className="font-bold text-sm">My Profile</span>
            </button>
          </div>

          {currentUser.role === Role.SUPER_ADMIN && (
            <div className="pt-6 mt-6 border-t border-slate-800 space-y-1">
              <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Management</p>
              <button 
                onClick={() => setActiveAdminTab('staff')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeAdminTab === 'staff' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users size={20} /> <span className="font-bold text-sm">Staff</span>
              </button>
              <button 
                onClick={() => setActiveAdminTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeAdminTab === 'products' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Box size={20} /> <span className="font-bold text-sm">Products</span>
              </button>
              <button 
                onClick={() => setActiveAdminTab('suppliers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeAdminTab === 'suppliers' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Truck size={20} /> <span className="font-bold text-sm">Suppliers</span>
              </button>
              <button 
                onClick={() => setActiveAdminTab('reclamations')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                  activeAdminTab === 'reclamations' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <AlertCircle size={20} /> <span className="font-bold text-sm">Reclamations</span>
                {openRecs > 0 && (
                   <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black animate-pulse">
                     {openRecs}
                   </span>
                )}
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl mb-4 border border-white/5 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold overflow-hidden border border-white/10 shadow-lg">
               {currentUser.photo ? <img src={currentUser.photo} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate text-white">{currentUser.name}</p>
              <p className="text-[9px] text-indigo-400 font-black uppercase tracking-tighter">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentUser(null)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-slate-400 hover:text-white transition-all bg-white/5 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={16} /> <span className="text-xs font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-slate-50/50">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
             <h1 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em]">
               {currentUser.role.replace('_', ' ')} COMMAND CENTER
             </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[9px] font-black border border-green-100 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                ACTIVE SESSION
             </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
