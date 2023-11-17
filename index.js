import puppeteer from 'puppeteer';

const scrapeData = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(
    'https://es.wikipedia.org/wiki/Anexo:Municipios_de_Venezuela'
  );

  const data = await page.evaluate(() => {
    const states = [];

    // Seleccionar los elementos que contienen la información de los estados
    const stateElements = document.querySelectorAll('.mw-parser-output h2');

    // Iterar sobre los elementos de estado
    stateElements.forEach((stateElement) => {
      const state = {};

      // Obtener el nombre del estado
      state.name = stateElement.textContent.trim().split('[')[0];

      // Obtener la URL de la bandera del estado
      const flagElement = stateElement.querySelector('.mw-file-element');
      state.flagUrl = flagElement ? flagElement.src : null;

      // Obtener los municipios del estado
      state.municipalities = [];
      const municipalityList =
        stateElement.nextElementSibling.nextElementSibling;
      if (municipalityList) {
        const municipalityElements =
          municipalityList.querySelectorAll('li a:nth-child(2)');
        municipalityElements.forEach((municipalityElement) => {
          state.municipalities.push(municipalityElement.textContent.trim());
        });
      }
      // Agregar el estado al arreglo
      states.push(state);
    });

    // delete last 2 elements
    states.pop();
    states.pop();
    return states;
  });

  await browser.close();

  return data;
};

// Llamar a la función de web scraping y mostrar los resultados
scrapeData().then((result) => {
  console.log(result);
});
