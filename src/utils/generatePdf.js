import puppeteer from "puppeteer";

export async function generatePDF(html) {
  console.log("🛠️  Launching Puppeteer for PDF...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    console.log("📄 PDF Page created, setting content...");

    await page.setContent(html, {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    console.log("🖨️  Generating PDF buffer...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();
    console.log("✅ PDF generated successfully.");
    return pdfBuffer;
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    await browser.close();
    throw error;
  }
}
