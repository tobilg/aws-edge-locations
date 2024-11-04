import puppeteer from 'puppeteer';

export const downloadAsHTML = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set headers to receive English content
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en'
  });

  // Open page
  await page.goto('https://aws.amazon.com/cloudfront/features/');

  // Wait for network idle
  await page.waitForNetworkIdle();

  // Wait for detail pins
  const searchResultSelector = "div[class='m-gi-area-detail-pin']";
  await page.waitForSelector(searchResultSelector);

  
  const groups = await page.$$("div[class='m-gi-area-detail-pins-group']");
  
  // Get locations data
  const data = await Promise.all(
    groups.map(async el => {
      // Get type
      const typeElement = await el.$('h3');
      const type = await typeElement?.evaluate(node => node.textContent);

      // Get locations
      const locations = await el.$$('div[class="m-gi-area-detail-pin"]');
      const locationData = await Promise.all(
        locations.map(async el => {
          // Get city
          const cityElement = await el.$('h4 > strong');
          const city = await cityElement?.evaluate(node => node.textContent);

          // Get country
          const countryElement = await el.$('h4 > em');
          const country = await countryElement?.evaluate(node => node.textContent);

          return {
            city,
            country
          };
        })
      );

      return {
        type,
        locations: locationData
      }
    })
  );
  
  // Close browser
  await browser.close();

  return data;
}
