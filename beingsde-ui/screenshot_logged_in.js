const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Go to page
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  
  // Set fake local storage if possible, or just login via UI
  // Wait, let's just login via UI
  await page.type('input[type="email"]', 'bob@beingsde.com');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.goto('http://localhost:3000/interviews', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'local_interviews_loggedin.png', fullPage: true });
  await browser.close();
})();
