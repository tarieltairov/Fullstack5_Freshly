import type { ReactNode } from 'react';
import styles from './EmptyState.module.scss';
import clsx from 'clsx';

interface EmptyStateProps {
  icon?: string;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  text,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx(styles.empty, className)}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
