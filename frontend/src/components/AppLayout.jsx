import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '../lib/utils';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        collapsed ? 'ml-16' : 'ml-64'
      )}>
        <Topbar sidebarCollapsed={collapsed} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
