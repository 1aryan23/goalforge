import React from 'react';
import { cn } from '../lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)}>
      {children}
    </div>
  );
}

// Stat KPI card
export function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'blue', subtitle }) {
  const colorMap = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'text-blue-400', border: 'border-blue-500/20' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    purple: { bg: 'bg-violet-500/10', text: 'text-violet-400', icon: 'text-violet-400', border: 'border-violet-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', icon: 'text-orange-400', border: 'border-orange-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'text-red-400', border: 'border-red-500/20' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <Card className={cn('border glass-card hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5', c.border)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className={cn('text-3xl font-bold mt-1', c.text)}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={cn('p-3 rounded-xl', c.bg)}>
            <Icon className={cn('w-5 h-5', c.icon)} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className={cn('text-xs font-semibold', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-muted-foreground">{trendLabel || 'vs last quarter'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton loader
export function Skeleton({ className }) {
  return (
    <div className={cn('shimmer rounded-lg', className)} />
  );
}

// Badge component
export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    muted: 'bg-secondary text-muted-foreground border-border',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  );
}

// Progress bar
export function ProgressBar({ value, max = 100, color = 'blue', className, showLabel = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-violet-500',
  };
  const barColor = pct >= 80 ? colorMap.green : pct >= 50 ? colorMap.blue : pct >= 30 ? colorMap.orange : colorMap.red;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium text-foreground">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-2 rounded-full transition-all duration-700', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        {Icon && <Icon className="w-7 h-7 text-muted-foreground" />}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
