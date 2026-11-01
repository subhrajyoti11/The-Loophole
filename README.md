# Smart Hostel Mess Information and Feedback System (SmartMess)

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)

A modern, responsive, and comprehensive web platform engineered to solve hostel mess coordination challenges. **SmartMess** empowers students with transparent daily meal schedules, allergen alerts, advance meal-skipping passes to cut food waste, and a structured grievance tracking portal. Concurrently, it equips hostel wardens and mess committees with real-time headcount forecasting, live kitchen prep controls, food waste monitoring, and hygiene audit tracking.

---

## 📌 Problem Statement Addressed

Students residing in campus hostels depend on mess facilities for their daily meals. However:
1. Accessing meal schedules and nutritional/allergen details is often inconvenient.
2. Students cannot easily notify the kitchen of absences or dietary preferences, resulting in massive food waste.
3. Communicating recurring issues regarding food temperature, salt/oil levels, portion shortages, or cutlery hygiene lacks a structured tracking and accountability mechanism.

**SmartMess** resolves these pain points with an end-to-end pair of integrated student & administration portals.

---

## 🚀 Key Modules & Capabilities

### 👨‍🎓 1. Student Experience Portal
- **Dashboard**: Live next meal countdown (Breakfast, Lunch, Snacks, Dinner), real-time kitchen preparation status, personalized resident dietary profile, and pinned mess bulletins.
- **Menu & Nutritional Breakdown**: Day-by-day and weekly nutritional details, estimated macros (protein, carbs, fats), allergen advisories (dairy, gluten, nuts), and chef recommendations.
- **Meal Attendance & Digital Passes**:
  - Toggle meal attendance (I will attend vs Skip meal).
  - Generates a **Digital Dining Token / QR Pass** for fast counter check-in.
  - Recording advance skips directly informs kitchen staff to adjust batch sizes and avoid food wastage.
  - Multi-day absence & leave scheduling (e.g. weekend trips, fest breaks).
- **Dietary Preferences & Profile**: Pure Veg, Non-Veg, Jain Friendly (no root veggies), and Vegan modes; spice tolerance; and diagnosed allergy warnings.
- **Structured Grievance Portal**:
  - Multi-metric star ratings (Taste, Cleanliness, Food Temperature, Portion Size, Staff Courtesy).
  - Common recurring issue tags (`#ColdFood`, `#TooOily`, `#HighSalt`, `#UncleanTrays`, `#Shortage`).
  - Community feedback stream with "Same issue for me" upvoting.
  - **My Grievances Tracker**: View official mess warden responses and corrective action timestamps.
- **Democratic Food Polls**: Vote for upcoming Sunday feast dishes, festival specials, and beverage selections with real-time percentage progress bars.
- **Notifications & Reminders**: Configurable alerts 15 minutes before mess opens and 2 hours before kitchen prep deadlines.

---

### 🛡️ 2. Admin & Mess Warden Command Center
- **Warden Overview Dashboard**: Real-time diner attendance forecasts, dietary split calculations, open grievance counters, and food waste reduction metrics.
- **Menu Management (CRUD)**: Edit weekly recipes, change live preparation states (`Upcoming`, `In Progress`, `Live Serving`, `Completed`), and publish chef notes.
- **Grievance Resolution Desk**: Structured ticket queue with status transitions (`Pending` ➔ `In Progress` ➔ `Resolved`), warden resolution remarks, and CSV export.
- **Headcount Forecasting & Turnstile Simulator**: Predictive batch target sizing for kitchen cooks with an interactive QR pass verification simulator.
- **Food Waste Monitoring**: Daily solid food waste tracker (plate waste vs kitchen prep scraps in kg), cost equivalent losses, 7-day trend charts, and active smart interventions.
- **Hygiene & Safety Checklist**: Comprehensive FSSAI-aligned audit checklists (freezer temps, RO water TDS, cutlery sanitization at 82°C+, cooking oil TPM, pest control certification).
- **Reports & Analytics**: Downloadable and printable executive audit reports with 5-month satisfaction and waste reduction trajectories.

---

## 📂 Project Architecture

```
smart-mess/
│
├── public/
│   ├── images/
│   └── favicon.svg
│
├── src/
│   ├── app/
│   │   ├── App.jsx                   # Root router and global state provider
│   │   ├── routes.jsx                # Student and Admin route configurations
│   │   └── providers.jsx             # Role context and notification toast provider
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── ui/                       # Primitive design system components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── layout/                   # Layout wrappers and navigation
│   │   │   ├── StudentLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── MobileNavigation.jsx
│   │   │
│   │   └── common/                   # Reusable interface controls
│   │       ├── PageHeader.jsx
│   │       ├── SearchBar.jsx
│   │       ├── NotificationBell.jsx
│   │       └── ConfirmDialog.jsx
│   │
│   ├── features/
│   │   ├── dashboard/                # Student dashboard & widgets
│   │   ├── menu/                     # Live menu, filters, and weekly timetable
│   │   ├── availability/             # Meal attendance, skips & digital passes
│   │   ├── preferences/              # Veg/Jain/Vegan, spice & allergy profiles
│   │   ├── feedback/                 # Structured feedback & grievances tracker
│   │   ├── polls/                    # Campus voting & food surveys
│   │   ├── notifications/            # Timers & reminder settings
│   │   ├── admin/                    # Warden operations, menu editor & feedback table
│   │   ├── waste/                    # Solid food waste logging & analytics
│   │   ├── hygiene/                  # Safety inspection audits & checklist
│   │   └── reports/                  # Executive summaries & printable reports
│   │
│   ├── data/                         # Realistic seed mock data
│   │   ├── mockMenu.js
│   │   ├── mockFeedback.js
│   │   ├── mockAnnouncements.js
│   │   ├── mockAvailability.js
│   │   ├── mockPolls.js
│   │   ├── mockWaste.js
│   │   └── mockHygiene.js
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js        # Persistent reactive state hook
│   │
│   ├── services/
│   │   └── storageService.js         # LocalStorage persistence & data layer
│   │
│   ├── utils/
│   │   ├── dateUtils.js              # Meal slot determination & date helpers
│   │   └── validation.js             # Form validation rules
│   │
│   ├── styles/
│   │   ├── variables.css             # CSS design tokens
│   │   └── global.css                # Tailwind directives & theme styles
│   │
│   └── main.jsx                      # Vite entry point
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with responsive mobile drawer & bottom navigation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Storage & State**: React Context API + LocalStorage data persistence layer

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔄 Dual Role Switching Demo
You can toggle between **Student View** and **Admin / Warden View** at any time using the role selector pill located in the top navigation bar. Changes made in one portal (e.g. submitting feedback, updating menu, marking a meal skip) immediately reflect across both portals through the unified local storage service.
# Smart-hostel-mess-system
