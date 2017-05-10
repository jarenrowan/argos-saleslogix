"""
Login tests
"""
import unittest
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.remote.webdriver import WebDriver
from .pages.leads import ListPage, DetailPage, EditPage
from .pages.common import ApplicationMenu, wait_for_page
from .util import login


class LoginTestCase(unittest.TestCase):
    def setUp(self):
        self.driver = WebDriver(command_executor='http://localhost:4444/wd/hub',
                                desired_capabilities={'browserName': 'chrome', 'webdriver.remote.quietExceptions': True})
        self.driver.implicitly_wait(10)
        login(self.driver, 'loup')
        self.addCleanup(self.driver.quit)

    def test_add_email_if_needed(self):
        menu = ApplicationMenu(self.driver)
        menu.open_menu_lead_list()
        lead_list = ListPage(self.driver)
        lead_list.lookup('Beck, John')
        lead_list.click_first_lookup_item()
