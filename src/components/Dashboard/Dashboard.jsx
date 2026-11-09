import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Percent, 
  ArrowRight, 
  Calendar, 
  TrendingUp,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { getFormattedDate } from '../../data/initialData';

export const Dashboard = () => {
  const { 
    students, 
    getDateStats, 
    getDailyTrends, 
    setCurrentView,
    setSelectedDate,
    selectedDate
  } = useAttendance();

  const today = getFormattedDate(0);
  const todayStats = getDateStats(today);
  const trends = getDailyTrends(7);

  // Group students by grade and calculate grade-level attendance for today
  const gradeBreakdown = students.reduce((acc, student) => {
    const grade = student.grade || 'Unassigned';
    if (!acc[grade]) {
      acc[grade] = { total: 0, present: 0 };
    }
    acc[grade].total += 1;
    // Check attendance for today
    const currentDayStats = getDateStats(today);
    // Let's check status directly
    return acc;
  }, {});

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Welcome to Student Attendance Portal
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Real-time attendance overview and performance insights for today ({today}).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn"
            style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }}
            onClick={() => {
              setSelectedDate(today);
              setCurrentView('attendance');
            }}
          >
            <Calendar size={16} />
            Take Today's Attendance
          </button>
          <button 
            className="btn"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            onClick={() => setCurrentView('students')}
          >
            <Users size={16} />
            Manage Students
          </button>
        </div>
      </div>

      {/* 4 Main Stat Cards (Requirement 4) */}
      <div className="stats-grid">
        {/* Total Students */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <div className="stat-value">{todayStats.totalStudents}</div>
            <span className="stat-subtext">Active enrolled students</span>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            <Users size={26} />
          </div>
        </div>

        {/* Present Students */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Present Today</span>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {todayStats.presentCount}
            </div>
            <span className="stat-subtext">
              {todayStats.unrecordedCount > 0 ? `${todayStats.unrecordedCount} yet to record` : 'Marked present'}
            </span>
          </div>
          <div className="stat-icon-wrapper stat-icon-success">
            <UserCheck size={26} />
          </div>
        </div>

        {/* Absent Students */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Absent Today</span>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>
              {todayStats.absentCount}
            </div>
            <span className="stat-subtext">Marked absent</span>
          </div>
          <div className="stat-icon-wrapper stat-icon-danger">
            <UserX size={26} />
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Attendance Rate</span>
            <div className="stat-value" style={{ color: todayStats.percentage >= 75 ? 'var(--primary)' : 'var(--danger)' }}>
              {todayStats.percentage}%
            </div>
            <span className="stat-subtext">
              {todayStats.percentage >= 85 ? '🌟 Excellent turnout' : todayStats.percentage >= 75 ? '👍 Normal turnout' : '⚠️ Low turnout'}
            </span>
          </div>
          <div className="stat-icon-wrapper stat-icon-warning">
            <Percent size={26} />
          </div>
        </div>
      </div>

      {/* Grid: 7-Day Trend Chart & Quick Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Attendance Trends */}
        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-group">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="var(--primary)" />
                7-Day Attendance Trend
              </h2>
              <p>Daily turnout percentage across all registered classes</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('reports')}
            >
              Full Reports <ArrowRight size={14} />
            </button>
          </div>
          <div className="card-body">
            <div className="trends-container">
              {trends.map((item, index) => {
                const heightPercent = Math.max(item.percentage, 8);
                const isToday = item.date === today;
                return (
                  <div key={item.date} className="trend-bar-wrapper">
                    <span className="trend-bar-percent">{item.percentage}%</span>
                    <div 
                      className="trend-bar" 
                      style={{ 
                        height: `${heightPercent}%`,
                        background: isToday 
                          ? 'linear-gradient(180deg, #4F46E5 0%, #818CF8 100%)' 
                          : 'linear-gradient(180deg, #94A3B8 0%, #CBD5E1 100%)',
                        boxShadow: isToday ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none'
                      }}
                      title={`${item.date}: ${item.presentCount} Present, ${item.absentCount} Absent (${item.percentage}%)`}
                    />
                    <span 
                      className="trend-bar-label"
                      style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--primary)' : 'var(--text-muted)' }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--primary)' }}></span>
                Today
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#94A3B8' }}></span>
                Past Days
              </span>
            </div>
          </div>
        </div>

        {/* Quick Highlights & Status */}
        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-group">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="var(--primary)" />
                Attendance Highlights
              </h2>
              <p>Key metrics and system overview</p>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Today's Recorded Sessions</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {today}</div>
              </div>
              <span className="badge badge-grade">
                {todayStats.presentCount + todayStats.absentCount} / {todayStats.totalStudents} Recorded
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Total Classes / Sections</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grade 10-A, 10-B, 11-A, 11-B, 12-A</div>
              </div>
              <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                5 Batches
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Data Persistence</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>HTML5 LocalStorage Sync</div>
              </div>
              <span className="badge" style={{ background: '#ecfdf5', color: '#065f46' }}>
                Active & Synced
              </span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => setCurrentView('attendance')}
              >
                Go to Attendance Sheet <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
