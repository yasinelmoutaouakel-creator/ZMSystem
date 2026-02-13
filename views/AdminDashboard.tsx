
import React, { useState } from 'react';
import { useApp } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, Users, Box, ShoppingCart, CheckCircle, Clock, Trash2, Plus, 
  Phone, AlertCircle, DollarSign, Image as ImageIcon, X, Utensils, 
  Coffee, ChefHat, Wallet, ListChecks, MessageSquare, CheckCircle2
} from 'lucide-react';
import { Role, Category, OrderStatus } from '../types';
import { ServerDashboard } from './ServerDashboard';
import { KitchenDashboard } from './KitchenDashboard';
import { CashierDashboard } from './CashierDashboard';
import { Profile } from './Profile';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export const AdminDashboard: React.FC = () => {
  const { 
    employees, products, suppliers, orders, toggleEmployeeStatus, 
    reclamations, deleteEmployee, deleteSupplier, resolveReclamation, replyToReclamation,
    activeAdminTab: activeTab, setActiveAdminTab: setActiveTab,
    deleteProduct, addProduct, addEmployee, addSupplier
  } = useApp();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState('');

  const totalSales = orders.filter(o => o.status === OrderStatus.PAID).reduce((sum, o) => sum + o.total, 0);

  const handleReply = (id: string) => {
    if (replyMsg.trim()) {
      replyToReclamation(id, replyMsg);
      setReplyMsg('');
      setReplyId(null);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<TrendingUp className="text-indigo-600" />} label="Total Sales" value={`$${totalSales.toFixed(2)}`} trend="+12.5%" />
              <StatCard icon={<ShoppingCart className="text-emerald-600" />} label="Active Orders" value={orders.filter(o => o.status !== OrderStatus.PAID).length.toString()} trend="In Progress" />
              <StatCard icon={<Users className="text-amber-600" />} label="Staff Online" value={employees.filter(e => e.isActive).length.toString()} trend={`${employees.length} total`} />
              <StatCard icon={<Box className="text-rose-600" />} label="Total Products" value={products.length.toString()} trend="Menu Items" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Revenue Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                          {order.tableId}
                        </div>
                        <div>
                          <p className="font-bold">Table {order.tableId}</p>
                          <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === OrderStatus.PAID ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-center text-slate-400 py-8">No transactions yet</p>}
                </div>
              </div>
            </div>
          </div>
        );
      case 'live':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <ListChecks className="text-indigo-600" /> LIVE OPERATIONS CIRCUIT
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                   <ChefHat className="text-rose-500" />
                   <h4 className="font-bold uppercase tracking-wider text-xs text-rose-700">Kitchen & Bar Live Queue</h4>
                </div>
                <div className="space-y-8">
                  <section>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Kitchen (Food)</p>
                    <KitchenDashboard category={Category.FOOD} />
                  </section>
                  <section>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Bar (Drinks)</p>
                    <KitchenDashboard category={Category.DRINK} />
                  </section>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                   <Wallet className="text-emerald-500" />
                   <h4 className="font-bold uppercase tracking-wider text-xs text-emerald-700">Cashier Live Terminal</h4>
                </div>
                <CashierDashboard />
              </div>
            </div>
          </div>
        );
      case 'tables':
        return <ServerDashboard />;
      case 'bar':
        return <KitchenDashboard category={Category.DRINK} />;
      case 'kitchen':
        return <KitchenDashboard category={Category.FOOD} />;
      case 'cashier':
        return <CashierDashboard />;
      case 'staff':
        return (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Employee Management</h3>
              <button onClick={() => setShowAddEmployee(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                <Plus size={18} /> Add Employee
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {employees.map(emp => (
                <div key={emp.id} className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 group">
                   <div className="h-48 bg-slate-200 relative overflow-hidden">
                      {emp.photo ? (
                        <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                           <Users size={48} />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => deleteEmployee(emp.id)} className="p-2 bg-white/90 text-red-500 rounded-xl shadow-lg hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                   </div>
                   <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{emp.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {emp.isActive ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 font-bold uppercase mb-4 tracking-widest">{emp.role.replace('_', ' ')}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-slate-400 font-medium">Shift: {emp.shift}</span>
                         <button onClick={() => toggleEmployeeStatus(emp.id)} className="text-[10px] font-bold text-slate-600 hover:text-indigo-600">Toggle Status</button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Product Catalog</h3>
              <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
              {products.map(prod => (
                <div key={prod.id} className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden group">
                   <div className="h-40 bg-slate-200 relative">
                      {prod.image ? (
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                           <ImageIcon size={32} />
                        </div>
                      )}
                      <button onClick={() => deleteProduct(prod.id)} className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                   </div>
                   <div className="p-5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase mb-2 inline-block ${
                        prod.category === Category.DRINK ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {prod.category}
                      </span>
                      <h4 className="font-bold text-slate-800 mb-1">{prod.name}</h4>
                      <div className="flex items-center gap-1 text-indigo-600 font-black text-lg">
                         <DollarSign size={16} /> {prod.price.toFixed(2)}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'suppliers':
        return (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Supplier Network</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200">
                <Plus size={18} /> Add Supplier
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {suppliers.map(sup => (
                <div key={sup.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => deleteSupplier(sup.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{sup.name}</h4>
                  <p className="text-indigo-600 text-xs font-bold uppercase mb-4">{sup.category}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Phone size={14} /> {sup.contact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'reclamations':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black text-slate-800">STOCK ALERTS & RECLAMATIONS</h3>
            <div className="grid grid-cols-1 gap-6">
              {reclamations.map(rec => (
                <div key={rec.id} className={`bg-white p-8 rounded-[2.5rem] border ${rec.status === 'RESOLVED' ? 'border-slate-100 opacity-60' : 'border-rose-100 shadow-xl shadow-rose-50'} flex flex-col gap-6`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${rec.status === 'RESOLVED' ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-500'}`}>
                        <AlertCircle size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">From {rec.serverName}</h4>
                        <p className="text-xs text-slate-400 font-bold">{new Date(rec.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      rec.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl">
                     <p className="text-slate-600 font-medium leading-relaxed">{rec.message}</p>
                  </div>

                  {rec.replies && rec.replies.length > 0 && (
                    <div className="space-y-4 ml-6 pl-6 border-l-2 border-slate-100">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Discussion Thread</p>
                       {rec.replies.map(rep => (
                         <div key={rep.id} className="bg-slate-50/50 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                               <p className="text-xs font-black text-slate-800">{rep.authorName}</p>
                               <p className="text-[9px] text-slate-400">{new Date(rep.timestamp).toLocaleTimeString()}</p>
                            </div>
                            <p className="text-sm text-slate-600">{rep.message}</p>
                         </div>
                       ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-slate-50">
                    {rec.status === 'OPEN' && (
                      <button 
                        onClick={() => resolveReclamation(rec.id)}
                        className="px-6 py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-600 flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Mark Resolved
                      </button>
                    )}
                    <button 
                      onClick={() => setReplyId(rec.id)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <MessageSquare size={16} /> Add Reply
                    </button>
                  </div>

                  {replyId === rec.id && (
                    <div className="mt-4 p-6 bg-slate-50 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                       <textarea 
                        value={replyMsg}
                        onChange={(e) => setReplyMsg(e.target.value)}
                        placeholder="Type your response..."
                        className="w-full bg-white border-2 border-slate-100 p-4 rounded-xl focus:border-indigo-500 focus:outline-none mb-4 min-h-[100px] font-medium"
                       ></textarea>
                       <div className="flex gap-2">
                          <button onClick={() => setReplyId(null)} className="px-4 py-2 text-slate-400 font-bold text-xs uppercase">Cancel</button>
                          <button onClick={() => handleReply(rec.id)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase shadow-xl shadow-slate-200">Send Response</button>
                       </div>
                    </div>
                  )}
                </div>
              ))}
              {reclamations.length === 0 && (
                <div className="bg-slate-100 p-20 rounded-[3rem] text-center border-4 border-dashed border-slate-200">
                   <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                   <p className="text-slate-400 font-black uppercase tracking-widest">No active reclamations</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Tab Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] w-fit shadow-inner">
        {(['stats', 'live', 'tables', 'bar', 'kitchen', 'cashier', 'staff', 'products', 'suppliers', 'reclamations', 'profile'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'live' ? '⚡ FULL CIRCUIT' : tab}
          </button>
        ))}
      </div>

      {renderActiveView()}

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddFormModal 
          title="Add New Menu Item" 
          onClose={() => setShowAddProduct(false)} 
          onSubmit={(data) => {
            addProduct({
              name: data.name,
              price: parseFloat(data.price),
              category: data.category as Category,
              image: data.image
            });
            setShowAddProduct(false);
          }}
          fields={[
            { name: 'name', label: 'Product Name', type: 'text', placeholder: 'Ex: Espresso' },
            { name: 'price', label: 'Price ($)', type: 'number', placeholder: 'Ex: 4.50' },
            { name: 'category', label: 'Category', type: 'select', options: [Category.DRINK, Category.FOOD] },
            { name: 'image', label: 'Photo URL', type: 'text', placeholder: 'https://images.unsplash.com/...' }
          ]}
        />
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <AddFormModal 
          title="Add Staff Member" 
          onClose={() => setShowAddEmployee(false)} 
          onSubmit={(data) => {
            addEmployee({
              name: data.name,
              username: data.username,
              password: data.password,
              role: data.role as Role,
              shift: data.shift,
              isActive: true,
              photo: data.photo,
              phone: data.phone,
              address: data.address
            });
            setShowAddEmployee(false);
          }}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'username', label: 'Login Username', type: 'text' },
            { name: 'password', label: 'Login Password', type: 'text' },
            { name: 'role', label: 'Role', type: 'select', options: Object.values(Role) },
            { name: 'shift', label: 'Shift Time', type: 'text', placeholder: 'Ex: 08:00 - 16:00' },
            { name: 'photo', label: 'Photo URL', type: 'text', placeholder: 'https://images.unsplash.com/...' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'address', label: 'Address', type: 'text' }
          ]}
        />
      )}
    </div>
  );
};

const AddFormModal: React.FC<{ 
  title: string, 
  onClose: () => void, 
  onSubmit: (data: any) => void,
  fields: { name: string, label: string, type: string, options?: string[], placeholder?: string }[]
}> = ({ title, onClose, onSubmit, fields }) => {
  const [formData, setFormData] = useState<any>({});

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
       <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"><X size={20}/></button>
          </div>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
             {fields.map(f => (
               <div key={f.name}>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">{f.label}</label>
                 {f.type === 'select' ? (
                   <select 
                     onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                     className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 outline-none font-bold appearance-none"
                   >
                     <option value="">Select Option</option>
                     {f.options?.map(opt => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}
                   </select>
                 ) : (
                   <input 
                     type={f.type}
                     placeholder={f.placeholder}
                     onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                     className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 outline-none font-bold placeholder:font-medium"
                   />
                 )}
               </div>
             ))}
          </div>
          <div className="mt-10 flex gap-4">
             <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
             <button onClick={() => onSubmit(formData)} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">Confirm & Save</button>
          </div>
       </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
        {trend}
      </span>
    </div>
    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</h4>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);
