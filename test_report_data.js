import { getReportCardData } from './src/apps/reports/reports.service.js';

async function test() {
    try {
        const data = await getReportCardData({ admission_no: 'ADM0001', term: 'Term 1' });
        console.log('Report Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
