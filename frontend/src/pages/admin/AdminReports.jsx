import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { Download, FileText, BarChart3, Users, Target } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const REPORTS = [
  { icon: Target, title: 'Goal Completion Report', desc: 'All goals with status, progress, and weightage by employee', color: 'blue' },
  { icon: Users, title: 'Department Performance', desc: 'Average achievement scores grouped by department', color: 'purple' },
  { icon: BarChart3, title: 'Manager Effectiveness', desc: 'Approval rates, team progress, and Q-on-Q comparison', color: 'green' },
  { icon: FileText, title: 'Audit Trail Export', desc: 'Full audit log export for compliance and governance', color: 'orange' },
  { icon: Target, title: 'Quarterly Check-In Summary', desc: 'All Q1 check-in statuses and achievements', color: 'blue' },
  { icon: Users, title: 'Employee Goal Sheet', desc: 'Individual employee goal sheets for printing/sharing', color: 'purple' },
];

const colorMap = {
  blue: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
  purple: 'text-violet-400 bg-violet-400/10 border-violet-500/20',
  green: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
  orange: 'text-orange-400 bg-orange-400/10 border-orange-500/20',
};

export default function AdminReports() {
  const toast = useToast();
  const handleDownload = (title) => toast.success(`${title} download started`);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground text-sm">Generate and export organizational reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((report, i) => {
          const c = colorMap[report.color];
          return (
            <Card key={i} className="hover:border-white/10 transition-all hover:-translate-y-0.5 cursor-pointer" onClick={() => handleDownload(report.title)}>
              <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${c}`}>
                  <report.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{report.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{report.desc}</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground text-xs rounded-lg border border-border hover:border-white/10 transition-colors">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground text-xs rounded-lg border border-border hover:border-white/10 transition-colors">
                    <Download className="w-3 h-3" /> Excel
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground text-xs rounded-lg border border-border hover:border-white/10 transition-colors">
                    <Download className="w-3 h-3" /> PDF
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
