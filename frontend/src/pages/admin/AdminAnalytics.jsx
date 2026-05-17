import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, StatCard } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

const deptPerf = [
  { dept: 'Engineering', avg: 74, goals: 48 },
  { dept: 'Product', avg: 81, goals: 32 },
  { dept: 'Design', avg: 58, goals: 18 },
  { dept: 'Sales', avg: 88, goals: 40 },
  { dept: 'HR', avg: 92, goals: 12 },
];

const managerEff = [
  { manager: 'Bob Smith', team: 5, approvalRate: 92, avgProgress: 73 },
  { manager: 'Eva Martinez', team: 4, approvalRate: 88, avgProgress: 70 },
  { manager: 'Alice Lee', team: 6, approvalRate: 78, avgProgress: 65 },
];

const qovq = [
  { quarter: 'Q1 FY24', score: 68 },
  { quarter: 'Q2 FY24', score: 72 },
  { quarter: 'Q3 FY24', score: 75 },
  { quarter: 'Q4 FY24', score: 82 },
  { quarter: 'Q1 FY25', score: 74 },
];

const uomDist = [
  { name: 'Numeric', value: 52, color: 'hsl(221 83% 53%)' },
  { name: 'Percentage', value: 34, color: 'hsl(262 83% 58%)' },
  { name: 'Timeline', value: 28, color: 'hsl(142 71% 45%)' },
  { name: 'Zero-based', value: 18, color: 'hsl(38 92% 50%)' },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground text-sm">Organization-wide performance insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Org Score" value="74%" icon={BarChart3} color="blue" trend={6} />
        <StatCard title="High Performers" value="28" icon={TrendingUp} color="green" subtitle=">90% score" />
        <StatCard title="Dept Coverage" value="5" icon={Users} color="purple" subtitle="Departments" />
        <StatCard title="Goal Completion" value="68%" icon={Target} color="orange" trend={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Department Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptPerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="dept" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                  <Bar dataKey="avg" name="Avg Score %" fill="hsl(221 83% 53%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quarter-on-Quarter Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qovq}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                  <XAxis dataKey="quarter" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 90]} tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(262 83% 58%)" strokeWidth={2.5} dot={{ fill: 'hsl(262 83% 58%)', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Goal Type Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={uomDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {uomDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {uomDist.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium text-foreground ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Manager Effectiveness</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {managerEff.map((m, i) => (
              <div key={i} className="p-3 bg-secondary rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{m.manager.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{m.manager}</p>
                      <p className="text-xs text-muted-foreground">{m.team} team members</p>
                    </div>
                  </div>
                  <Badge variant={m.approvalRate >= 90 ? 'success' : 'info'}>{m.approvalRate}% approval</Badge>
                </div>
                <div className="w-full bg-card rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${m.avgProgress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Team avg: {m.avgProgress}% progress</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
