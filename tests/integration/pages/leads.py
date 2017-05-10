"""
Lead list, detail, and edit pages
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from .common import CommonPage

class ListPage(object):
    """
    Lead list page.
    """
    def __init__(self, driver):
        self.common = CommonPage(driver)
        self.driver = driver

    def navigate(self):
        self.common.navigate()
        self.init_elements()

    def init_elements(self):
        pass

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