import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, getInitialAttendance, getFormattedDate } from '../data/initialData';

const AttendanceContext = createContext(null);

const STORAGE_KEYS = {
  STUDENTS: 'edutrack_students_v1',
  ATTENDANCE: 'edutrack_attendance_v1'
};

export const AttendanceProvider = ({ children }) => {
  // Load students from localStorage or fallback
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  // Load attendance records from localStorage or fallback
  const [attendance, setAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.error('Failed to load attendance from localStorage', e);
    }
    return getInitialAttendance();
  });

  const [selectedDate, setSelectedDate] = useState(getFormattedDate(0));
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    } catch (e) {
      console.error('Failed to save attendance to localStorage', e);
    }
  }, [attendance]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  // Add Student
  const addStudent = (studentData) => {
    // Generate unique ID
    const newId = `stu-${Date.now()}`;
    const newStudent = {
      ...studentData,
      id: newId,
      rollNo: studentData.rollNo?.trim() || String(students.length + 101),
      avatarColor: studentData.avatarColor || '#4F46E5'
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Automatically mark present for today by default or leave blank
    setAttendance((prev) => {
      const today = getFormattedDate(0);
      const todayRecords = prev[today] ? { ...prev[today] } : {};
      todayRecords[newId] = 'Present';
      return {
        ...prev,
        [today]: todayRecords
      };
    });

    showToast(`Student "${newStudent.name}" added successfully!`);
    return newStudent;
  };

  // Update Student
  const updateStudent = (id, updatedData) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...updatedData } : student))
    );
    showToast(`Student updated successfully!`);
  };

  // Delete Student
  const deleteStudent = (id) => {
    const studentToDelete = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((student) => student.id !== id));

    // Clean up attendance entries for this student
    setAttendance((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((dateKey) => {
        if (updated[dateKey] && updated[dateKey][id]) {
          const dayCopy = { ...updated[dateKey] };
          delete dayCopy[id];
          updated[dateKey] = dayCopy;
        }
      });
      return updated;
    });

    showToast(`Removed "${studentToDelete?.name || 'Student'}" from system.`, 'info');
  };

  // Mark single attendance
  const markAttendance = (studentId, status, targetDate = selectedDate) => {
    setAttendance((prev) => {
      const currentDayRecords = prev[targetDate] ? { ...prev[targetDate] } : {};
      currentDayRecords[studentId] = status;
      return {
        ...prev,
        [targetDate]: currentDayRecords
      };
    });
  };

  // Bulk mark attendance for given date
  const markAllAttendance = (status, targetDate = selectedDate, targetStudentIds = null) => {
    const ids = targetStudentIds || students.map((s) => s.id);
    setAttendance((prev) => {
      const currentDayRecords = prev[targetDate] ? { ...prev[targetDate] } : {};
      ids.forEach((id) => {
        currentDayRecords[id] = status;
      });
      return {
        ...prev,
        [targetDate]: currentDayRecords
      };
    });
    showToast(`Marked ${ids.length} students as "${status}" for ${targetDate}`);
  };

  // Reset to demo data
  const resetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setAttendance(getInitialAttendance());
    setSelectedDate(getFormattedDate(0));
    showToast('Reset data to initial sample demonstration records!', 'info');
  };

  // Calculate stats for a given date
  const getDateStats = (date = selectedDate) => {
    const dayRecords = attendance[date] || {};
    let presentCount = 0;
    let absentCount = 0;
    let unrecordedCount = 0;

    students.forEach((student) => {
      const status = dayRecords[student.id];
      if (status === 'Present') {
        presentCount++;
      } else if (status === 'Absent') {
        absentCount++;
      } else {
        unrecordedCount++;
      }
    });

    const recordedTotal = presentCount + absentCount;
    const percentage = recordedTotal > 0 ? Math.round((presentCount / recordedTotal) * 100) : 0;

    return {
      date,
      totalStudents: students.length,
      presentCount,
      absentCount,
      unrecordedCount,
      percentage
    };
  };

  // Calculate individual student attendance stats
  const getStudentStats = (studentId) => {
    const dates = Object.keys(attendance);
    let totalSessions = 0;
    let presentCount = 0;
    let absentCount = 0;

    dates.forEach((dateKey) => {
      const status = attendance[dateKey]?.[studentId];
      if (status === 'Present') {
        totalSessions++;
        presentCount++;
      } else if (status === 'Absent') {
        totalSessions++;
        absentCount++;
      }
    });

    const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    return {
      studentId,
      totalSessions,
      presentCount,
      absentCount,
      percentage
    };
  };

  // Daily trend for the past N days
  const getDailyTrends = (limitDays = 7) => {
    const trends = [];
    for (let i = limitDays - 1; i >= 0; i--) {
      const dateStr = getFormattedDate(-i);
      const stats = getDateStats(dateStr);
      // Format display label like "Mon 9" or "Nov 9"
      const dateObj = new Date(dateStr + 'T00:00:00');
      const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      trends.push({
        date: dateStr,
        label,
        ...stats
      });
    }
    return trends;
  };

  // Export reports to CSV
  const exportToCSV = () => {
    const headers = ['Roll No', 'Name', 'Grade', 'Total Days Recorded', 'Present Days', 'Absent Days', 'Attendance Percentage'];
    const rows = students.map((s) => {
      const stats = getStudentStats(s.id);
      return [
        `"${s.rollNo}"`,
        `"${s.name}"`,
        `"${s.grade}"`,
        stats.totalSessions,
        stats.presentCount,
        stats.absentCount,
        `"${stats.percentage}%"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Attendance_Report_${getFormattedDate(0)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report exported to CSV successfully!');
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        attendance,
        selectedDate,
        setSelectedDate,
        currentView,
        setCurrentView,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toast,
        showToast,
        addStudent,
        updateStudent,
        deleteStudent,
        markAttendance,
        markAllAttendance,
        resetDemoData,
        getDateStats,
        getStudentStats,
        getDailyTrends,
        exportToCSV
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
