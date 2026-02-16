import axios from 'axios';

async function test() {
    try {
        const res = await axios.get('http://localhost:4000/api/filters/classes');
        console.log('Classes:', res.data);

        if (res.data.data && res.data.data.length > 0) {
            const classNum = res.data.data[0];
            const resBatches = await axios.get('http://localhost:4000/api/filters/batches', {
                params: { class_number: classNum }
            });
            console.log('Batches for class', classNum, ':', resBatches.data);

            if (resBatches.data.data && resBatches.data.data.length > 0) {
                const batch = resBatches.data.data[0];
                const resStudents = await axios.get('http://localhost:4000/api/students/students', {
                    params: { class_number: classNum, batch }
                });
                console.log('Students:', resStudents.data);
            }
        }
    } catch (err) {
        console.error('Error:', err.response?.data || err.message);
    }
}

test();
