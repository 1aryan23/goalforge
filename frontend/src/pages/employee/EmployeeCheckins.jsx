import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Save } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const QUARTERS = [
  { key: 'Q1', label: 'Q1', period: 'Jul – Sep 2025', status: 'active' },
  { key: 'Q2', label: 'Q2', period: 'Oct – Dec 2025', status: 'upcoming' },
  { key: 'Q3', label: 'Q3', period: 'Jan – Mar 2026', status: 'upcoming' },
  { key: 'Q4', label: 'Q4', period: 'Apr – Jun 2026', status: 'upcoming' },
];

const GOALS_FOR_CHECKIN = [
  { id: 1, title: 'Increase Customer Satisfaction Score', target: '90', uom: 'Percentage', weightage: 20 },
  { id: 2, title: 'Complete 5 Product Certifications', target: '5', uom: 'Numeric', weightage: 15 },
  { id: 3, title: 'Reduce Bug Backlog', target: '10', uom: 'Numeric', weightage: 20 },
  { id: 4, title: 'Deliver Project X on Schedule', target: '100', uom: 'Timeline', weightage: 25 },
];

const STATUS_OPTIONS = ['Not Started', 'On Track', 'Completed'];
const statusColors = { 'Not Started': 'muted', 'On Track': 'info', 'Completed': 'success' };

export default function EmployeeCheckins() {
  const [activeQ, setActiveQ] = useState('Q1');
  const [checkins, setCheckins] = useState({});
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  const getCheckin = (goalId) => checkins[`${activeQ}_${goalId}`] || { achievement: '', status: 'Not Started', comment: '' };
  const updateCheckin = (goalId, field, value) => {
    setCheckins(prev => ({ ...prev, [`${activeQ}_${goalId}`]: { ...getCheckin(goalId), [field]: value } }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success(`${activeQ} check-in saved successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quarterly Check-In</h1>
          <p className="text-muted-foreground text-sm">Record your achievements and progress for each quarter</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-lg shadow-primary/25">
          <Save className="w-4 h-4" /> Save Check-In
        </button>
      </div>

      {/* Quarter selector */}
      <div className="grid grid-cols-4 gap-3">
        {QUARTERS.map(q => (
          <button key={q.key} onClick={() => q.status !== 'upcoming' && setActiveQ(q.key)}
            className={`p-4 rounded-xl border text-left transition-all ${activeQ === q.key ? 'border-primary/50 bg-primary/10' : q.status === 'upcoming' ? 'border-border bg-secondary/30 opacity-50 cursor-not-allowed' : 'border-border bg-secondary hover:border-white/10'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-bold text-foreground">{q.label}</span>
              {q.status === 'active' && <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
            </div>
            <p className="text-xs text-muted-foreground">{q.period}</p>
            <Badge variant={q.status === 'active' ? 'success' : 'muted'} className="mt-2 text-xs">{q.status === 'active' ? 'Active' : 'Upcoming'}</Badge>
          </button>
        ))}
      </div>

      {/* Check-in form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {activeQ} Self Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {GOALS_FOR_CHECKIN.map(goal => {
            const checkin = getCheckin(goal.id);
            return (
              <div key={goal.id} className="p-4 bg-secondary rounded-xl border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{goal.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Target: {goal.target} · {goal.uom} · Weight: {goal.weightage}%</p>
                  </div>
                  <Badge variant={statusColors[checkin.status]}>{checkin.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Actual Achievement</label>
                    <input type="number" value={checkin.achievement} onChange={e => updateCheckin(goal.id, 'achievement', e.target.value)}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={`Target: ${goal.target}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
                    <select value={checkin.status} onChange={e => updateCheckin(goal.id, 'status', e.target.value)}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Comments / Context</label>
                  <textarea value={checkin.comment} onChange={e => updateCheckin(goal.id, 'comment', e.target.value)}
                    rows={2} className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Add context about your progress..." />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
