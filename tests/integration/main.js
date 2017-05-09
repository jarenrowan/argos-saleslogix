const webdriver = require('selenium-webdriver');
require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
const By = webdriver.By;
const until = webdriver.until;

async function main() {
  const driver = new webdriver.Builder()
    .forBrowser('chrome') // SELENIUM_BROWSER=firefox will override this
    .setChromeOptions(/* ... */)
    .setFirefoxOptions(/* ... */)
    .usingServer('http://localhost:4444/wd/hub')
    .build();

  driver.get('http://www.google.com/ncr');
  driver.findElement(By.name('q')).sendKeys('webdriver');
  driver.findElement(By.name('btnG')).click();
  await driver.wait(until.titleIs('webdriver - Google Search'), 60000);
  driver.quit();
}

main();
