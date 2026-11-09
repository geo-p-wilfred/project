import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  BarChart3, 
  GraduationCap, 
  RotateCcw,
  X
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const Sidebar = () => {
  const { 
    currentView, 
    setCurrentView, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    resetDemoData,
    students
  } = useAttendance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: students.length },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-overlay ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <aside className={`sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="brand-name">EduTrack</div>
              <span className="brand-tag">Attendance Portal</span>
            </div>
          </div>
          {isMobileSidebarOpen && (
            <button 
              className="modal-close" 
              style={{ color: '#fff' }}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon className="nav-icon" />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && (
                  <span 
                    style={{ 
                      fontSize: '0.75rem', 
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="demo-box">
            <p><strong>Demo Data Active</strong></p>
            <p style={{ marginTop: '2px' }}>Stored in local browser storage</p>
            <button 
              className="btn-reset-demo" 
              onClick={resetDemoData}
              title="Reset students and attendance to initial demo data"
            >
              <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Reset Demo Records
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
