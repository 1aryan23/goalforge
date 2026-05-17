import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, ProgressBar, Badge, StatCard } from '../../components/ui';
import { TrendingUp, Award, Target, BarChart2 } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { calculateProgress } from '../../lib/utils';

const GOALS = [
  { title: 'Customer Satisfaction', thrustArea: 'Customer Success', uom: 'Percentage', target: '90', achievement: '82', weightage: 20 },
  { title: 'Product Certifications', thrustArea: 'Learning', uom: 'Numeric', target: '5', achievement: '3', weightage: 15 },
  { title: 'Reduce Bug Backlog', thrustArea: 'Quality', uom: 'Numeric', target: '10', achievement: '6', weightage: 20 },
  { title: 'Project X Delivery', thrustArea: 'Delivery', uom: 'Timeline', target: '100', achievement: '75', weightage: 25 },
  { title: 'Revenue Target', thrustArea: 'Finance', uom: 'Numeric', target: '500000', achievement: '0', weightage: 10 },
  { title: 'Zero Incidents', thrustArea: 'Operations', uom: 'Zero-based', target: '0', achievement: '0', weightage: 10 },
];

const radarData = [
  { area: 'Customer', score: 91 },
  { area: 'Learning', score: 60 },
  { area: 'Quality', score: 60 },
  { area: 'Delivery', score: 75 },
  { area: 'Finance', score: 0 },
  { area: 'Operations', score: 100 },
];

const quarterlyBar = [
  { q: 'Q1', score: 68 },
  { q: 'Q2', score: 0 },
  { q: 'Q3', score: 0 },
  { q: 'Q4', score: 0 },
];

export default function EmployeeProgress() {
  const goals = GOALS.map(g => ({ ...g, progress: calculateProgress(g.uom, g.target, g.achievement) }));
  const weightedScore = goals.reduce((sum, g) => sum + (g.progress * g.weightage) / 100, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground text-sm">Detailed performance breakdown for FY 2025–26</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Weighted Score" value={`${Math.round(weightedScore)}%`} icon={Award} color="purple" />
        <StatCard title="Goals Completed" value={goals.filter(g => g.progress >= 100).length} icon={Target} color="green" />
        <StatCard title="On Track" value={goals.filter(g => g.progress > 0 && g.progress < 100).length} icon={TrendingUp} color="blue" />
        <StatCard title="Not Started" value={goals.filter(g => g.progress === 0).length} icon={BarChart2} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Goal-wise Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {goals.map((g, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-foreground truncate pr-2">{g.title}</span>
                  <span className="text-muted-foreground text-xs">{g.weightage}%</span>
                </div>
                <ProgressBar value={g.progress} showLabel={false} />
                <p className="text-xs text-muted-foreground mt-1">{g.achievement || '—'} / {g.target} ({g.uom}) — {g.progress}%</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Thrust Area Coverage</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(217 32% 17%)" />
                  <PolarAngleAxis dataKey="area" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="hsl(221 83% 53%)" fill="hsl(221 83% 53%)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Quarterly Achievement Trend</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyBar}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                <XAxis dataKey="q" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="score" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
