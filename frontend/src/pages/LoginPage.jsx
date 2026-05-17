import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Zap, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { label: 'Employee Demo', email: 'alpha@goalforge.com', password: 'password123', role: 'employee', color: 'from-blue-500 to-cyan-500' },
  { label: 'Manager Demo', email: 'beta@goalforge.com', password: 'password123', role: 'manager', color: 'from-violet-500 to-purple-600' },
  { label: 'Admin Demo', email: 'foxtrot@goalforge.com', password: 'password123', role: 'admin', color: 'from-orange-500 to-red-500' },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      const redirectMap = { employee: '/employee', manager: '/manager', admin: '/admin' };
      navigate(redirectMap[user.role] || '/employee');
      toast.success(`Welcome back, ${user.name}!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setForm({ email: account.email, password: account.password });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{
          background: 'linear-gradient(135deg, hsl(221 83% 15%) 0%, hsl(262 83% 12%) 50%, hsl(222 47% 8%) 100%)'
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-60 h-60 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">GoalForge</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Enterprise Goal
            <br />
            <span className="text-gradient">Management</span>
            <br />
            Platform
          </h1>
          <p className="text-slate-400 text-lg max-w-sm">
            Align your team, track performance, and achieve organizational excellence with data-driven goal management.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="relative space-y-4">
          {[
            { icon: '🎯', text: 'SMART Goal Setting & Tracking' },
            { icon: '📊', text: 'Real-time Analytics & Dashboards' },
            { icon: '✅', text: 'Manager Approval Workflows' },
            { icon: '🔄', text: 'Quarterly Performance Check-ins' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-500">Trusted by 500+ organizations worldwide</p>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">GoalForge</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign in to your account</h2>
            <p className="text-muted-foreground text-sm mt-1">Enter your credentials to access your workspace</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc)}
                  className={`p-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${acc.color} hover:opacity-90 transition-opacity shadow-md`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or sign in manually</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-10 pr-11 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Default password for demo accounts: <code className="text-primary">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
