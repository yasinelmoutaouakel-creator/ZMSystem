
import React, { useState } from 'react';
import { useApp } from '../store';
import { OrderStatus } from '../types';
import { Receipt, CreditCard, Banknote, CheckCircle, Printer, X } from 'lucide-react';

export const CashierDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const readyOrders = orders.filter(o => o.status === OrderStatus.READY);
  const currentOrder = orders.find(o => o.id === selectedOrder);

  const handlePay = (method: 'CASH' | 'CARD') => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, OrderStatus.PAID);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Ready Orders List */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-2xl font-black text-slate-800">READY FOR PAYMENT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {readyOrders.map(order => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order.id)}
              className={`p-6 rounded-[2.5rem] border-2 text-left transition-all ${
                selectedOrder === order.id ? 'bg-indigo-600 border-indigo-700 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${
                   selectedOrder === order.id ? 'bg-indigo-500' : 'bg-slate-100 text-slate-700'
                 }`}>
                   {order.tableId}
                 </div>
                 <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${selectedOrder === order.id ? 'text-indigo-200' : 'text-slate-400'}`}>Total Amount</p>
                    <p className="text-2xl font-black">${order.total.toFixed(2)}</p>
                 </div>
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-bold ${selectedOrder === order.id ? 'text-white' : 'text-slate-800'}`}>{order.items.length} Menu Items</p>
                <p className={`text-[10px] font-bold uppercase tracking-tighter ${selectedOrder === order.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                  Server: {order.serverName} • {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </button>
          ))}
          {readyOrders.length === 0 && (
            <div className="col-span-full h-64 bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Receipt size={48} strokeWidth={1} />
              <p className="font-bold">No orders ready for payment</p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Section */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-8 sticky top-24 h-fit">
        {currentOrder ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Receipt size={24} /></div>
                <h4 className="text-2xl font-black text-slate-800">CHECKOUT</h4>
             </div>

             <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                   <span>Table {currentOrder.tableId} Order</span>
                   <span>#{currentOrder.id.slice(-4)}</span>
                </div>
                <div className="divide-y divide-slate-50 max-h-48 overflow-y-auto pr-2">
                  {currentOrder.items.map(it => (
                    <div key={it.id} className="py-3 flex justify-between">
                       <span className="font-medium text-slate-700">{it.quantity}x {it.name}</span>
                       <span className="font-bold text-slate-900">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4 mb-8">
                <div className="flex justify-between items-center">
                   <span className="text-slate-500 font-bold uppercase text-[10px]">Subtotal</span>
                   <span className="font-bold text-slate-700">${currentOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-slate-500 font-bold uppercase text-[10px]">Tax (0%)</span>
                   <span className="font-bold text-slate-700">$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                   <span className="text-slate-800 font-black text-lg">TOTAL</span>
                   <span className="text-3xl font-black text-indigo-600">${currentOrder.total.toFixed(2)}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handlePay('CASH')}
                  className="p-6 bg-slate-900 text-white rounded-[2rem] flex flex-col items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                   <Banknote size={24} />
                   <span className="font-bold text-xs">CASH</span>
                </button>
                <button 
                  onClick={() => handlePay('CARD')}
                  className="p-6 bg-indigo-600 text-white rounded-[2rem] flex flex-col items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                   <CreditCard size={24} />
                   <span className="font-bold text-xs">CARD</span>
                </button>
             </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center gap-6">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                <Printer size={48} strokeWidth={1} />
             </div>
             <div>
                <h4 className="font-bold text-slate-800 text-xl mb-2">Ready to Bill</h4>
                <p className="text-slate-400 text-sm font-medium">Select an order from the list to process the payment and print the receipt.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
