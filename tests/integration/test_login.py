"""
Login tests
"""
import unittest
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from pages.login import LoginPage


class LoginTestCase(unittest.TestCase):
    def setUp(self):
        self.driver = WebDriver(command_executor='http://localhost:4444/wd/hub',
                                desired_capabilities={'browserName': 'chrome'})
        self.driver.implicitly_wait(20)
        self.addCleanup(self.driver.quit)

    def test_login(self):
        login_page = LoginPage(self.driver)
        login_page.navigate()
        self.assertIn('Infor CRM', self.driver.title)
        login_page.set_user_name('loup')
        login_page.login()

if __name__ == '__main__':
    unittest.main(verbosity=2)
