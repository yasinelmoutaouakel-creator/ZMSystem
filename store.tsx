
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order, OrderStatus, Product, Employee, Supplier, Reclamation, Role, Category, ReclamationReply } from './types';
import { INITIAL_PRODUCTS, INITIAL_EMPLOYEES, INITIAL_SUPPLIERS } from './constants';

type AdminTab = 'stats' | 'live' | 'tables' | 'bar' | 'kitchen' | 'cashier' | 'staff' | 'products' | 'suppliers' | 'reclamations' | 'profile';

interface AppContextType {
  currentUser: Employee | null;
  setCurrentUser: (emp: Employee | null) => void;
  orders: Order[];
  products: Product[];
  employees: Employee[];
  suppliers: Supplier[];
  reclamations: Reclamation[];
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  login: (username: string, pass: string) => boolean;
  updateProfile: (data: Partial<Employee>) => void;
  createOrder: (tableId: number, items: any[], serverName: string) => void;
  addToOrder: (orderId: string, items: any[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemStatus: (orderId: string, itemId: string, status: 'PENDING' | 'PREPARING' | 'READY') => void;
  addReclamation: (message: string) => void;
  resolveReclamation: (id: string) => void;
  replyToReclamation: (id: string, message: string) => void;
  toggleEmployeeStatus: (empId: string) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  deleteEmployee: (empId: string) => void;
  addProduct: (prod: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (sup: Omit<Supplier, 'id'>) => void;
  deleteSupplier: (supId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('stats');

  const login = useCallback((username: string, pass: string) => {
    const user = employees.find(e => e.username === username && e.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [employees]);

  const updateProfile = useCallback((data: Partial<Employee>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setEmployees(prev => prev.map(e => e.id === currentUser.id ? updatedUser : e));
  }, [currentUser]);

  const createOrder = useCallback((tableId: number, items: any[], serverName: string) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tableId,
      items: items.map(it => ({ ...it, status: 'PENDING' })),
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      serverName,
      total
    };
    setOrders(prev => [newOrder, ...prev]);
  }, []);

  const addToOrder = useCallback((orderId: string, newItems: any[]) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const updatedItems = [...o.items, ...newItems.map(it => ({ ...it, status: 'PENDING' as const }))];
      const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      return { 
        ...o, 
        items: updatedItems, 
        total: newTotal, 
        status: OrderStatus.PREPARING, // Shift back to preparing if new items are added
        updatedAt: Date.now() 
      };
    }));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o));
  }, []);

  const updateItemStatus = useCallback((orderId: string, itemId: string, status: 'PENDING' | 'PREPARING' | 'READY') => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const updatedItems = o.items.map(it => it.id === itemId ? { ...it, status } : it);
      const allReady = updatedItems.every(it => it.status === 'READY');
      const anyPreparing = updatedItems.some(it => it.status === 'PREPARING');
      let newStatus = o.status;
      if (allReady) newStatus = OrderStatus.READY;
      else if (anyPreparing && o.status !== OrderStatus.READY) newStatus = OrderStatus.PREPARING;
      return { ...o, items: updatedItems, status: newStatus, updatedAt: Date.now() };
    }));
  }, []);

  const addReclamation = useCallback((message: string) => {
    if (!currentUser) return;
    const newRec: Reclamation = {
      id: `rec-${Date.now()}`,
      serverId: currentUser.id,
      serverName: currentUser.name,
      message,
      timestamp: Date.now(),
      status: 'OPEN',
      replies: []
    };
    setReclamations(prev => [newRec, ...prev]);
  }, [currentUser]);

  const resolveReclamation = useCallback((id: string) => {
    setReclamations(prev => prev.map(r => r.id === id ? { ...r, status: 'RESOLVED' } : r));
  }, []);

  const replyToReclamation = useCallback((id: string, message: string) => {
    if (!currentUser) return;
    const reply: ReclamationReply = {
      id: `rep-${Date.now()}`,
      authorName: currentUser.name,
      message,
      timestamp: Date.now()
    };
    setReclamations(prev => prev.map(r => r.id === id ? { ...r, replies: [...(r.replies || []), reply] } : r));
  }, [currentUser]);

  const toggleEmployeeStatus = useCallback((empId: string) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, isActive: !e.isActive } : e));
  }, []);

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...emp, id: `emp-${Date.now()}` }]);
  };
  const deleteEmployee = (id: string) => setEmployees(prev => prev.filter(e => e.id !== id));
  
  const addProduct = (p: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...p, id: `prod-${Date.now()}` }]);
  };
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const addSupplier = (s: Omit<Supplier, 'id'>) => {
    setSuppliers(prev => [...prev, { ...s, id: `sup-${Date.now()}` }]);
  };
  const deleteSupplier = (id: string) => setSuppliers(prev => prev.filter(s => s.id !== id));

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, orders, products, employees, suppliers, reclamations,
      activeAdminTab, setActiveAdminTab, login, updateProfile,
      createOrder, addToOrder, updateOrderStatus, updateItemStatus, addReclamation, resolveReclamation, replyToReclamation,
      toggleEmployeeStatus, addEmployee, deleteEmployee, addProduct, deleteProduct, addSupplier, deleteSupplier
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
