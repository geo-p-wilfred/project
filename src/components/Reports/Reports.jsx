import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Award, 
  Calendar,
  X,
  FileSpreadsheet,
  HelpCircle
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

export const Reports = () => {
  const { 
    students, 
    attendance, 
    getStudentStats, 
    exportToCSV 
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);

  // Available unique grades for filter
  const grades = ['All', ...Array.from(new Set(students.map((s) => s.grade))).sort()];

  // Calculate stats for all students
  const reportData = students.map((student) => {
    const stats = getStudentStats(student.id);
    return {
      student,
      ...stats
    };
  });

  // Filter report data
  const filteredData = reportData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.student.name?.toLowerCase().includes(query) ||
      item.student.rollNo?.toLowerCase().includes(query) ||
      item.student.grade?.toLowerCase().includes(query);

    const matchesGrade = gradeFilter === 'All' || item.student.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  // Aggregate metrics
  const totalRecordedDaysCount = Object.keys(attendance).length;
  const overallAvgPercentage =
    filteredData.length > 0
      ? Math.round(filteredData.reduce((acc, curr) => acc + curr.percentage, 0) / filteredData.length)
      : 0;

  const highPerformersCount = filteredData.filter((item) => item.percentage >= 85).length;
  const criticalCount = filteredData.filter((item) => item.percentage < 75).length;

  const getPercentageColor = (percentage) => {
    if (percentage >= 85) return 'var(--success)';
    if (percentage >= 75) return 'var(--primary)';
    if (percentage >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 85) {
      return (
        <span className="badge" style={{ background: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)' }}>
          <Award size={12} /> Excellent (85%+)
        </span>
      );
    }
    if (percentage >= 75) {
      return (
        <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          Good Turnout
        </span>
      );
    }
    if (percentage >= 60) {
      return (
        <span className="badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}>
          <AlertTriangle size={12} /> Needs Attention
        </span>
      );
    }
    return (
      <span className="badge" style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--danger-border)' }}>
        <AlertTriangle size={12} /> Defaulter (&lt;60%)
      </span>
    );
  };

  // Get date-by-date history for selected student
  const getStudentHistoryLogs = (studentId) => {
    const dates = Object.keys(attendance).sort().reverse();
    return dates.map((date) => {
      const status = attendance[date]?.[studentId] || 'Unrecorded';
      return { date, status };
    });
  };

  return (
    <div className="page-container">
      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Class Average</span>
            <div className="stat-value" style={{ color: getPercentageColor(overallAvgPercentage) }}>
              {overallAvgPercentage}%
            </div>
            <span className="stat-subtext">Overall turnout rate</span>
          </div>
          <div className="stat-icon-wrapper stat-icon-primary">
            <BarChart3 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Days Logged</span>
            <div className="stat-value">{totalRecordedDaysCount}</div>
            <span className="stat-subtext">Recorded dates in system</span>
          </div>
          <div className="stat-icon-wrapper stat-icon-warning">
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Excellent Turnout</span>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {highPerformersCount}
            </div>
            <span className="stat-subtext">Students with &ge; 85% attendance</span>
          </div>
          <div className="stat-icon-wrapper stat-icon-success">
            <Award size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Low Attendance</span>
            <div className="stat-value" style={{ color: 'var(--danger)' }}>
              {criticalCount}
            </div>
            <span className="stat-subtext">Students below 75% threshold</span>
          </div>
          <div className="stat-icon-wrapper stat-icon-danger">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="content-card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Individual Student Attendance Reports</h2>
            <p>Comprehensive attendance percentages, breakdown, and historical logs</p>
          </div>

          <div className="card-actions">
            {/* Search Box */}
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search students in report..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Grade Filter */}
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

            {/* Export CSV Button */}
            <button className="btn btn-secondary" onClick={exportToCSV}>
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filteredData.length === 0 ? (
            <div className="empty-state">
              <BarChart3 className="empty-state-icon" />
              <h3>No student reports found</h3>
              <p>Adjust your search filters or record more attendance.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Grade</th>
                    <th>Total Days</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th style={{ width: '220px' }}>Attendance Rate</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(({ student, totalSessions, presentCount, absentCount, percentage }) => {
                    const initials = student.name
                      ? student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()
                      : 'ST';

                    const color = getPercentageColor(percentage);

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
                              <div className="roll">{student.email || 'Student'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-grade">{student.grade}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{totalSessions}</td>
                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>{presentCount}</td>
                        <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{absentCount}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color }}>
                              <span>{percentage}%</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {presentCount}/{totalSessions} days
                              </span>
                            </div>
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: color
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(percentage)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedStudentForHistory(student)}
                          >
                            View Log
                          </button>
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

      {/* Individual Student History Modal */}
      {selectedStudentForHistory && (
        <div className="modal-backdrop" onClick={() => setSelectedStudentForHistory(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Attendance History</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedStudentForHistory.name} (Roll #{selectedStudentForHistory.rollNo}) - {selectedStudentForHistory.grade}
                </div>
              </div>
              <button 
                className="modal-close" 
                onClick={() => setSelectedStudentForHistory(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getStudentHistoryLogs(selectedStudentForHistory.id).map(({ date, status }) => (
                  <div
                    key={date}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{date}</span>
                    </div>
                    <div>
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
                      {status === 'Unrecorded' && (
                        <span className="badge badge-unmarked">
                          No Record
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedStudentForHistory(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
