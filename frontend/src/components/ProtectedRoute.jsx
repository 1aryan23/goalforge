import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full gradient-primary animate-spin border-4 border-transparent border-t-white/20" />
          <p className="text-muted-foreground text-sm">Loading GoalForge...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRedirect = {
      employee: '/employee',
      manager: '/manager',
      admin: '/admin',
    };
    return <Navigate to={roleRedirect[user.role] || '/login'} replace />;
  }

  return <Outlet />;
}
