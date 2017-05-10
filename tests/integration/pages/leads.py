"""
Lead list, detail, and edit pages
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from .common import CommonPage, wait_for_page, wait_for_animation
import time


class ListPage(object):
    """
    Lead list page.
    """

    def __init__(self, driver):
        self.common = CommonPage(driver)
        self.driver = driver
        self.lookup_input = self.driver.find_element_by_xpath(
            "//*[@selected='selected']//input[@name='query']")
        self.lookup_results_xpath = "//div[@selected='selected']//div[@data-action='activateEntry']"

    def lookup(self, text=''):
        self.lookup_input.click()
        wait_for_animation()
        self.lookup_input.clear()
        self.lookup_input.send_keys(text)
        self.lookup_input.send_keys(Keys.ENTER)
        wait_for_page(self.driver, "lead_list")

    def click_first_lookup_item(self):
        results = self.driver.find_elements_by_xpath(self.lookup_results_xpath)
        search_count = len(results)
        if search_count > 0:
            results[0].click()
            wait_for_page(self.driver, "lead_detail")



class DetailPage(object):
    """
    Lead detail page.
    """

    def __init__(self, driver):
        self.common = CommonPage(driver)
        self.driver = driver

    def navigate(self):
        self.common.navigate()
        self.init_elements()

    def init_elements(self):
        pass


class EditPage(object):
    """
    Lead edit page.
    """

    def __init__(self, driver):
        self.common = CommonPage(driver)
        self.driver = driver

    def navigate(self):
        self.common.navigate()
        self.init_elements()

    def init_elements(self):
        pass
