import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check } from 'lucide-react';

const AVATAR_COLORS = [
  '#4F46E5', // Indigo
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#14B8A6'  // Teal
];

export const StudentModal = ({ isOpen, onClose, onSave, studentToEdit = null }) => {
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    grade: 'Grade 10-A',
    gender: 'Male',
    email: '',
    phone: '',
    avatarColor: '#4F46E5'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        rollNo: studentToEdit.rollNo || '',
        name: studentToEdit.name || '',
        grade: studentToEdit.grade || 'Grade 10-A',
        gender: studentToEdit.gender || 'Male',
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || '',
        avatarColor: studentToEdit.avatarColor || '#4F46E5'
      });
    } else {
      setFormData({
        rollNo: '',
        name: '',
        grade: 'Grade 10-A',
        gender: 'Male',
        email: '',
        phone: '',
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
      });
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Student name is required';
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll number is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {studentToEdit ? 'Edit Student Details' : 'Add New Student'}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 101"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                />
                {errors.rollNo && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.rollNo}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Grade / Section *</label>
                <select
                  className="form-select"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 11-A">Grade 11-A</option>
                  <option value="Grade 11-B">Grade 11-B</option>
                  <option value="Grade 12-A">Grade 12-A</option>
                  <option value="Grade 12-B">Grade 12-B</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aarav Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.name}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. student@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Badge Color</label>
              <div className="color-picker-row">
                {AVATAR_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={`color-dot ${formData.avatarColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, avatarColor: color })}
                  >
                    {formData.avatarColor === color && <Check size={14} color="#fff" style={{ margin: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {studentToEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
