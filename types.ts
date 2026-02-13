
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SERVEUR = 'SERVEUR',
  BARISTA = 'BARISTA',
  CUISINIER = 'CUISINIER',
  CAISSIER = 'CAISSIER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum Category {
  DRINK = 'DRINK',
  FOOD = 'FOOD'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  category: Category;
  status: 'PENDING' | 'PREPARING' | 'READY';
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  serverName: string;
  total: number;
  paymentMethod?: 'CASH' | 'CARD';
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: Role;
  shift: string;
  isActive: boolean;
  photo?: string;
  phone?: string;
  address?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  category: string;
}

export interface ReclamationReply {
  id: string;
  authorName: string;
  message: string;
  timestamp: number;
}

export interface Reclamation {
  id: string;
  serverId: string;
  serverName: string;
  message: string;
  timestamp: number;
  status: 'OPEN' | 'RESOLVED';
  replies?: ReclamationReply[];
}
