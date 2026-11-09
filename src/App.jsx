import React from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { StudentsList } from './components/Students/StudentsList';
import { AttendanceMarker } from './components/Attendance/AttendanceMarker';
import { Reports } from './components/Reports/Reports';
import { Notification } from './components/common/Notification';

const AppContent = () => {
  const { currentView } = useAttendance();

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentsList />;
      case 'attendance':
        return <AttendanceMarker />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main>{renderActiveView()}</main>
      </div>
      <Notification />
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <AppContent />
    </AttendanceProvider>
  );
}
