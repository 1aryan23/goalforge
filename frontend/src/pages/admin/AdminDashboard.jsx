import React from 'react';
import { StatCard, Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Users, Target, BarChart3, Activity, TrendingUp, CheckCircle, Clock, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const deptData = [
  { dept: 'Engineering', goals: 48, approved: 42, avg: 74 },
  { dept: 'Product', dept_short: 'Product', goals: 32, approved: 30, avg: 81 },
  { dept: 'Design', dept_short: 'Design', goals: 18, approved: 15, avg: 58 },
  { dept: 'Sales', dept_short: 'Sales', goals: 40, approved: 38, avg: 88 },
  { dept: 'HR', dept_short: 'HR', goals: 12, approved: 12, avg: 92 },
];

const statusPie = [
  { name: 'Approved', value: 137, color: 'hsl(142 71% 45%)' },
  { name: 'Pending', value: 23, color: 'hsl(38 92% 50%)' },
  { name: 'Draft', value: 14, color: 'hsl(215 20% 45%)' },
  { name: 'Rejected', value: 8, color: 'hsl(0 84% 60%)' },
];

const trendData = [
  { month: 'Jul', goals: 182 }, { month: 'Aug', goals: 174 }, { month: 'Sep', goals: 190 },
  { month: 'Oct', goals: 0 }, { month: 'Nov', goals: 0 }, { month: 'Dec', goals: 0 },
];

const RECENT_ACTIVITY = [
  { action: 'Goals Approved', user: 'Mgr Bob Smith', time: '2 min ago', type: 'success' },
  { action: 'New User Created', user: 'Admin System', time: '15 min ago', type: 'info' },
  { action: 'Goal Unlocked', user: 'Admin Ravi', time: '1 hr ago', type: 'warning' },
  { action: 'Cycle Updated', user: 'Admin Ravi', time: '2 hr ago', type: 'info' },
  { action: 'Goal Rejected', user: 'Mgr Alice Lee', time: '3 hr ago', type: 'danger' },
];

const activityColors = { success: 'bg-emerald-400', info: 'bg-blue-400', warning: 'bg-amber-400', danger: 'bg-red-400' };

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Organization-wide overview · FY 2025–26</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value="124" icon={Users} color="blue" trend={8} />
        <StatCard title="Total Goals" value="182" icon={Target} color="purple" subtitle="This FY" />
        <StatCard title="Approval Rate" value="88%" icon={CheckCircle} color="green" trend={3} />
        <StatCard title="Avg Progress" value="72%" icon={TrendingUp} color="orange" trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Goals by Department</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                    <XAxis dataKey="dept" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                    <Bar dataKey="goals" name="Total Goals" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="approved" name="Approved" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
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
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {statusPie.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Goal Creation Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="adminArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(217 32% 17%)', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="goals" stroke="hsl(262 83% 58%)" fill="url(#adminArea)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activityColors[item.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.user}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
