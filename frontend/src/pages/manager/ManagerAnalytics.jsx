import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { TrendingUp, Users, Target } from 'lucide-react';

const teamData = [
  { name: 'Alpha',   q1: 82, q2: 0, q3: 0, q4: 0 },
  { name: 'Beta',    q1: 71, q2: 0, q3: 0, q4: 0 },
  { name: 'Charlie', q1: 45, q2: 0, q3: 0, q4: 0 },
  { name: 'Delta',   q1: 90, q2: 0, q3: 0, q4: 0 },
  { name: 'Echo',    q1: 60, q2: 0, q3: 0, q4: 0 },
];

const thrustRadar = [
  { area: 'Customer', avg: 78 }, { area: 'Quality', avg: 65 },
  { area: 'Delivery', avg: 72 }, { area: 'Finance', avg: 45 },
  { area: 'Learning', avg: 60 }, { area: 'Operations', avg: 85 },
];

export default function ManagerAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Analytics</h1>
        <p className="text-muted-foreground text-sm">Performance insights and team metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Individual Q1 Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                  <Bar dataKey="q1" name="Q1 Score" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Thrust Area Avg (Team)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={thrustRadar}>
                  <PolarGrid stroke="hsl(217 32% 17%)" />
                  <PolarAngleAxis dataKey="area" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                  <Radar dataKey="avg" stroke="hsl(262 83% 58%)" fill="hsl(262 83% 58%)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Goal Completion Matrix</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Employee</th>
                  {['Customer', 'Learning', 'Quality', 'Delivery', 'Finance', 'Operations'].map(h => (
                    <th key={h} className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Alpha',   scores: [91, 60, 60, 75, 0, 100] },
                  { name: 'Beta',    scores: [80, 40, 70, 90, 64, 0] },
                  { name: 'Charlie', scores: [0, 0, 0, 40, 0, 0] },
                  { name: 'Delta',   scores: [100, 80, 100, 85, 70, 100] },
                  { name: 'Echo',    scores: [70, 50, 90, 60, 40, 100] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{row.name}</td>
                    {row.scores.map((s, j) => (
                      <td key={j} className="p-4 text-center">
                        <span className={`inline-block w-10 h-6 rounded text-xs font-bold leading-6 ${s >= 80 ? 'bg-emerald-500/20 text-emerald-400' : s >= 50 ? 'bg-blue-500/20 text-blue-400' : s > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-secondary text-muted-foreground'}`}>
                          {s > 0 ? `${s}%` : '—'}
                        </span>
                      </td>
                    ))}
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
