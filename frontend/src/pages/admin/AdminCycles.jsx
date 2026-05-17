import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Calendar, Edit2, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const CYCLES = [
  {
    id: 1, year: 'FY 2025-26', status: 'Active',
    quarters: [
      { key: 'Q1', period: 'Jul 01 – Sep 30, 2025', status: 'active', goalsCount: 182 },
      { key: 'Q2', period: 'Oct 01 – Dec 31, 2025', status: 'upcoming', goalsCount: 0 },
      { key: 'Q3', period: 'Jan 01 – Mar 31, 2026', status: 'upcoming', goalsCount: 0 },
      { key: 'Q4', period: 'Apr 01 – Jun 30, 2026', status: 'upcoming', goalsCount: 0 },
    ],
    goalSettingDeadline: '2025-07-31',
    approvalDeadline: '2025-08-15',
  },
  {
    id: 2, year: 'FY 2024-25', status: 'Completed',
    quarters: [
      { key: 'Q1', period: 'Jul 01 – Sep 30, 2024', status: 'completed', goalsCount: 175 },
      { key: 'Q2', period: 'Oct 01 – Dec 31, 2024', status: 'completed', goalsCount: 175 },
      { key: 'Q3', period: 'Jan 01 – Mar 31, 2025', status: 'completed', goalsCount: 175 },
      { key: 'Q4', period: 'Apr 01 – Jun 30, 2025', status: 'completed', goalsCount: 175 },
    ],
    goalSettingDeadline: '2024-07-31',
    approvalDeadline: '2024-08-15',
  },
];

const qStatusColors = { active: 'success', upcoming: 'muted', completed: 'info' };

export default function AdminCycles() {
  const [editing, setEditing] = useState(null);
  const toast = useToast();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cycle Management</h1>
          <p className="text-muted-foreground text-sm">Manage performance cycles and quarterly windows</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-lg shadow-primary/25">
          <Calendar className="w-4 h-4" /> Create Cycle
        </button>
      </div>

      {CYCLES.map(cycle => (
        <Card key={cycle.id} className={cycle.status === 'Active' ? 'border-primary/30' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>{cycle.year}</CardTitle>
                <Badge variant={cycle.status === 'Active' ? 'success' : 'muted'}>{cycle.status}</Badge>
              </div>
              {cycle.status === 'Active' && (
                <button onClick={() => toast.info('Cycle edit mode coming soon')} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-secondary rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Goal Setting Deadline</p>
                <p className="text-sm font-semibold text-foreground">{cycle.goalSettingDeadline}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Manager Approval Deadline</p>
                <p className="text-sm font-semibold text-foreground">{cycle.approvalDeadline}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {cycle.quarters.map(q => (
                <div key={q.key} className={`p-4 rounded-xl border text-center ${q.status === 'active' ? 'border-primary/50 bg-primary/5' : q.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-secondary/30 opacity-60'}`}>
                  <p className="text-lg font-bold text-foreground">{q.key}</p>
                  <p className="text-xs text-muted-foreground mt-1">{q.period}</p>
                  {q.goalsCount > 0 && <p className="text-xs text-primary mt-2">{q.goalsCount} goals</p>}
                  <Badge variant={qStatusColors[q.status]} className="mt-2 text-xs">
                    {q.status === 'active' ? '● Active' : q.status === 'completed' ? '✓ Done' : 'Upcoming'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
