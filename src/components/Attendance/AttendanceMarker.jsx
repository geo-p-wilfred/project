import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCheck,
  X,
  Users,
  Sparkles
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { getFormattedDate } from '../../data/initialData';

export const AttendanceMarker = () => {
  const { 
    students, 
    attendance, 
    selectedDate, 
    setSelectedDate, 
    markAttendance, 
    markAllAttendance,
    showToast
  } = useAttendance();

  const [gradeFilter, setGradeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = getFormattedDate(0);

  // Available unique grades for filter
  const grades = ['All', ...Array.from(new Set(students.map((s) => s.grade))).sort()];

  // Filter students based on search and grade
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      student.name?.toLowerCase().includes(query) ||
      student.rollNo?.toLowerCase().includes(query) ||
      student.grade?.toLowerCase().includes(query);

    const matchesGrade = gradeFilter === 'All' || student.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  // Calculate stats for current selected date and current filter
  const currentDayRecords = attendance[selectedDate] || {};
  let presentCount = 0;
  let absentCount = 0;
  let unrecordedCount = 0;

  filteredStudents.forEach((student) => {
    const status = currentDayRecords[student.id];
    if (status === 'Present') presentCount++;
    else if (status === 'Absent') absentCount++;
    else unrecordedCount++;
  });

  const handleDateChange = (offset) => {
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + offset);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const handleMarkAll = (status) => {
    const targetIds = filteredStudents.map((s) => s.id);
    markAllAttendance(status, selectedDate, targetIds);
  };

  const formattedDisplayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="page-container">
      {/* Date Header Controls Card */}
      <div className="content-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header" style={{ padding: '1.25rem 1.5rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CalendarIcon size={22} color="var(--primary)" />
              Daily Attendance Sheet
            </h2>
            <p style={{ marginTop: '0.2rem' }}>
              Recording attendance for: <strong style={{ color: 'var(--text-main)' }}>{formattedDisplayDate}</strong>
            </p>
          </div>

          {/* Date Selector Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', borderRadius: 'var(--radius-md)', padding: '2px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                style={{ border: 'none', background: 'transparent' }}
                onClick={() => handleDateChange(-1)}
                title="Previous Day"
              >
                <ChevronLeft size={16} />
              </button>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  border: 'none',
                  background: '#ffffff',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />

              <button 
                className="btn btn-secondary btn-sm"
                style={{ border: 'none', background: 'transparent' }}
                onClick={() => handleDateChange(1)}
                title="Next Day"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              className={`btn btn-sm ${selectedDate === todayStr ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedDate(todayStr)}
            >
              Today
            </button>
          </div>
        </div>

        {/* Date Stat Badges & Quick Bulk Actions */}
        <div 
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'var(--bg-app)', 
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Counts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Summary for this section:
            </span>
            <span className="badge badge-present">
              <CheckCircle2 size={13} /> {presentCount} Present
            </span>
            <span className="badge badge-absent">
              <XCircle size={13} /> {absentCount} Absent
            </span>
            {unrecordedCount > 0 && (
              <span className="badge badge-unmarked">
                {unrecordedCount} Unmarked
              </span>
            )}
          </div>

          {/* Bulk Mark buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--success-text)', borderColor: 'var(--success-border)' }}
              onClick={() => handleMarkAll('Present')}
              title="Mark all displayed students as Present"
            >
              <CheckCheck size={14} /> Mark All Present
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--danger-text)', borderColor: 'var(--danger-border)' }}
              onClick={() => handleMarkAll('Absent')}
              title="Mark all displayed students as Absent"
            >
              <X size={14} /> Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Attendance List Card */}
      <div className="content-card">
        <div className="card-header">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search students to mark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              className="select-filter"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g === 'All' ? 'All Grades' : g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" />
              <h3>No students in this view</h3>
              <p>Check your filters or add students in the Students tab.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student</th>
                    <th>Grade</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const status = currentDayRecords[student.id];
                    const initials = student.name
                      ? student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()
                      : 'ST';

                    return (
                      <tr key={student.id}>
                        <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                          #{student.rollNo}
                        </td>
                        <td>
                          <div className="student-cell">
                            <div
                              className="avatar-circle"
                              style={{ backgroundColor: student.avatarColor || 'var(--primary)' }}
                            >
                              {initials}
                            </div>
                            <div className="student-meta">
                              <div className="name">{student.name}</div>
                              <div className="roll">{student.email || 'No email registered'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-grade">{student.grade}</span>
                        </td>
                        <td>
                          {status === 'Present' && (
                            <span className="badge badge-present">
                              <CheckCircle2 size={13} /> Present
                            </span>
                          )}
                          {status === 'Absent' && (
                            <span className="badge badge-absent">
                              <XCircle size={13} /> Absent
                            </span>
                          )}
                          {!status && (
                            <span className="badge badge-unmarked">
                              Not Marked
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="attendance-actions-toggle">
                            <button
                              type="button"
                              className={`toggle-btn ${status === 'Present' ? 'active-present' : ''}`}
                              onClick={() => markAttendance(student.id, 'Present')}
                            >
                              <CheckCircle2 size={15} /> Present
                            </button>
                            <button
                              type="button"
                              className={`toggle-btn ${status === 'Absent' ? 'active-absent' : ''}`}
                              onClick={() => markAttendance(student.id, 'Absent')}
                            >
                              <XCircle size={15} /> Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
