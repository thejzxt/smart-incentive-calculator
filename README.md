# Toyota Smart Incentive Calculator

A production-grade, highly responsive web application built for Toyota Sales Officers to log vehicle sales and dynamically calculate performance-based incentives in real time. It features role-based access control, persistent browser state tracking, audit history logging, and print-ready export templates.

## Tech Stack
- **Core Framework:** React 18 (Vite setup)
- **Styling:** Tailwind CSS (Vanilla PostCSS setup)
- **Navigation:** React Router v6
- **Persistence:** Local Storage with safe try/catch boundaries

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation & Run
1. Install all required dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (or the URL shown in your terminal) in your browser.

---

## Authentication Credentials

Use these credentials on the login screen to access the respective dashboards:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin Portal** | `admin` | `admin123` |
| **Sales Officer Portal** | `officer` | `officer123` |

---

## Folder Structure

Below is the structured layout of the frontend components:

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.jsx  # Main admin view (KPI cards, change history log)
│   │   ├── CarModelTable.jsx   # Inventory list (CRUD, edit/add modals)
│   │   └── SlabEngine.jsx      # Dynamic compensation tier editor (overlap checks)
│   ├── officer/
│   │   ├── OfficerDashboard.jsx# Main officer view (selector wrapper, error states)
│   │   ├── SalesEntry.jsx      # Input grid with real-time active slab badges
│   │   └── IncentiveTracker.jsx# Sticky sidebar metrics (AnimatedNumber, trend SVG chart)
│   └── shared/
│       ├── LoginPage.jsx       # Clean form validations and test indicators
│       ├── Modal.jsx           # Accessible modal with scale/opacity animations
│       ├── Navbar.jsx          # Glassmorphism header, theme toggle, logout actions
│       └── Toast.jsx           # Auto-hide feedback alerts (success/warning/error)
├── constants/
│   └── defaultData.js          # Default slabs, models, trends, and history audit seeds
├── context/
│   └── AuthContext.jsx         # React Context for session and role states
├── hooks/
│   └── useLocalStorage.js      # Robust state synchronization with localStorage
├── utils/
│   └── incentiveCalculator.js  # Pure math function for slab mappings
├── App.jsx                     # Route mappings and Protected Route guards
├── index.css                   # Custom global animations and printer styles
└── main.jsx                    # React mounting initialization
```

---

## Production Build
To package the app for production deployment, compile the source files using:
```bash
npm run build
```
This outputs minified files in the `/dist` directory.

---

## Deployment URL
*Live URL Placeholder:* [https://toyota-incentive-calc.vercel.app](https://toyota-incentive-calc.vercel.app)
