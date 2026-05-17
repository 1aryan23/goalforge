import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Plus, Edit2, Trash2, Search, X, Users } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const INITIAL_USERS = [
  { id: 1, name: 'Alpha Johnson',  email: 'alpha@goalforge.com',   role: 'employee', dept: 'Engineering', manager: 'Beta Smith',  status: 'Active' },
  { id: 2, name: 'Beta Smith',     email: 'beta@goalforge.com',    role: 'manager',  dept: 'Engineering', manager: 'Admin',       status: 'Active' },
  { id: 3, name: 'Charlie White',  email: 'charlie@goalforge.com', role: 'employee', dept: 'Design',      manager: 'Beta Smith',  status: 'Active' },
  { id: 4, name: 'Delta Lee',      email: 'delta@goalforge.com',   role: 'employee', dept: 'Engineering', manager: 'Beta Smith',  status: 'Active' },
  { id: 5, name: 'Echo Martinez',  email: 'echo@goalforge.com',    role: 'manager',  dept: 'QA',          manager: 'Admin',       status: 'Active' },
  { id: 6, name: 'Foxtrot User',   email: 'foxtrot@goalforge.com', role: 'admin',    dept: 'HR',          manager: '—',           status: 'Active' },
];

const roleColors = { employee: 'info', manager: 'purple', admin: 'warning' };
const EMPTY_FORM = { name: '', email: '', role: 'employee', dept: '', manager: '' };

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const toast = useToast();

  const closeForm = useCallback(() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeForm(); };
    if (showForm) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showForm, closeForm]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.dept.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.email || !form.dept) { toast.error('Fill all required fields'); return; }
    if (editId) {
      setUsers(u => u.map(user => user.id === editId ? { ...user, ...form } : user));
      toast.success('User updated');
    } else {
      setUsers(u => [...u, { ...form, id: Date.now(), status: 'Active' }]);
      toast.success('User created');
    }
    setShowForm(false); setEditId(null); setForm(EMPTY_FORM);
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role, dept: user.dept, manager: user.manager });
    setEditId(user.id); setShowForm(true);
  };

  const handleDelete = (id) => { setUsers(u => u.filter(user => user.id !== id)); toast.success('User removed'); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm">{users.length} total users</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
          className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Search users by name, email, or department..." />
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeForm}
        >
          <Card className="w-full max-w-lg glass-card border-white/10 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>{editId ? 'Edit User' : 'Add New User'}</CardTitle>
                <button onClick={closeForm} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Close (Esc)"><X className="w-5 h-5" /></button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="john@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role *</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin / HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Department *</label>
                  <input value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Engineering" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Manager</label>
                <input value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Manager name" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-secondary text-foreground text-sm font-medium rounded-lg border border-border hover:bg-secondary/80">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90">{editId ? 'Update' : 'Create User'}</button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['User', 'Email', 'Role', 'Department', 'Manager', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4"><Badge variant={roleColors[u.role]}>{u.role === 'admin' ? 'Admin/HR' : u.role.charAt(0).toUpperCase() + u.role.slice(1)}</Badge></td>
                    <td className="p-4 text-muted-foreground">{u.dept}</td>
                    <td className="p-4 text-muted-foreground">{u.manager}</td>
                    <td className="p-4"><Badge variant="success">{u.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(u)} className="p-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
