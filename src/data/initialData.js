// Generate dynamic date strings relative to today (YYYY-MM-DD)
export const getFormattedDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_STUDENTS = [
  {
    id: "stu-001",
    rollNo: "101",
    name: "Aarav Sharma",
    grade: "Grade 10-A",
    gender: "Male",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    avatarColor: "#4F46E5"
  },
  {
    id: "stu-002",
    rollNo: "102",
    name: "Diya Patel",
    grade: "Grade 10-A",
    gender: "Female",
    email: "diya.patel@example.com",
    phone: "+91 98765 43211",
    avatarColor: "#EC4899"
  },
  {
    id: "stu-003",
    rollNo: "103",
    name: "Rohan Verma",
    grade: "Grade 10-A",
    gender: "Male",
    email: "rohan.verma@example.com",
    phone: "+91 98765 43212",
    avatarColor: "#06B6D4"
  },
  {
    id: "stu-004",
    rollNo: "104",
    name: "Ananya Iyer",
    grade: "Grade 10-B",
    gender: "Female",
    email: "ananya.iyer@example.com",
    phone: "+91 98765 43213",
    avatarColor: "#8B5CF6"
  },
  {
    id: "stu-005",
    rollNo: "105",
    name: "Kabir Mehta",
    grade: "Grade 10-B",
    gender: "Male",
    email: "kabir.mehta@example.com",
    phone: "+91 98765 43214",
    avatarColor: "#10B981"
  },
  {
    id: "stu-006",
    rollNo: "106",
    name: "Meera Nair",
    grade: "Grade 11-A",
    gender: "Female",
    email: "meera.nair@example.com",
    phone: "+91 98765 43215",
    avatarColor: "#F59E0B"
  },
  {
    id: "stu-007",
    rollNo: "107",
    name: "Vihaan Gupta",
    grade: "Grade 11-A",
    gender: "Male",
    email: "vihaan.gupta@example.com",
    phone: "+91 98765 43216",
    avatarColor: "#3B82F6"
  },
  {
    id: "stu-008",
    rollNo: "108",
    name: "Zara Khan",
    grade: "Grade 11-B",
    gender: "Female",
    email: "zara.khan@example.com",
    phone: "+91 98765 43217",
    avatarColor: "#EF4444"
  },
  {
    id: "stu-009",
    rollNo: "109",
    name: "Arjun Reddy",
    grade: "Grade 12-A",
    gender: "Male",
    email: "arjun.reddy@example.com",
    phone: "+91 98765 43218",
    avatarColor: "#6366F1"
  },
  {
    id: "stu-010",
    rollNo: "110",
    name: "Pooja Hegde",
    grade: "Grade 12-A",
    gender: "Female",
    email: "pooja.hegde@example.com",
    phone: "+91 98765 43219",
    avatarColor: "#14B8A6"
  }
];

// Seed initial attendance records for the last 6 days up to today
export const getInitialAttendance = () => {
  const records = {};
  
  // Day offsets from -5 to 0 (today)
  const days = [-5, -4, -3, -2, -1, 0];
  
  // Attendance profiles for variance in reporting
  // 1 = Present, 0 = Absent
  const presenceMatrix = {
    "stu-001": [1, 1, 1, 1, 1, 1], // 100%
    "stu-002": [1, 1, 0, 1, 1, 1], // 83.3%
    "stu-003": [0, 1, 1, 0, 1, 1], // 66.7%
    "stu-004": [1, 1, 1, 1, 1, 1], // 100%
    "stu-005": [1, 0, 1, 1, 1, 0], // 66.7%
    "stu-006": [1, 1, 1, 1, 0, 1], // 83.3%
    "stu-007": [1, 1, 1, 1, 1, 1], // 100%
    "stu-008": [0, 0, 1, 1, 1, 1], // 66.7%
    "stu-009": [1, 1, 1, 1, 1, 1], // 100%
    "stu-010": [1, 1, 1, 0, 1, 1]  // 83.3%
  };

  days.forEach((dayOffset, index) => {
    const dateStr = getFormattedDate(dayOffset);
    records[dateStr] = {};

    INITIAL_STUDENTS.forEach((student) => {
      const isPresent = presenceMatrix[student.id]?.[index] === 1;
      records[dateStr][student.id] = isPresent ? 'Present' : 'Absent';
    });
  });

  return records;
};
