const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // We don't have login credentials in the script, so maybe I can just inject the component into the page? No.
  
  await browser.close();
})();
