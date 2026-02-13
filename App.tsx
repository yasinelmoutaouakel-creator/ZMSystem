
import React from 'react';
import { AppProvider, useApp } from './store';
import { Role, Category } from './types';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { AdminDashboard } from './views/AdminDashboard';
import { ServerDashboard } from './views/ServerDashboard';
import { KitchenDashboard } from './views/KitchenDashboard';
import { CashierDashboard } from './views/CashierDashboard';
import { Profile } from './views/Profile';

const Main: React.FC = () => {
  const { currentUser, activeAdminTab } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    // If it's a super admin, they can navigate between dashboards via the Layout Sidebar
    if (currentUser.role === Role.SUPER_ADMIN) {
      return <AdminDashboard />;
    }

    // Individual role views for staff members
    if (activeAdminTab === 'profile') {
      return <Profile />;
    }

    switch (currentUser.role) {
      case Role.SERVEUR:
        return <ServerDashboard />;
      case Role.CUISINIER:
        return <KitchenDashboard category={Category.FOOD} />;
      case Role.BARISTA:
        return <KitchenDashboard category={Category.DRINK} />;
      case Role.CAISSIER:
        return <CashierDashboard />;
      default:
        return <div>Unauthorized access</div>;
    }
  };

  return <Layout>{renderContent()}</Layout>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
};

export default App;
