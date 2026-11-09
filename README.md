# 🎓 EduTrack - Modern Student Attendance Tracker

A clean, responsive, and intuitive web application designed for educators, teachers, and administrators to track student attendance, manage student profiles, monitor turnout rates, and generate comprehensive attendance reports.

Built with **React**, **JavaScript**, **HTML5**, and modern **CSS3**.

---

## ✨ Key Features

### 1. 📊 Modern Interactive Dashboard
- **Real-Time Key Metrics**:
  - **Total Students**: Total enrolled students in the directory.
  - **Present Students**: Number of students marked present for today.
  - **Absent Students**: Number of students marked absent for today.
  - **Attendance Percentage**: Calculated turnout percentage with dynamic performance badges (*Excellent*, *Normal*, or *Low*).
- **7-Day Attendance Trend**: CSS-animated bar chart displaying turnout percentage over the last 7 days.
- **Section & Batch Overview**: Quick at-a-glance status of recorded sessions and grade sections.

### 2. 👥 Student Directory Management
- **Add New Students**: Easily enroll new students with full details:
  - Roll Number, Name, Grade/Section, Gender, Email, Phone number, and customizable Avatar badge colors.
- **Live Search**: Instant real-time search across student names, roll numbers, emails, and grades.
- **Grade Filter**: Filter students by specific sections (e.g. *Grade 10-A*, *Grade 10-B*, *Grade 11-A*, etc.).
- **Edit Profiles**: Update student records on the fly with a dedicated modal form.
- **Delete Records**: Safe removal with a delete confirmation modal that also cleans up associated attendance logs.

### 3. 📅 Daily Attendance Sheet
- **Flexible Date Picker**: Select any date with intuitive **Previous Day / Next Day** navigation and a quick **"Today"** shortcut.
- **One-Click Marking**:
  - Click **Present** or **Absent** to toggle each student's status with immediate visual feedback.
  - **Bulk Actions**: One-click **"Mark All Present"** or **"Mark All Absent"** for the current section.
- **Live Day Counters**: Instant counters for Present, Absent, and Unmarked students for the selected date.

### 4. 📈 Comprehensive Analytics & Reports
- **Individual Student Turnout**:
  - Total days logged, total present days, total absent days, and exact percentage.
  - Color-coded progress bars:
    - 🟢 **85%+**: Excellent Turnout
    - 🔵 **75% - 84%**: Good Turnout
    - 🟠 **60% - 74%**: Needs Attention
    - 🔴 **< 60%**: Defaulter Alert
- **Student Attendance History Modal**: Click **"View Log"** on any student to view their complete date-by-date attendance timeline.
- **CSV Data Export**: Export student attendance records to a downloadable CSV spreadsheet with one click.

### 5. 💾 Offline-First LocalStorage Persistence
- All student data and attendance records are stored and synchronized directly in browser `localStorage`.
- Changes persist across page reloads and browser sessions.
- Includes a **"Reset Demo Records"** button in the sidebar to easily restore sample demonstration data at any time.

### 6. 📱 Responsive & Mobile-Friendly
- Full responsive design adapting to desktops, tablets, and smartphones.
- Mobile drawer sidebar with smooth backdrop and hamburger toggle.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)

### Installation & Running Locally

1. **Clone or navigate to the project directory:**
   ```bash
   cd e:\Telegram\devops
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (or the URL shown in terminal).

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── index.html                   # HTML entry point with Inter & Plus Jakarta Sans typography
├── package.json                 # Project dependencies & scripts (React, Vite, Lucide-react)
├── vite.config.js               # Vite configuration (port 3000)
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Main application shell & view routing
│   ├── index.css                # Custom CSS design system, variables & animations
│   ├── data/
│   │   └── initialData.js       # Preloaded sample student profiles & historical attendance
│   ├── context/
│   │   └── AttendanceContext.jsx # State management, localStorage sync, statistics & CSV export
│   └── components/
│       ├── Sidebar.jsx          # Collapsible navigation sidebar (Dashboard, Students, Attendance, Reports)
│       ├── Navbar.jsx           # Top navigation bar with active title, date & mobile toggle
│       ├── Dashboard/
│       │   └── Dashboard.jsx    # Overview metrics, 7-day trend chart & quick actions
│       ├── Students/
│       │   ├── StudentsList.jsx # Student directory table, search, filter & delete modal
│       │   └── StudentModal.jsx # Add & Edit student modal dialog
│       ├── Attendance/
│       │   └── AttendanceMarker.jsx # Date selector, bulk actions & Present/Absent toggles
│       ├── Reports/
│       │   └── Reports.jsx      # Individual percentages, progress bars, history drawer & CSV export
│       └── common/
│           └── Notification.jsx # Toast notification alert system
```

---

## 💡 Preloaded Demo Data
For demonstration purposes, the application comes seeded with:
- **10 Sample Students** across Grades 10-A, 10-B, 11-A, 11-B, and 12-A with realistic names, roll numbers, and contacts.
- **7 Days of Attendance History** up to today with realistic attendance variance to immediately display meaningful graphs and statistics.
