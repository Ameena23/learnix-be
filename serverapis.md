# Server API Endpoints

## Base URL: `http://localhost:4000`

## Root
- `GET /` - Server status

## Authentication (`/api/auth`)
- `POST /api/auth/login` - User login

## Attendance (`/api/attendance`)
- `GET /api/attendance/by-date` - Get attendance by date
- `POST /api/attendance/save` - Save attendance records
- `PUT /api/attendance/update/:sessionId` - Update attendance session
- `DELETE /api/attendance/delete/:sessionId` - Delete attendance session

## Students (`/api/students`)
- `GET /api/students/filters` - Load student filters
- `GET /api/students/divisions` - Get divisions
- `GET /api/students/students` - Get students list
- `GET /api/students/years` - Get years
- `GET /api/students/reports` - Get student reports
- `GET /api/students/leaderboard` - Get student leaderboard
- `POST /api/students/exams/marks` - Save exam marks
- `PUT /api/students/exams/marks` - Update exam marks
- `GET /api/students/exams/entries` - Get exam mark entries
- `GET /api/students/exams/marks/:entryId` - Get marks by entry
- `GET /api/students/exams/entries/:entryId` - Get exam entry details
- `POST /api/students/` - Add new student

## Basic Students (`/api/basic-students`)
- `GET /api/basic-students/` - Get basic student list

## Users (`/api/users`)
- `POST /api/users/create` - Create user details

## Charts (`/api/charts`)
- `GET /api/charts/performance-distribution` - Performance distribution data
- `GET /api/charts/subject-pass-fail` - Subject pass/fail statistics
- `GET /api/charts/subject-average` - Subject average scores
- `GET /api/charts/term-comparison` - Term comparison data
- `GET /api/charts/report-subject-avg` - Report subject averages
- `GET /api/charts/report-term-avg` - Report term averages

## Filters (`/api/filters`)
- `GET /api/filters/batches` - Get batches
- `GET /api/filters/classes` - Get classes

## Tables (`/api/table`)
- `GET /api/table/top-students-overall` - Top students overall
- `GET /api/table/top-students-subject` - Top students by subject
- `GET /api/table/leaderboard` - Leaderboard table

## Import (`/api/import-csv`)
- `POST /api/import-csv/` - Import CSV data

## Common (`/api/common`)
- `POST /api/common/get/basic/json` - Get basic data in JSON format

## Reports (`/api/reports`)
- `GET /api/reports/classes` - Get classes for reports
- `GET /api/reports/classes/:classNumber/batches` - Get batches for specific class
- `GET /api/reports/students-by-class-batch` - Get students by class and batch
- `GET /api/reports/report-card/pdf` - Generate report card PDF
- `GET /api/reports/report-card/data` - Get report card data (JSON)
- `POST /api/reports/term-remark` - Save term remark

---

**Total Endpoints: 44**
