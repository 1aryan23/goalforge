import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, ProgressBar } from '../../components/ui';
import { CheckCircle, XCircle, RotateCcw, Eye, MessageSquare, X, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { calculateProgress } from '../../lib/utils';

const INITIAL_SUBMISSIONS = [
  {
    id: 1, employee: 'Alice Johnson', employeeRole: 'Senior Engineer', submittedAt: '2025-07-15',
    goals: [
      { id: 1, title: 'Increase CSAT Score', thrustArea: 'Customer Success', uom: 'Percentage', target: '90', weightage: 20, achievement: '82' },
      { id: 2, title: 'Complete Certifications', thrustArea: 'Learning', uom: 'Numeric', target: '5', weightage: 15, achievement: '3' },
      { id: 3, title: 'Reduce Bug Backlog', thrustArea: 'Quality', uom: 'Numeric', target: '10', weightage: 20, achievement: '6' },
      { id: 4, title: 'Project X Delivery', thrustArea: 'Delivery', uom: 'Timeline', target: '100', weightage: 25, achievement: '75' },
      { id: 5, title: 'Revenue Target', thrustArea: 'Finance', uom: 'Numeric', target: '500000', weightage: 10, achievement: '' },
      { id: 6, title: 'Zero Incidents', thrustArea: 'Operations', uom: 'Zero-based', target: '0', weightage: 10, achievement: '' },
    ],
    totalWeightage: 100, status: 'Pending'
  },
  {
    id: 2, employee: 'Carol White', employeeRole: 'Designer', submittedAt: '2025-07-18',
    goals: [
      { id: 7, title: 'Design System v2 Launch', thrustArea: 'Delivery', uom: 'Timeline', target: '100', weightage: 40, achievement: '' },
      { id: 8, title: 'User Research Interviews', thrustArea: 'Customer Success', uom: 'Numeric', target: '20', weightage: 30, achievement: '' },
      { id: 9, title: 'Accessibility Compliance', thrustArea: 'Quality', uom: 'Percentage', target: '100', weightage: 30, achievement: '' },
    ],
    totalWeightage: 100, status: 'Pending'
  },
];

const statusVariant = { Pending: 'warning', Approved: 'success', Rejected: 'danger', Rework: 'warning' };

export default function ManagerApprovals() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('Pending');
  const toast = useToast();

  const closeModal = useCallback(() => { setSelected(null); setComment(''); }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    if (selected) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected, closeModal]);

  const filtered = filter === 'All' ? submissions : submissions.filter(s => s.status === filter);

  const handleAction = (id, action) => {
    setSubmissions(s => s.map(sub => sub.id === id ? { ...sub, status: action } : sub));
    const msgs = { Approved: 'Goals approved successfully!', Rejected: 'Goals rejected.', Rework: 'Sent back for rework.' };
    toast[action === 'Approved' ? 'success' : action === 'Rework' ? 'warning' : 'error'](msgs[action]);
    setSelected(null);
    setComment('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Goal Approvals</h1>
          <p className="text-muted-foreground text-sm">Review and approve team goal submissions</p>
        </div>
        <div className="flex gap-2">
          {['Pending', 'Approved', 'Rejected', 'All'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'gradient-primary text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No submissions matching "{filter}"</div>
        )}
        {filtered.map(sub => (
          <Card key={sub.id} className="hover:border-white/10 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {sub.employee.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{sub.employee}</p>
                    <p className="text-xs text-muted-foreground">{sub.employeeRole} · {sub.goals.length} goals · Submitted {sub.submittedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[sub.status]}>{sub.status}</Badge>
                  <button onClick={() => setSelected(sub)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  {sub.status === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(sub.id, 'Approved')} className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction(sub.id, 'Rework')} className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-400 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction(sub.id, 'Rejected')} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <Card className="w-full max-w-2xl glass-card border-white/10 shadow-2xl animate-fade-in max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selected.employee}'s Goals</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{selected.employeeRole} · {selected.goals.length} goals · Total weightage: {selected.totalWeightage}%</p>
                </div>
                <button onClick={closeModal} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Close (Esc)"><X className="w-5 h-5" /></button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-3">
              {selected.goals.map(g => {
                const prog = calculateProgress(g.uom, g.target, g.achievement);
                return (
                  <div key={g.id} className="p-3 bg-secondary rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.thrustArea} · {g.uom} · Target: {g.target} · Weight: {g.weightage}%</p>
                      </div>
                      <Badge variant="muted">{g.weightage}%</Badge>
                    </div>
                    <ProgressBar value={prog} showLabel={false} />
                    <p className="text-xs text-muted-foreground mt-1">{prog}% achieved</p>
                  </div>
                );
              })}
              <div className="pt-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Manager Comment</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Add approval/rejection comment..." />
              </div>
              {selected.status === 'Pending' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleAction(selected.id, 'Rework')}
                    className="flex-1 px-4 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-sm font-semibold rounded-lg hover:bg-amber-500/20 transition-colors">
                    Request Rework
                  </button>
                  <button onClick={() => handleAction(selected.id, 'Rejected')}
                    className="flex-1 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-semibold rounded-lg hover:bg-red-500/20 transition-colors">
                    Reject
                  </button>
                  <button onClick={() => handleAction(selected.id, 'Approved')}
                    className="flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-lg" style={{ background: 'linear-gradient(135deg,hsl(142 71% 45%),hsl(160 84% 39%))' }}>
                    Approve All
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
