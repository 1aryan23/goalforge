import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, ProgressBar, EmptyState } from '../../components/ui';
import { Plus, Edit2, Trash2, Send, Lock, AlertCircle, Target, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { calculateProgress } from '../../lib/utils';

const UOM_TYPES = ['Numeric', 'Percentage', 'Timeline', 'Zero-based'];
const THRUST_AREAS = ['Customer Success', 'Learning & Development', 'Quality', 'Delivery', 'Finance', 'Operations', 'Innovation', 'People & Culture'];

const INITIAL_GOALS = [
  { id: 1, thrustArea: 'Customer Success', title: 'Increase Customer Satisfaction Score', description: 'Achieve 90%+ CSAT', uom: 'Percentage', target: '90', weightage: 20, status: 'Approved', achievement: '82' },
  { id: 2, thrustArea: 'Learning & Development', title: 'Complete 5 Product Certifications', description: 'Earn 5 certifications by end of FY', uom: 'Numeric', target: '5', weightage: 15, status: 'Approved', achievement: '3' },
  { id: 3, thrustArea: 'Quality', title: 'Reduce Bug Backlog', description: 'Reduce open P1/P2 bugs to under 10', uom: 'Numeric', target: '10', weightage: 20, status: 'Approved', achievement: '6' },
  { id: 4, thrustArea: 'Delivery', title: 'Deliver Project X on Schedule', description: '100% on-time milestone delivery', uom: 'Timeline', target: '100', weightage: 25, status: 'Approved', achievement: '75' },
  { id: 5, thrustArea: 'Finance', title: 'Revenue Target Q4', description: 'Contribute to team revenue target', uom: 'Numeric', target: '500000', weightage: 10, status: 'Pending', achievement: '' },
  { id: 6, thrustArea: 'Operations', title: 'Zero Critical Incidents', description: 'Maintain zero P0 incidents', uom: 'Zero-based', target: '0', weightage: 10, status: 'Draft', achievement: '' },
];

const EMPTY_FORM = { thrustArea: '', title: '', description: '', uom: 'Numeric', target: '', weightage: '' };
const statusVariant = { Approved: 'success', Pending: 'warning', Draft: 'muted', Submitted: 'info', Rejected: 'danger', Rework: 'warning' };

export default function EmployeeGoals() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const closeForm = useCallback(() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); setErrors({}); }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeForm(); };
    if (showForm) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showForm, closeForm]);

  const totalWeightage = goals.reduce((sum, g) => sum + Number(g.weightage), 0);
  const editableGoals = goals.filter(g => ['Draft', 'Rework'].includes(g.status));

  const validate = () => {
    const errs = {};
    if (!form.thrustArea) errs.thrustArea = 'Required';
    if (!form.title) errs.title = 'Required';
    if (!form.target) errs.target = 'Required';
    const w = Number(form.weightage);
    if (!form.weightage || form.weightage === '') {
      errs.weightage = 'Required';
    } else if (isNaN(w) || w <= 0) {
      errs.weightage = 'Must be a positive number';
    } else if (w < 10) {
      errs.weightage = 'Minimum 10%';
    } else if (w > 100) {
      errs.weightage = 'Maximum 100%';
    } else {
      // Only check 100% cap when we have a valid number
      const otherW = goals
        .filter(g => g.id !== editId)
        .reduce((s, g) => s + Number(g.weightage), 0);
      if (otherW + w > 100) {
        const remaining = 100 - otherW;
        errs.weightage = remaining > 0
          ? `Max allowed is ${remaining}% (others: ${otherW}%)`
          : 'No weightage remaining — edit or delete existing goals first';
      }
    }
    if (!editId && goals.length >= 8) errs.general = 'Maximum 8 goals allowed';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editId) {
      setGoals(g => g.map(goal => goal.id === editId ? { ...goal, ...form, weightage: Number(form.weightage) } : goal));
      toast.success('Goal updated');
    } else {
      setGoals(g => [...g, { ...form, id: Date.now(), status: 'Draft', achievement: '', weightage: Number(form.weightage) }]);
      toast.success('Goal created');
    }
    setShowForm(false); setEditId(null); setForm(EMPTY_FORM); setErrors({});
  };

  const handleEdit = (goal) => {
    setForm({ thrustArea: goal.thrustArea, title: goal.title, description: goal.description, uom: goal.uom, target: goal.target, weightage: String(goal.weightage) });
    setEditId(goal.id); setShowForm(true);
  };

  const handleDelete = (id) => { setGoals(g => g.filter(goal => goal.id !== id)); toast.success('Goal removed'); };

  const handleSubmit = () => {
    if (editableGoals.length === 0) { toast.error('No draft goals to submit'); return; }
    if (totalWeightage !== 100) { toast.error(`Total weightage must be 100% (currently ${totalWeightage}%)`); return; }
    setGoals(g => g.map(goal => ['Draft', 'Rework'].includes(goal.status) ? { ...goal, status: 'Submitted' } : goal));
    toast.success('Goals submitted for manager review!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Goals</h1>
          <p className="text-muted-foreground text-sm">FY 2025–26 Performance Goals · Max 8 goals · Total must equal 100%</p>
        </div>
        <div className="flex items-center gap-3">
          {editableGoals.length > 0 && totalWeightage === 100 && (
            <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-lg" style={{ background: 'linear-gradient(135deg,hsl(142 71% 45%),hsl(160 84% 39%))' }}>
              <Send className="w-4 h-4" /> Submit for Approval
            </button>
          )}
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); setErrors({}); }} disabled={goals.length >= 8}
            className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-lg shadow-primary/25 disabled:opacity-40">
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>
      </div>

      {/* Weightage bar */}
      <Card className={totalWeightage === 100 ? 'border-emerald-500/30' : totalWeightage > 100 ? 'border-red-500/30' : 'border-amber-500/30'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Weightage Allocated</span>
            <span className={`text-lg font-bold ${totalWeightage === 100 ? 'text-emerald-400' : totalWeightage > 100 ? 'text-red-400' : 'text-amber-400'}`}>{totalWeightage}% / 100%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className={`h-2 rounded-full transition-all duration-500 ${totalWeightage === 100 ? 'bg-emerald-500' : totalWeightage > 100 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(totalWeightage, 100)}%` }} />
          </div>
          {totalWeightage !== 100 && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {totalWeightage < 100 ? `${100 - totalWeightage}% remaining to allocate` : `Over by ${totalWeightage - 100}%`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeForm}
        >
          <Card className="w-full max-w-xl glass-card border-white/10 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>{editId ? 'Edit Goal' : 'Add New Goal'}</CardTitle>
                <button onClick={closeForm} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Close (Esc)"><X className="w-5 h-5" /></button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-4">
              {errors.general && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">{errors.general}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Thrust Area *</label>
                  <select value={form.thrustArea} onChange={e => setForm(f => ({ ...f, thrustArea: e.target.value }))} className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select area...</option>
                    {THRUST_AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                  {errors.thrustArea && <p className="text-xs text-red-400 mt-1">{errors.thrustArea}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Unit of Measurement *</label>
                  <select value={form.uom} onChange={e => setForm(f => ({ ...f, uom: e.target.value }))} className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {UOM_TYPES.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Goal Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Clear, measurable goal title" />
                {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="How will this goal be achieved?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Target *</label>
                  <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Enter target value" />
                  {errors.target && <p className="text-xs text-red-400 mt-1">{errors.target}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Weightage (%) *</label>
                  <input type="number" value={form.weightage} onChange={e => { setForm(f => ({ ...f, weightage: e.target.value })); setErrors(err => ({ ...err, weightage: undefined })); }} min={10} max={100} className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Min 10%" />
                  {errors.weightage && <p className="text-xs text-red-400 mt-1">{errors.weightage}</p>}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowForm(false); setErrors({}); }} className="flex-1 px-4 py-2.5 bg-secondary text-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 border border-border">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90">{editId ? 'Update Goal' : 'Add Goal'}</button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {goals.length === 0 ? (
        <EmptyState icon={Target} title="No goals yet" description="Add your first performance goal for this FY cycle." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Goal', 'UoM', 'Target', 'Weight', 'Progress', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {goals.map((goal, idx) => {
                    const progress = calculateProgress(goal.uom, goal.target, goal.achievement);
                    const canEdit = ['Draft', 'Rework'].includes(goal.status);
                    return (
                      <tr key={goal.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${idx % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {!canEdit && <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                            <div>
                              <p className="font-medium text-foreground">{goal.title}</p>
                              <p className="text-xs text-muted-foreground">{goal.thrustArea}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{goal.uom}</td>
                        <td className="p-4 font-medium">{goal.target}</td>
                        <td className="p-4"><Badge variant={goal.weightage >= 20 ? 'purple' : 'muted'}>{goal.weightage}%</Badge></td>
                        <td className="p-4 w-36">
                          <ProgressBar value={progress} showLabel={false} />
                          <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
                        </td>
                        <td className="p-4"><Badge variant={statusVariant[goal.status]}>{goal.status}</Badge></td>
                        <td className="p-4">
                          {canEdit ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit(goal)} className="p-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
