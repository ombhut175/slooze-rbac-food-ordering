import { Shield, Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RoleBadgeProps {
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * Role Badge Component
 * Displays user role with color-coded styling
 */
export function RoleBadge({ role, size = 'md', showIcon = true, className }: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  };

  const roleConfig = {
    ADMIN: {
      label: 'Administrator',
      icon: Shield,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    MANAGER: {
      label: 'Manager',
      icon: Star,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    MEMBER: {
      label: 'Member',
      icon: User,
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-700 dark:text-slate-300',
      borderColor: 'border-slate-200 dark:border-slate-700'
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium uppercase',
        sizeClasses[size],
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}
