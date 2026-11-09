import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

export const Notification = () => {
  const { toast } = useAttendance();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'info':
        return <Info size={18} color="var(--info)" />;
      case 'error':
        return <AlertTriangle size={18} color="var(--danger)" />;
      case 'success':
      default:
        return <CheckCircle2 size={18} color="var(--success)" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type || 'success'}`}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
