import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  console.log('Browser opened. Opening page...');

  // Navigate the page to a URL
  await page.goto(
    'https://es.wikipedia.org/wiki/Anexo:Municipios_de_Venezuela'
  );
  console.log('Page loaded. Getting data...');
  const title = await page.$('.mw-page-title-main');
  const titleText = await title.evaluate((el) => el.textContent);
  console.log(titleText);

  // get all elements with class ".mw-headline a"
  const elements = await page.$$('.mw-headline > a');
  // loop through all elements
  let i = 0;
  let result = [];
  for (let element of elements) {
    // get the textContent of each element
    console.log(i + 8);
    const text = await page.evaluate((el) => el.textContent, element);
    // get municipality name by ol > li

    const municipality = await page.$$(
      `#mw-content-text > div.mw-parser-output > ol:nth-child(${
        8 + i
      }) > li > a:nth-child(1)`
    );
    let municipalities = [];
    for (let m of municipality) {
      const municipalityName = await page.evaluate((el) => el.textContent, m);
      municipalities.push(municipalityName);
    }

    if (8 + i === 32) {
      i = 34 - 8;
    } else if (8 + i === 43) {
      i = 45 - 8;
    } else {
      i += 3;
    }

    result.push({ state: text, municipalities });
  }

  await browser.close();
  console.log(result);
})();
