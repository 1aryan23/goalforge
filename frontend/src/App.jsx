import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeGoals from './pages/employee/EmployeeGoals';
import EmployeeCheckins from './pages/employee/EmployeeCheckins';
import EmployeeProgress from './pages/employee/EmployeeProgress';

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerApprovals from './pages/manager/ManagerApprovals';
import ManagerCheckins from './pages/manager/ManagerCheckins';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';
import ManagerTeamGoals from './pages/manager/ManagerTeamGoals';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGoals from './pages/admin/AdminGoals';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAudit from './pages/admin/AdminAudit';
import AdminCycles from './pages/admin/AdminCycles';
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Employee routes */}
            <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
              <Route element={<AppLayout />}>
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/employee/goals" element={<EmployeeGoals />} />
                <Route path="/employee/checkins" element={<EmployeeCheckins />} />
                <Route path="/employee/progress" element={<EmployeeProgress />} />
              </Route>
            </Route>

            {/* Manager routes */}
            <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
              <Route element={<AppLayout />}>
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/manager/goals" element={<ManagerTeamGoals />} />
                <Route path="/manager/approvals" element={<ManagerApprovals />} />
                <Route path="/manager/checkins" element={<ManagerCheckins />} />
                <Route path="/manager/analytics" element={<ManagerAnalytics />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AppLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/goals" element={<AdminGoals />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/audit" element={<AdminAudit />} />
                <Route path="/admin/cycles" element={<AdminCycles />} />
                <Route path="/admin/reports" element={<AdminReports />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
