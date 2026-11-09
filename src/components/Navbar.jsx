import React from 'react';
import { Menu, Calendar, Sparkles } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const Navbar = () => {
  const { 
    currentView, 
    setIsMobileSidebarOpen, 
    selectedDate 
  } = useAttendance();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Attendance Dashboard';
      case 'students':
        return 'Student Directory';
      case 'attendance':
        return 'Mark Attendance';
      case 'reports':
        return 'Attendance Analytics & Reports';
      default:
        return 'Student Attendance Tracker';
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button 
          className="btn-mobile-toggle"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open Navigation"
        >
          <Menu size={22} />
        </button>
        <div className="page-title-badge">
          <span>{getPageTitle()}</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="date-indicator">
          <Calendar size={15} />
          <span>Today: {formattedDate}</span>
        </div>
      </div>
    </header>
  );
};
