# Selenium Integration tests

## Setup
* Install [Python 3](https://www.python.org/downloads/)
* Install/Update [PIP](https://pip.pypa.io/en/stable/installing/)
* Install the selenium python bindings: `pip install -U selenium`
* Install Java
* Ensure `java` and `python3` are on your PATH

## Running the tests
* Start the selenium server `./bin/server.(sh|ps1)`
* Run all the tests by running `./tests/integration/run.(sh|ps1)`
* Individual tests can be run by module: `cd tests && python3 -m unittest integration.test_leads -v`
  * For more information on running tests, see the [unittest](https://docs.python.org/3/library/unittest.html#command-line-interface) documentation


## Resources
* [Selenium Python API](https://seleniumhq.github.io/selenium/docs/api/py/index.html)
* [DesiredCapabilities](https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities) - These are passed into the webdriver via a Dictionary


## TODOS
* Pass the selenium server and mobile URL in as arguments
* Create a Powershell script for running the tests
