"""
Login tests
"""
import unittest
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.remote.webdriver import WebDriver
from .pages.login import LoginPage

class LoginTestCase(unittest.TestCase):
    def setUp(self):
        self.driver = WebDriver(command_executor='http://localhost:4444/wd/hub',
                                desired_capabilities={'browserName': 'chrome'})
        self.driver.implicitly_wait(10)
        self.addCleanup(self.driver.quit)

    def test_login(self):
        login_page = LoginPage(self.driver)
        login_page.navigate()
        self.assertIn('Infor CRM', self.driver.title)
        login_page.set_username('loup')
        login_page.login()

    def test_invalid_login(self):
        login_page = LoginPage(self.driver)
        login_page.navigate()
        login_page.set_username('doesnotexist')
        login_page.set_password('asdf')
        with self.assertRaises(WebDriverException):
            login_page.login()
