import React from 'react';
import Sidebar from '@/components/shared/sidebar';
import Header from '@/components/shared/header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 py-8 mx-auto grid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}