import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getQuarter(date = new Date()) {
  const month = date.getMonth() + 1;
  if (month >= 7 && month <= 9) return 'Q1';
  if (month >= 10 && month <= 12) return 'Q2';
  if (month >= 1 && month <= 3) return 'Q3';
  return 'Q4';
}

export function calculateProgress(uom, target, achievement) {
  if (!achievement || !target) return 0;
  const t = parseFloat(target);
  const a = parseFloat(achievement);
  if (isNaN(t) || isNaN(a) || t === 0) return 0;

  switch (uom) {
    case 'Numeric':
    case 'Percentage':
      return Math.min(100, Math.round((a / t) * 100));
    case 'Zero-based':
      return a === 0 ? 100 : 0;
    case 'Timeline':
      return Math.min(100, Math.round((a / t) * 100));
    default:
      return Math.min(100, Math.round((a / t) * 100));
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'Completed': return 'text-emerald-400 bg-emerald-400/10';
    case 'On Track': return 'text-blue-400 bg-blue-400/10';
    case 'Not Started': return 'text-slate-400 bg-slate-400/10';
    case 'Approved': return 'text-emerald-400 bg-emerald-400/10';
    case 'Pending': return 'text-amber-400 bg-amber-400/10';
    case 'Rejected': return 'text-red-400 bg-red-400/10';
    case 'Draft': return 'text-slate-400 bg-slate-400/10';
    case 'Submitted': return 'text-blue-400 bg-blue-400/10';
    case 'Rework': return 'text-orange-400 bg-orange-400/10';
    default: return 'text-slate-400 bg-slate-400/10';
  }
}

export function getRoleLabel(role) {
  switch (role) {
    case 'employee': return 'Employee';
    case 'manager': return 'Manager';
    case 'admin': return 'Admin / HR';
    default: return role;
  }
}
