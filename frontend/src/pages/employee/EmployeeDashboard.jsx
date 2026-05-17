import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI } from '../../lib/api';
import { StatCard, Card, CardHeader, CardTitle, CardContent, Badge, ProgressBar, Skeleton } from '../../components/ui';
import { Target, CheckCircle, Clock, TrendingUp, Plus, ArrowRight, Calendar, Award } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const MOCK_STATS = {
  totalGoals: 6,
  approvedGoals: 4,
  pendingGoals: 1,
  draftGoals: 1,
  overallProgress: 68,
  weightageUsed: 100,
};

const MOCK_GOALS = [
  { id: 1, title: 'Increase Customer Satisfaction Score', thrustArea: 'Customer Success', uom: 'Percentage', target: 90, achievement: 82, weightage: 20, status: 'Approved', progress: 91 },
  { id: 2, title: 'Complete 5 Product Certifications', thrustArea: 'Learning & Development', uom: 'Numeric', target: 5, achievement: 3, weightage: 15, status: 'Approved', progress: 60 },
  { id: 3, title: 'Reduce Bug Backlog', thrustArea: 'Quality', uom: 'Numeric', target: 10, achievement: 6, weightage: 20, status: 'Approved', progress: 60 },
  { id: 4, title: 'Deliver Project X on Schedule', thrustArea: 'Delivery', uom: 'Timeline', target: 100, achievement: 75, weightage: 25, status: 'Approved', progress: 75 },
  { id: 5, title: 'Revenue Target Q4', thrustArea: 'Finance', uom: 'Numeric', target: 500000, achievement: null, weightage: 10, status: 'Pending', progress: 0 },
  { id: 6, title: 'Zero Critical Incidents', thrustArea: 'Operations', uom: 'Zero-based', target: 0, achievement: null, weightage: 10, status: 'Draft', progress: 0 },
];

const MOCK_TREND = [
  { quarter: 'Q1 FY24', score: 72 },
  { quarter: 'Q2 FY24', score: 65 },
  { quarter: 'Q3 FY24', score: 78 },
  { quarter: 'Q4 FY24', score: 82 },
  { quarter: 'Q1 FY25', score: 68 },
];

const statusVariant = {
  Approved: 'success',
  Pending: 'warning',
  Draft: 'muted',
  Submitted: 'info',
  Rejected: 'danger',
  Rework: 'warning',
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const radialData = [{ name: 'Progress', value: MOCK_STATS.overallProgress, fill: 'url(#progressGrad)' }];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground text-sm">FY 2025–26 · Q1 (Jul–Sep)</p>
        </div>
        <Link
          to="/employee/goals"
          className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Goals" value={MOCK_STATS.totalGoals} icon={Target} color="blue" subtitle="This FY cycle" />
        <StatCard title="Approved" value={MOCK_STATS.approvedGoals} icon={CheckCircle} color="green" trend={12} />
        <StatCard title="Pending Review" value={MOCK_STATS.pendingGoals} icon={Clock} color="orange" />
        <StatCard title="Overall Score" value={`${MOCK_STATS.overallProgress}%`} icon={TrendingUp} color="purple" trend={5} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals list */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>My Goals</CardTitle>
                <Link to="/employee/goals" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_GOALS.map(goal => (
                <div key={goal.id} className="p-4 bg-secondary rounded-xl border border-border hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-sm font-semibold text-foreground truncate">{goal.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{goal.thrustArea} · {goal.uom} · {goal.weightage}%</p>
                    </div>
                    <Badge variant={statusVariant[goal.status]}>{goal.status}</Badge>
                  </div>
                  <ProgressBar value={goal.progress} showLabel={false} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{goal.progress}% complete</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Radial progress */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="60%"
                    outerRadius="90%"
                    data={[{ value: MOCK_STATS.overallProgress }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <defs>
                      <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(221 83% 53%)" />
                        <stop offset="100%" stopColor="hsl(262 83% 58%)" />
                      </linearGradient>
                    </defs>
                    <RadialBar
                      background={{ fill: 'hsl(217 32% 17%)' }}
                      dataKey="value"
                      fill="url(#progressGrad)"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center -mt-8">
                <p className="text-4xl font-bold text-gradient">{MOCK_STATS.overallProgress}%</p>
                <p className="text-xs text-muted-foreground mt-1">FY Achievement</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { icon: Plus, label: 'Add New Goal', to: '/employee/goals', color: 'text-blue-400' },
                { icon: Calendar, label: 'Q1 Check-In', to: '/employee/checkins', color: 'text-violet-400' },
                { icon: TrendingUp, label: 'View Progress', to: '/employee/progress', color: 'text-emerald-400' },
                { icon: Award, label: 'My Achievements', to: '/employee/progress', color: 'text-amber-400' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm text-foreground group-hover:text-white transition-colors">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance trend */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TREND}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                <XAxis dataKey="quarter" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'hsl(210 40% 98%)' }}
                  itemStyle={{ color: 'hsl(221 83% 65%)' }}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(221 83% 53%)" fill="url(#areaGrad)" strokeWidth={2} dot={{ fill: 'hsl(221 83% 53%)', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
