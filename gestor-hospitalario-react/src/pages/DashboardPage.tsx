import React from 'react';
import { Header, Navigation, Dashboard } from '../components';

const DashboardPage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <Navigation />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;
