
import React from 'react';
import { useApp } from '../store';
import { Category, OrderStatus } from '../types';
import { Clock, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';

export const KitchenDashboard: React.FC<{ category: Category }> = ({ category }) => {
  const { orders, updateItemStatus } = useApp();

  // Filter orders that have items for this kitchen category
  const activeOrders = orders.filter(order => 
    order.status !== OrderStatus.PAID && 
    order.status !== OrderStatus.CANCELLED &&
    order.items.some(it => it.category === category)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {activeOrders.map(order => {
        const categoryItems = order.items.filter(it => it.category === category);
        const allReady = categoryItems.every(it => it.status === 'READY');
        
        return (
          <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col h-fit">
            <div className={`p-6 flex justify-between items-center ${allReady ? 'bg-green-50' : 'bg-slate-50'}`}>
              <div>
                <h4 className="text-2xl font-black text-slate-800">TABLE {order.tableId}</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-1">
                   <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                allReady ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {allReady ? 'COMPLETED' : 'IN PROGRESS'}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {categoryItems.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex-1">
                    <p className={`font-bold ${item.status === 'READY' ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                      {item.quantity}x {item.name}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.status}</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.status === 'PENDING' && (
                      <button 
                        onClick={() => updateItemStatus(order.id, item.id, 'PREPARING')}
                        className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                      >
                        <PlayCircle size={20} />
                      </button>
                    )}
                    {item.status !== 'READY' && (
                      <button 
                        onClick={() => updateItemStatus(order.id, item.id, 'READY')}
                        className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Server: {order.serverName}</p>
            </div>
          </div>
        );
      })}

      {activeOrders.length === 0 && (
        <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-300 gap-6">
           <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center">
              <Loader2 className="animate-spin" size={48} strokeWidth={1} />
           </div>
           <p className="text-xl font-bold">Waiting for new orders...</p>
        </div>
      )}
    </div>
  );
};
