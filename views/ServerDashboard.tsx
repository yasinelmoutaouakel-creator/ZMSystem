
import React, { useState } from 'react';
import { useApp } from '../store';
import { TABLES_COUNT } from '../constants';
import { OrderStatus, Category, Order } from '../types';
import { Plus, X, Search, ShoppingBag, Send, AlertTriangle, ChevronRight } from 'lucide-react';

export const ServerDashboard: React.FC = () => {
  const { orders, products, createOrder, addToOrder, currentUser, addReclamation } = useApp();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [existingOrder, setExistingOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<{ productId: string, name: string, quantity: number, price: number, category: Category }[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportMsg, setReportMsg] = useState('');

  const activeTables = orders.filter(o => o.status !== OrderStatus.PAID && o.status !== OrderStatus.CANCELLED).map(o => o.tableId);

  const handleAddToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, name: product.name, quantity: 1, price: product.price, category: product.category }];
    });
  };

  const handleSubmitOrder = () => {
    if (selectedTable && cart.length > 0 && currentUser) {
      if (existingOrder) {
        addToOrder(existingOrder.id, cart.map(i => ({ ...i, id: `item-${Date.now()}-${i.productId}` })));
      } else {
        createOrder(selectedTable, cart.map(i => ({ ...i, id: `item-${Date.now()}-${i.productId}` })), currentUser.name);
      }
      setCart([]);
      setSelectedTable(null);
      setExistingOrder(null);
      setIsOrdering(false);
    }
  };

  const handleReport = () => {
    if (reportMsg) {
      addReclamation(reportMsg);
      setReportMsg('');
      setIsReporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {Array.from({ length: TABLES_COUNT }).map((_, i) => {
          const tableId = i + 1;
          const currentOrder = orders.find(o => o.tableId === tableId && o.status !== OrderStatus.PAID);
          const isOccupied = !!currentOrder;
          
          return (
            <button
              key={tableId}
              onClick={() => {
                setSelectedTable(tableId);
                setExistingOrder(currentOrder || null);
                setIsOrdering(true);
              }}
              className={`aspect-square rounded-[3rem] border-4 transition-all flex flex-col items-center justify-center gap-2 p-6 relative overflow-hidden group shadow-sm ${
                isOccupied 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100 scale-105' 
                : 'bg-white border-slate-100 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl ${
                isOccupied ? 'bg-indigo-500 text-white shadow-inner' : 'bg-slate-100 text-slate-700'
              }`}>
                {tableId}
              </div>
              <div className="text-center">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isOccupied ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {isOccupied ? currentOrder.status : 'Free'}
                </span>
                {isOccupied && (
                  <p className="text-[11px] font-bold mt-1 text-white opacity-80">${currentOrder.total.toFixed(2)}</p>
                )}
              </div>
              {isOccupied && (
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-400 border-2 border-indigo-600 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating Action Button for Reclamation */}
      <button 
        onClick={() => setIsReporting(true)}
        className="fixed bottom-10 right-10 w-20 h-20 bg-rose-600 text-white rounded-3xl shadow-2xl flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <AlertTriangle size={24} className="mb-1" />
        <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Alert</span>
      </button>

      {/* Order Modal (Double Panel: Existing + New) */}
      {isOrdering && selectedTable && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-end p-6">
          <div className="bg-white w-full max-w-[90vw] h-full max-h-[95vh] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black text-3xl">
                   {selectedTable}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Table Management</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    {existingOrder ? `Managing Existing Order #${existingOrder.id.slice(-4)}` : 'Creating New Order Session'}
                  </p>
                </div>
              </div>
              <button onClick={() => { setIsOrdering(false); setExistingOrder(null); setCart([]); }} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-colors shadow-sm">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Product Picker */}
              <div className="flex-[1.2] p-10 overflow-y-auto bg-slate-50 border-r border-slate-100 custom-scrollbar">
                <div className="relative mb-10">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                  <input 
                    type="text" 
                    placeholder="Quick search menu..." 
                    className="w-full bg-white pl-16 pr-6 py-6 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-lg placeholder:font-medium" 
                  />
                </div>
                
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAddToCart(p)}
                      className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 text-left hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-50 transition-all group overflow-hidden relative"
                    >
                      <div className="h-32 -mx-6 -mt-6 mb-4 bg-slate-100 overflow-hidden">
                        {p.image && <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />}
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mb-2 inline-block uppercase tracking-widest ${
                        p.category === Category.DRINK ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {p.category}
                      </span>
                      <h4 className="font-bold text-slate-800 mb-1 truncate">{p.name}</h4>
                      <p className="text-indigo-600 font-black tracking-tighter">${p.price.toFixed(2)}</p>
                      <div className="absolute top-2 right-2 p-2 bg-indigo-600 text-white rounded-xl scale-0 group-hover:scale-100 transition-transform">
                         <Plus size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Status & Cart Panel */}
              <div className="flex-1 p-10 bg-white flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                  {/* Existing Items */}
                  {existingOrder && (
                    <section>
                      <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ListChecks size={14} /> Current Order Status
                      </h5>
                      <div className="space-y-3">
                        {existingOrder.items.map(it => (
                          <div key={it.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div>
                                <p className="font-bold text-sm text-slate-700">{it.quantity}x {it.name}</p>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  it.status === 'READY' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {it.status}
                                </span>
                             </div>
                             <p className="font-black text-slate-400 text-xs">${(it.price * it.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* New Items Section */}
                  <section>
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShoppingBag size={14} /> New Items to Add
                    </h5>
                    <div className="space-y-4">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100 animate-in fade-in slide-in-from-right-2">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm">{item.quantity}</div>
                            <div>
                              <p className="font-black text-slate-800 text-sm">{item.name}</p>
                              <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">${item.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-black text-indigo-600 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="p-2 text-rose-300 hover:text-rose-600 transition-colors"><X size={18} /></button>
                          </div>
                        </div>
                      ))}
                      {cart.length === 0 && (
                        <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
                           <p className="text-slate-300 text-xs font-bold uppercase tracking-widest italic">Pick items from the menu</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <div className="pt-10 mt-10 border-t border-slate-100 space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">Cumulative Total</p>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">
                        ${( (existingOrder?.total || 0) + cart.reduce((sum, i) => sum + (i.price * i.quantity), 0) ).toFixed(2)}
                      </span>
                    </div>
                    {existingOrder && (
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">New Selection</p>
                        <p className="font-black text-xl text-indigo-600">+ ${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  <button 
                    disabled={cart.length === 0}
                    onClick={handleSubmitOrder}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 hover:bg-black disabled:opacity-30 disabled:shadow-none transition-all active:scale-95 group"
                  >
                    {existingOrder ? 'UPDATE ORDER CIRCUIT' : 'LAUNCH NEW ORDER'}
                    <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reclamation Modal */}
      {isReporting && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[60] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-8 mx-auto">
                 <AlertTriangle size={40} />
              </div>
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">SYSTEM ALERT</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Direct communication to Super Admin</p>
              </div>
              <textarea 
                value={reportMsg}
                onChange={(e) => setReportMsg(e.target.value)}
                placeholder="Ex: Kitchen gas issue, Item 'Salad' stock exhausted..."
                className="w-full bg-slate-50 rounded-[2rem] p-8 border-2 border-slate-100 focus:border-rose-500 focus:outline-none h-48 font-bold text-lg mb-8 resize-none placeholder:font-medium shadow-inner"
              ></textarea>
              <div className="flex gap-4">
                <button onClick={() => setIsReporting(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs">Dismiss</button>
                <button 
                  onClick={handleReport}
                  className="flex-1 py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all"
                >
                  Transmit Alert
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ListChecks: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>
  </svg>
);
