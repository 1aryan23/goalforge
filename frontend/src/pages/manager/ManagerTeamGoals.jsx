import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Target, Lock, CheckCircle, Eye, X } from 'lucide-react';
import { calculateProgress } from '../../lib/utils';
import { ProgressBar } from '../../components/ui';

const ALL_GOALS = [
  { id: 1, employee: 'Alice Johnson', title: 'Increase CSAT Score', thrustArea: 'Customer Success', uom: 'Percentage', target: '90', achievement: '82', weightage: 20, status: 'Approved' },
  { id: 2, employee: 'Alice Johnson', title: 'Complete Certifications', thrustArea: 'Learning', uom: 'Numeric', target: '5', achievement: '3', weightage: 15, status: 'Approved' },
  { id: 3, employee: 'Bob Smith', title: 'Revenue Target', thrustArea: 'Finance', uom: 'Numeric', target: '500000', achievement: '320000', weightage: 30, status: 'Approved' },
  { id: 4, employee: 'Carol White', title: 'Design System v2', thrustArea: 'Delivery', uom: 'Timeline', target: '100', achievement: '40', weightage: 40, status: 'Submitted' },
  { id: 5, employee: 'David Lee', title: 'Zero Incidents', thrustArea: 'Operations', uom: 'Zero-based', target: '0', achievement: '0', weightage: 20, status: 'Approved' },
  { id: 6, employee: 'Eva Martinez', title: 'Test Coverage 80%+', thrustArea: 'Quality', uom: 'Percentage', target: '80', achievement: '65', weightage: 25, status: 'Approved' },
];

const statusVariant = { Approved: 'success', Submitted: 'info', Pending: 'warning', Rejected: 'danger' };

export default function ManagerTeamGoals() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = ALL_GOALS.filter(g =>
    (statusFilter === 'All' || g.status === statusFilter) &&
    (g.title.toLowerCase().includes(search.toLowerCase()) || g.employee.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Goals</h1>
        <p className="text-muted-foreground text-sm">All goals across your team members</p>
      </div>

      <div className="flex items-center gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search goals or employees..."
          className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        {['All', 'Submitted', 'Approved', 'Rejected'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? 'gradient-primary text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
            {s}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Employee', 'Goal', 'Area', 'UoM', 'Target', 'Achievement', 'Progress', 'Weight', 'Status'].map(h => (
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
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{g.employee.charAt(0)}</div>
                          <span className="text-foreground font-medium">{g.employee}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-foreground max-w-[200px]">
                        <p className="truncate">{g.title}</p>
                      </td>
                      <td className="p-4 text-muted-foreground">{g.thrustArea}</td>
                      <td className="p-4 text-muted-foreground">{g.uom}</td>
                      <td className="p-4">{g.target}</td>
                      <td className="p-4 font-medium">{g.achievement || '—'}</td>
                      <td className="p-4 w-28">
                        <ProgressBar value={prog} showLabel={false} />
                        <p className="text-xs text-muted-foreground mt-1">{prog}%</p>
                      </td>
                      <td className="p-4"><Badge variant="muted">{g.weightage}%</Badge></td>
                      <td className="p-4"><Badge variant={statusVariant[g.status]}>{g.status}</Badge></td>
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
