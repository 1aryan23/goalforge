import React, { useState } from 'react';
import { StatCard, Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Users, CheckCircle, Clock, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const TEAM_MEMBERS = [
  { id: 1, name: 'Alpha Johnson',  role: 'Senior Engineer', goals: 6, approved: 6, progress: 82, status: 'On Track' },
  { id: 2, name: 'Beta Smith',     role: 'Product Manager', goals: 7, approved: 5, progress: 71, status: 'On Track' },
  { id: 3, name: 'Charlie White',  role: 'Designer',        goals: 5, approved: 3, progress: 45, status: 'At Risk' },
  { id: 4, name: 'Delta Lee',      role: 'Engineer',        goals: 6, approved: 6, progress: 90, status: 'Ahead' },
  { id: 5, name: 'Echo Martinez',  role: 'QA Lead',         goals: 8, approved: 7, progress: 60, status: 'On Track' },
];

const teamBarData = TEAM_MEMBERS.map(m => ({ name: m.name.split(' ')[0], progress: m.progress }));
const statusPie = [
  { name: 'On Track', value: 3, color: 'hsl(221 83% 53%)' },
  { name: 'Ahead', value: 1, color: 'hsl(142 71% 45%)' },
  { name: 'At Risk', value: 1, color: 'hsl(38 92% 50%)' },
];

const statusBadge = { 'On Track': 'info', 'Ahead': 'success', 'At Risk': 'warning' };

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Dashboard</h1>
        <p className="text-muted-foreground text-sm">FY 2025–26 · Q1 · Manage and monitor your team's performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Team Members" value={TEAM_MEMBERS.length} icon={Users} color="blue" />
        <StatCard title="Goals Submitted" value={32} icon={Target} color="purple" subtitle="Awaiting review: 4" />
        <StatCard title="Approved" value={27} icon={CheckCircle} color="green" trend={8} />
        <StatCard title="Avg Progress" value="70%" icon={TrendingUp} color="orange" trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Team Progress Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                    <Bar dataKey="progress" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {statusPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ color: 'hsl(215 20% 65%)', fontSize: 12 }}>{v}</span>} />
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Member', 'Role', 'Goals', 'Approved', 'Progress', 'Status'].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map((m, i) => (
                  <tr key={m.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {m.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{m.role}</td>
                    <td className="p-4 font-medium">{m.goals}</td>
                    <td className="p-4 text-emerald-400 font-medium">{m.approved}</td>
                    <td className="p-4 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${m.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{m.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant={statusBadge[m.status]}>{m.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
