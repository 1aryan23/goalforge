import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Search, Filter, Activity } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

const AUDIT_LOGS = [
  { id: 1, timestamp: '2025-07-15T10:23:00', user: 'Bob Smith', role: 'manager', action: 'GOAL_APPROVED', entity: 'Goal', entityId: 'G-001', details: 'Approved Alice Johnson\'s goals (6 goals)', prevValue: 'Submitted', newValue: 'Approved' },
  { id: 2, timestamp: '2025-07-15T09:15:00', user: 'Alice Johnson', role: 'employee', action: 'GOAL_SUBMITTED', entity: 'Goal', entityId: 'G-001', details: 'Submitted goal sheet for approval', prevValue: 'Draft', newValue: 'Submitted' },
  { id: 3, timestamp: '2025-07-14T16:45:00', user: 'Admin Ravi', role: 'admin', action: 'GOAL_UNLOCKED', entity: 'Goal', entityId: 'G-003', details: 'Unlocked goal for revision', prevValue: 'Approved', newValue: 'Draft' },
  { id: 4, timestamp: '2025-07-14T14:30:00', user: 'Admin Ravi', role: 'admin', action: 'USER_CREATED', entity: 'User', entityId: 'U-012', details: 'Created new employee: Carol White', prevValue: null, newValue: 'Active' },
  { id: 5, timestamp: '2025-07-13T11:00:00', user: 'Bob Smith', role: 'manager', action: 'GOAL_REWORK', entity: 'Goal', entityId: 'G-004', details: 'Sent back for rework with comment', prevValue: 'Submitted', newValue: 'Rework' },
  { id: 6, timestamp: '2025-07-13T09:30:00', user: 'Alice Johnson', role: 'employee', action: 'GOAL_CREATED', entity: 'Goal', entityId: 'G-001', details: 'Created: "Increase CSAT Score"', prevValue: null, newValue: 'Draft' },
  { id: 7, timestamp: '2025-07-12T15:00:00', user: 'Eva Martinez', role: 'manager', action: 'CHECKIN_ADDED', entity: 'Checkin', entityId: 'CI-005', details: 'Q1 check-in comment added for David Lee', prevValue: null, newValue: 'On Track' },
  { id: 8, timestamp: '2025-07-12T10:15:00', user: 'Admin Ravi', role: 'admin', action: 'CYCLE_UPDATED', entity: 'Cycle', entityId: 'CY-2025', details: 'Updated Q1 deadline to Sep 30, 2025', prevValue: 'Sep 25', newValue: 'Sep 30' },
];

const actionColors = {
  GOAL_APPROVED: 'success', GOAL_SUBMITTED: 'info', GOAL_UNLOCKED: 'warning',
  USER_CREATED: 'info', GOAL_REWORK: 'warning', GOAL_CREATED: 'info',
  CHECKIN_ADDED: 'info', CYCLE_UPDATED: 'warning', GOAL_REJECTED: 'danger',
};

const roleColors = { employee: 'info', manager: 'purple', admin: 'warning' };

export default function AdminAudit() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const actions = ['All', 'GOAL_APPROVED', 'GOAL_SUBMITTED', 'GOAL_UNLOCKED', 'USER_CREATED', 'GOAL_REWORK', 'GOAL_CREATED'];

  const filtered = AUDIT_LOGS.filter(log =>
    (actionFilter === 'All' || log.action === actionFilter) &&
    (log.user.toLowerCase().includes(search.toLowerCase()) ||
     log.action.toLowerCase().includes(search.toLowerCase()) ||
     log.details.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground text-sm">Complete activity trail for compliance and governance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4" />
          <span>{AUDIT_LOGS.length} events logged</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search logs..." />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          {actions.map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Timestamp', 'User', 'Action', 'Entity', 'Details', 'Previous', 'New Value'].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={log.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                    <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground text-xs">{log.user}</p>
                        <Badge variant={roleColors[log.role]} className="mt-0.5 text-xs">{log.role}</Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={actionColors[log.action] || 'muted'}>
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">{log.entity} #{log.entityId}</td>
                    <td className="p-4 text-foreground text-xs max-w-[200px]">
                      <p className="truncate" title={log.details}>{log.details}</p>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">{log.prevValue || '—'}</td>
                    <td className="p-4 text-xs font-medium text-foreground">{log.newValue}</td>
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
