"""
LoginPage
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from .common import CommonPage

class LoginPage(object):
    """
    class LoginPage.
    """
    def __init__(self, driver):
        self.common = CommonPage(driver)
        self.driver = driver
        self.login_button = None
        self.login_text = None
        self.password_text = None

    def navigate(self):
        self.common.navigate()
        self.init_elements()
        self.wait_for_ping()

    def init_elements(self):
        self.login_text = self.driver.find_element_by_id('username-display')
        self.password_text = self.driver.find_element(
            by=By.ID, value='password-display')
        self.login_button = self.driver.find_element(
            by=By.CSS_SELECTOR, value='#login .btn-primary')

    def wait_for_ping(self):
        WebDriverWait(self.driver, 10).until(lambda d: self.login_text.is_enabled())

    def set_username(self, user_name):
        self.login_text.send_keys(user_name)

    def set_password(self, password):
        self.password_text.send_keys(password)

    def login(self):
        self.login_button.click()

        # Wait for login to go away
        WebDriverWait(self.driver, 10).until(lambda d: d.find_element(
            by=By.XPATH, value="//div[@id='login' and not(@selected)]"))

        # Wait for next view to load
        WebDriverWait(self.driver, 10).until(lambda d: d.find_element(
            by=By.XPATH, value="//div[@selected='selected' and not(contains(@class, 'loading'))]"))
