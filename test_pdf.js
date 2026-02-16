import puppeteer from 'puppeteer';

async function test() {
    console.log('Launching browser...');
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('Browser launched.');
        const page = await browser.newPage();
        console.log('Page created.');
        await page.setContent('<h1>Hello World</h1>');
        console.log('Content set.');
        const pdf = await page.pdf({ format: 'A4' });
        console.log('PDF generated, size:', pdf.length);
        await browser.close();
        console.log('Browser closed.');
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
