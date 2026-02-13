
import { Category, Product, Role, Employee, Supplier } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Espresso', price: 3.5, category: Category.DRINK, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400' },
  { id: 'p2', name: 'Cappuccino', price: 4.5, category: Category.DRINK, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400' },
  { id: 'p3', name: 'Pasta Carbonara', price: 14.0, category: Category.FOOD, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
  { id: 'p4', name: 'Margherita Pizza', price: 12.5, category: Category.FOOD, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400' },
  { id: 'p5', name: 'Iced Latte', price: 5.0, category: Category.DRINK, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Ahmed Server', username: 'serveur1', password: 'serveur1', role: Role.SERVEUR, shift: 'Morning', isActive: true, phone: '555-0101', address: '123 Server Lane' },
  { id: 'e2', name: 'Maria Cook', username: 'cuisinier1', password: 'cuisinier1', role: Role.CUISINIER, shift: 'Evening', isActive: true, phone: '555-0102', address: '456 Kitchen Rd' },
  { id: 'e3', name: 'Sam Barista', username: 'barista1', password: 'barista1', role: Role.BARISTA, shift: 'Morning', isActive: true, phone: '555-0103', address: '789 Coffee St' },
  { id: 'e4', name: 'System Admin', username: 'superadmin', password: 'admin1', role: Role.SUPER_ADMIN, shift: 'All Day', isActive: true, phone: '555-9999', address: 'HQ Office' },
  { id: 'e5', name: 'Claire Cashier', username: 'caissier1', password: 'caissier1', role: Role.CAISSIER, shift: 'Evening', isActive: true, phone: '555-0105', address: '321 Cashier Blvd' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'FreshVeggies Inc', contact: '+123456789', category: 'Vegetables' },
  { id: 's2', name: 'DairyPro', contact: '+987654321', category: 'Dairy' },
  { id: 's3', name: 'BeanRoasters', contact: '+456789123', category: 'Coffee' },
];

export const TABLES_COUNT = 10;
