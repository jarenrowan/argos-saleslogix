const Base = require('./Base');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

class Login extends Base {
  constructor(driver) {
    super(driver);
    this.userName = By.id('username-display');
  }
}

module.exports.Login = Login;
