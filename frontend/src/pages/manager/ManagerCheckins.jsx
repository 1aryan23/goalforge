import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Calendar, MessageSquare, Save } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const TEAM_CHECKINS = [
  { id: 1, employee: 'Alice Johnson', goal: 'Increase CSAT Score', target: '90', uom: 'Percentage', achievement: '82', status: 'On Track', employeeComment: 'On track, steady improvement in Q1.' },
  { id: 2, employee: 'Alice Johnson', goal: 'Complete Certifications', target: '5', uom: 'Numeric', achievement: '3', status: 'On Track', employeeComment: 'Two more in progress.' },
  { id: 3, employee: 'Bob Smith', goal: 'Revenue Target', target: '500000', uom: 'Numeric', achievement: '320000', status: 'On Track', employeeComment: 'Pipeline looks strong for Q2.' },
  { id: 4, employee: 'Carol White', goal: 'Design System v2', target: '100', uom: 'Timeline', achievement: '40', status: 'Not Started', employeeComment: 'Dependencies blocking progress.' },
  { id: 5, employee: 'David Lee', goal: 'Zero Critical Incidents', target: '0', uom: 'Zero-based', achievement: '0', status: 'Completed', employeeComment: 'Clean track record so far.' },
];

const statusBadge = { 'On Track': 'info', 'Completed': 'success', 'Not Started': 'muted' };

export default function ManagerCheckins() {
  const [comments, setComments] = useState({});
  const toast = useToast();

  const handleSave = (id) => {
    toast.success('Manager comment saved');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Check-Ins</h1>
        <p className="text-muted-foreground text-sm">Review quarterly achievements and add manager feedback</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-2">
        {['Q1 (Jul–Sep)', 'Q2 (Oct–Dec)', 'Q3 (Jan–Mar)', 'Q4 (Apr–Jun)'].map((q, i) => (
          <div key={q} className={`p-3 rounded-xl border text-center ${i === 0 ? 'border-primary/50 bg-primary/10' : 'border-border bg-secondary/30 opacity-50'}`}>
            <p className="text-sm font-bold text-foreground">Q{i + 1}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{q.replace(`Q${i+1} `, '')}</p>
            {i === 0 && <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mt-1 animate-pulse" />}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {TEAM_CHECKINS.map(ci => (
          <Card key={ci.id} className="hover:border-white/10 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{ci.employee.charAt(0)}</div>
                    <span className="text-sm font-semibold text-foreground">{ci.employee}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{ci.goal}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-9">Target: {ci.target} ({ci.uom}) · Actual: {ci.achievement || '—'}</p>
                </div>
                <Badge variant={statusBadge[ci.status]}>{ci.status}</Badge>
              </div>

              {ci.employeeComment && (
                <div className="mb-3 p-3 bg-secondary rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Employee's Comment:</p>
                  <p className="text-sm text-foreground">{ci.employeeComment}</p>
                </div>
              )}

              <div className="flex gap-3">
                <textarea
                  value={comments[ci.id] || ''}
                  onChange={e => setComments(p => ({ ...p, [ci.id]: e.target.value }))}
                  rows={2} placeholder="Add manager feedback..."
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <button onClick={() => handleSave(ci.id)}
                  className="px-3 py-2 gradient-primary text-white text-sm rounded-lg hover:opacity-90 flex items-center gap-1 self-start">
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
