import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react';
import { getRoleLabel } from '../lib/utils';

const roleColors = {
  employee: 'from-blue-500 to-cyan-500',
  manager: 'from-violet-500 to-purple-600',
  admin: 'from-orange-500 to-red-500',
};

const roleBadge = {
  employee: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  manager: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  admin: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
};

export default function Topbar({ sidebarCollapsed }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, title: 'New Goal Assigned: Q3 Deliverables', time: '10m ago', unread: true },
    { id: 2, title: 'Quarterly Review Reminder', time: '1h ago', unread: true },
    { id: 3, title: 'System Update Completed', time: '2d ago', unread: false },
  ]);
  const dropdownRef = useRef(null);

  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          {greeting()}, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
        </h2>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search goals..."
            className="pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-56 transition-all focus:w-72"
          />
        </div>

        {/* Notification bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg text-muted-foreground transition-colors ${showNotifications ? 'bg-secondary text-foreground' : 'hover:bg-secondary hover:text-foreground'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-card animate-pulse" />
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border shadow-2xl rounded-xl overflow-hidden z-50 animate-fade-in origin-top-right">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifs.length > 0 ? notifs.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                    className={`px-4 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <p className={`text-sm leading-tight ${n.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                )) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                    <Bell className="w-6 h-6 opacity-20" />
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${roleColors[user?.role]}`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">{user?.name}</p>
            <span className={`text-xs border rounded-full px-2 py-0.5 mt-0.5 inline-block ${roleBadge[user?.role]}`}>
              {getRoleLabel(user?.role)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
