import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { clsx } from 'clsx';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      {/* Sidebar: Full height, fixed width on left */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      {/* Main content area: Takes remaining space, offset by sidebar width */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0',
          'md:ml-64' // Offset main content by sidebar width (w-64) on medium and larger screens
        )}
      >
        {/* Header: Spans only the main content area */}
        <Header toggleSidebar={toggleSidebar} />
        {/* Main content: Takes remaining space below header */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;