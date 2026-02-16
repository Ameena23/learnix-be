# Project Understanding

## Overview
This is a Backend (BE) project built with Node.js and Express, using a modular architecture to manage various school-related features like Attendance, Students, and Reports.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MySQL (via Sequelize ORM)
- **Utilities**:
  - `csv-parser` & `json2csv` for Import/Export
  - `puppeteer` likely for PDF generation (Report cards)
  - `multer` for file uploads
  - `dotenv` for configuration

## Architecture
The project follows a feature-based folder structure under `src/apps`, keeping related controllers, services, and routes together.

### Key Directories
- **`src/apps/`**: Contains the business logic, split by domain:
  - `auth`: Authentication logic
  - `attendance`: Attendance tracking
  - `students`: Student management & filtering
  - `reports`: Report card generation and data aggregation
  - `charts`: Analytics/Visualizations data
  - `users`: User management
  - `imports`: CSV import functionality
- **`src/models/`**: Sequelize definitions for database tables:
  - `Student`, `User`, `AttendanceRecord`, `AttendanceSession`
  - `ExamMarkScore`, `ExamMarkEntry`
  - `TeacherEndorsements`, `StudentRemarks`
- **`src/routes/`**: Centralized route definitions aggregating sub-routes from `apps`.
- **`src/config/`**: Database configuration (`db.js`).

## Key Features & APIs
Based on `serverapis.md` and folder structure:
- **Authentication**: Login/Auth flows.
- **Attendance**: managing sessions and daily records.
- **Student Performance**: tracking exam marks (`ExamMarkEntry`, `ExamMarkScore`).
- **Reporting**: generating PDF report cards (likely using Puppeteer) and statistical summaries.
- **Data Import**: importing student/class data via CSV.

## Entry Point
- **`server.js`**: Initializes the Express app, connects to the database via Sequelize, uses standard middleware (CORS, JSON parser), and mounts routes at `/api`.
