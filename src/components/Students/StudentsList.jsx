import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Filter, 
  Mail, 
  Phone,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { StudentModal } from './StudentModal';

export const StudentsList = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Available unique grades for filter
  const grades = ['All', ...Array.from(new Set(students.map((s) => s.grade))).sort()];

  // Filter students based on search and grade
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      student.name?.toLowerCase().includes(query) ||
      student.rollNo?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.grade?.toLowerCase().includes(query);

    const matchesGrade = gradeFilter === 'All' || student.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (formData) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="page-container">
      {/* Page Content Card */}
      <div className="content-card">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Student Directory</h2>
            <p>Manage, search, edit and enroll student profiles</p>
          </div>

          <div className="card-actions">
            {/* Search Box */}
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, roll no, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter by Grade */}
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

            {/* Add Student Button */}
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <UserPlus size={16} />
              Add Student
            </button>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <GraduationCap className="empty-state-icon" />
              <h3>No students found</h3>
              <p>Try adjusting your search criteria or add a new student.</p>
              {searchQuery && (
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ marginTop: '1rem' }}
                  onClick={() => { setSearchQuery(''); setGradeFilter('All'); }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Grade / Section</th>
                    <th>Gender</th>
                    <th>Contact Info</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
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
                              <div className="roll">ID: {student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-grade">{student.grade}</span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {student.gender || 'Not specified'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {student.email && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={12} /> {student.email}
                              </span>
                            )}
                            {student.phone && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={12} /> {student.phone}
                              </span>
                            )}
                            {!student.email && !student.phone && <span>—</span>}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              className="btn btn-secondary btn-icon-only"
                              title="Edit Student"
                              onClick={() => handleOpenEditModal(student)}
                            >
                              <Edit2 size={15} color="var(--primary)" />
                            </button>
                            <button
                              className="btn btn-secondary btn-icon-only"
                              title="Delete Student"
                              onClick={() => setStudentToDelete(student)}
                            >
                              <Trash2 size={15} color="var(--danger)" />
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

          {/* Table Footer info */}
          <div style={{ padding: '0.9rem 1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Showing {filteredStudents.length} of {students.length} students</span>
            <span>All records saved to local browser storage</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={editingStudent}
      />

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="modal-backdrop" onClick={() => setStudentToDelete(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                <AlertCircle size={20} /> Confirm Delete
              </div>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                Are you sure you want to remove <strong>{studentToDelete.name}</strong> (Roll #{studentToDelete.rollNo})?
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.5rem' }}>
                This will also remove their associated attendance logs from the system.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStudentToDelete(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
