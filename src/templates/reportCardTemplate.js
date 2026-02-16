export const reportCardHTML = ({ student, data, termRemark, chartImage }) => {
  const { student_name, admission_no, class_number, batch, term, year } = student;

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#16a34a';
    if (grade.startsWith('B')) return '#2563eb';
    if (grade.startsWith('C')) return '#ca8a04';
    return '#dc2626';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Card - ${student_name}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 40px;
            background-color: white;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #7b00b4;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .school-name {
            font-size: 32px;
            font-weight: 800;
            color: #111827;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .report-title {
            font-size: 18px;
            color: #6b7280;
            margin-top: 5px;
            font-weight: 500;
        }
        .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            background: #f9fafb;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 1px solid #e5e7eb;
        }
        .info-item {
            font-size: 14px;
        }
        .info-label {
            font-weight: 700;
            color: #4b5563;
            width: 140px;
            display: inline-block;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
        }
        th {
            background-color: #7b00b4;
            color: white;
            text-align: left;
            padding: 12px 15px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }
        .subject-column {
            font-weight: 600;
            color: #111827;
        }
        .grade-badge {
            font-weight: 800;
            padding: 4px 8px;
            border-radius: 4px;
        }
        .remark-section {
            margin-top: 30px;
            padding: 20px;
            border: 2px dashed #d1d5db;
            border-radius: 12px;
        }
        .remark-title {
            font-size: 16px;
            font-weight: 700;
            color: #7b00b4;
            margin-bottom: 10px;
        }
        .remark-content {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
            font-style: italic;
        }
        .chart-container {
            margin-top: 40px;
            text-align: center;
        }
        .chart-image {
            max-width: 100%;
            height: auto;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            border-top: 1px solid #9ca3af;
            margin-bottom: 5px;
        }
        .signature-text {
            font-size: 12px;
            color: #6b7280;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="school-name">Green Valley Public School</h1>
        <div class="report-title">Academic Achievement Record - ${year}</div>
    </div>

    <div class="student-info">
        <div class="info-item">
            <span class="info-label">Student Name:</span>
            <span>${student_name}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Admission No:</span>
            <span>${admission_no}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Class & Division:</span>
            <span>${class_number} - ${batch}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Term:</span>
            <span>${term}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Subject</th>
                <th style="text-align: center;">Max Marks</th>
                <th style="text-align: center;">Scored</th>
                <th style="text-align: center;">Percentage</th>
                <th style="text-align: center;">Grade</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(r => `
                <tr>
                    <td class="subject-column">${r.subject}</td>
                    <td style="text-align: center;">${r.max_mark}</td>
                    <td style="text-align: center;">${r.scored_mark}</td>
                    <td style="text-align: center;">${r.percentage}%</td>
                    <td style="text-align: center;">
                        <span class="grade-badge" style="color: ${getGradeColor(r.grade)}">${r.grade}</span>
                    </td>
                    <td>${r.remark}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="remark-section">
        <div class="remark-title">Teacher's Observations</div>
        <div class="remark-content">
            ${termRemark || 'The student shows consistent effort. Keep up the good work.'}
        </div>
    </div>

    ${chartImage ? `
    <div class="chart-container">
        <div class="remark-title" style="margin-bottom: 20px;">Performance Analytics</div>
        <img src="${chartImage}" class="chart-image" alt="Performance Chart">
    </div>
    ` : ''}

    <div class="footer">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-text">Class Teacher</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-text">Principal</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-text">Parent's Signature</div>
        </div>
    </div>
</body>
</html>
  `;
};
