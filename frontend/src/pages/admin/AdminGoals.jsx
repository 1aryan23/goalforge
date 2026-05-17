import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { ProgressBar } from '../../components/ui';
import { Lock, Unlock, Search, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { calculateProgress } from '../../lib/utils';

const ALL_GOALS = [
  { id: 1, employee: 'Alice Johnson', dept: 'Engineering', title: 'Increase CSAT Score', uom: 'Percentage', target: '90', achievement: '82', weightage: 20, status: 'Approved', locked: true },
  { id: 2, employee: 'Bob Smith', dept: 'Engineering', title: 'Revenue Target Q4', uom: 'Numeric', target: '500000', achievement: '320000', weightage: 30, status: 'Approved', locked: true },
  { id: 3, employee: 'Carol White', dept: 'Design', title: 'Design System v2 Launch', uom: 'Timeline', target: '100', achievement: '40', weightage: 40, status: 'Submitted', locked: false },
  { id: 4, employee: 'David Lee', dept: 'Engineering', title: 'Zero Critical Incidents', uom: 'Zero-based', target: '0', achievement: '0', weightage: 20, status: 'Approved', locked: true },
  { id: 5, employee: 'Eva Martinez', dept: 'QA', title: 'Test Coverage 80%+', uom: 'Percentage', target: '80', achievement: '65', weightage: 25, status: 'Approved', locked: true },
];

const statusVariant = { Approved: 'success', Submitted: 'info', Pending: 'warning', Rejected: 'danger', Draft: 'muted' };

export default function AdminGoals() {
  const [goals, setGoals] = useState(ALL_GOALS);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const filtered = goals.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.employee.toLowerCase().includes(search.toLowerCase()) ||
    g.dept.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLock = (id) => {
    setGoals(g => g.map(goal => goal.id === id ? { ...goal, locked: !goal.locked } : goal));
    const goal = goals.find(g => g.id === id);
    toast[goal.locked ? 'success' : 'warning'](goal.locked ? 'Goal unlocked for revision' : 'Goal locked');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Goals Overview</h1>
        <p className="text-muted-foreground text-sm">All organizational goals — unlock individual goals for revision</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Search goals, employees, departments..." />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Employee', 'Department', 'Goal', 'UoM', 'Target', 'Progress', 'Weight', 'Status', 'Lock'].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => {
                  const prog = calculateProgress(g.uom, g.target, g.achievement);
                  return (
                    <tr key={g.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">{g.employee.charAt(0)}</div>
                          <span className="font-medium text-foreground text-xs">{g.employee}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{g.dept}</td>
                      <td className="p-4 font-medium text-foreground text-xs max-w-[180px]"><p className="truncate">{g.title}</p></td>
                      <td className="p-4 text-muted-foreground text-xs">{g.uom}</td>
                      <td className="p-4 text-xs">{g.target}</td>
                      <td className="p-4 w-28">
                        <ProgressBar value={prog} showLabel={false} />
                        <p className="text-xs text-muted-foreground mt-1">{prog}%</p>
                      </td>
                      <td className="p-4"><Badge variant="muted">{g.weightage}%</Badge></td>
                      <td className="p-4"><Badge variant={statusVariant[g.status]}>{g.status}</Badge></td>
                      <td className="p-4">
                        <button onClick={() => toggleLock(g.id)}
                          className={`p-1.5 rounded-lg transition-colors ${g.locked ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                          title={g.locked ? 'Unlock goal' : 'Lock goal'}>
                          {g.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
