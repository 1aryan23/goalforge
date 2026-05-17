import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn, getRoleLabel } from '../lib/utils';
import {
  LayoutDashboard, Target, ClipboardCheck, Users,
  BarChart3, Shield, Settings, LogOut, Bell,
  ChevronLeft, ChevronRight, Zap, FileText, Activity,
  UserCog, Lock, TrendingUp, Calendar
} from 'lucide-react';

const navConfig = {
  employee: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/employee' },
    { label: 'My Goals', icon: Target, to: '/employee/goals' },
    { label: 'Quarterly Check-In', icon: Calendar, to: '/employee/checkins' },
    { label: 'Progress', icon: TrendingUp, to: '/employee/progress' },
  ],
  manager: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/manager' },
    { label: 'Team Goals', icon: Target, to: '/manager/goals' },
    { label: 'Approvals', icon: ClipboardCheck, to: '/manager/approvals' },
    { label: 'Check-Ins', icon: Calendar, to: '/manager/checkins' },
    { label: 'Analytics', icon: BarChart3, to: '/manager/analytics' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { label: 'User Management', icon: Users, to: '/admin/users' },
    { label: 'Goals Overview', icon: Target, to: '/admin/goals' },
    { label: 'Analytics', icon: BarChart3, to: '/admin/analytics' },
    { label: 'Audit Logs', icon: Activity, to: '/admin/audit' },
    { label: 'Cycle Management', icon: Calendar, to: '/admin/cycles' },
    { label: 'Reports', icon: FileText, to: '/admin/reports' },
  ],
};

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navConfig[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    employee: 'from-blue-500 to-cyan-500',
    manager: 'from-violet-500 to-purple-600',
    admin: 'from-orange-500 to-red-500',
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40',
        'bg-sidebar border-r border-sidebar-border',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">GoalForge</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors',
            collapsed && 'absolute -right-3 top-5 bg-card border border-border shadow-md'
          )}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br',
              roleColors[user?.role] || 'from-blue-500 to-cyan-500'
            )}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{getRoleLabel(user?.role)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/employee' || item.to === '/manager' || item.to === '/admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-primary text-white shadow-md shadow-primary/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                collapsed && 'justify-center px-2'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="flex-shrink-0 p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
            'text-red-400 hover:bg-red-500/10 transition-colors',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
