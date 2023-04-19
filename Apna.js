const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
async function start() {
  const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: false,
  userDataDir: "./tmp"
  });
  const page = await browser.newPage();
  await page.goto('https://apna.co/jobs');
  await page.screenshot({ path: 'apna.png' });
  const dataHandles = await page.$$('.styles__JobDetails-sc-1eqgvmq-1');
  const pagination = await page.$('.JobListPagination__PageNavigationButton-sc-1abytra-3');
  const totalPages = await page.evaluate(pagination => {30
    return pagination.children.length;
  }, pagination);
  for (let i = 2; i <= 10; i++) {
      const k = `https://apna.co/jobs?page=${i}`
      await page.goto(k);
      await page.screenshot({ path: 'apna.png' });
      const dataHandles = await page.$$('.styles__JobDetails-sc-1eqgvmq-1');
      // Extract data from the page
      const data = [];
      for (const datahandle of dataHandles) {
      try {
      const title = await page.evaluate(el => el.innerText, datahandle);
      data.push({ title: title });
      } catch (error) { }
      }
      const csvWriter = createCsvWriter({
      path: 'apna.csv',
      header: [
      { id: 'title', title: 'Title' },
      ]
      });
      await csvWriter.writeRecords(data);
      console.log('CSV file written successfully');
      await browser.close();
    }
}
start();