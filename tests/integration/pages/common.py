#pylint: disable=line-too-long
"""
Common view elements (nav, toolbar, etc)
"""
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException


def wait_for_animation():
    """
    Soho uses 350ms for animations. Wait until after the animation to continue.
    """
    time.sleep(0.4)

def wait_for_page(driver, page_id, timeout=10):
    """
    Wait for the page to be selected (visible) and not have a css loading class.
    """
    WebDriverWait(driver, timeout).until(lambda d: d.find_element_by_xpath("//div[@id='" + page_id + "' and @selected='selected' and not(contains(@class, 'loading'))]"))

class CommonPage(object):
    """
    Common page operations.
    """
    url = "https://localhost:8000/products/argos-saleslogix/index-dev.html"

    def __init__(self, driver):
        self.driver = driver

    def navigate(self):
        self.driver.get(self.url)


class ApplicationMenu(object):
    """
    Helper page object for the application menu (right drawer).
    """
    def __init__(self, driver):
        self.driver = driver
        self.driver.implicitly_wait(1)

        # Application menu trigger button
        self.nav_trigger = self.driver.find_element(
            by=By.CSS_SELECTOR, value=".toolbar > .title > .application-menu-trigger")

        # Header Items
        self.quick_actions_header = self.driver.find_element(
            by=By.XPATH, value="//div[@id='left_drawer']/div[@data-dojo-attach-point='contentNode']/div[contains(@class, 'accordion-header')][1]")
        self.goto_header = self.driver.find_element(
            by=By.XPATH, value="//div[@id='left_drawer']/div[@data-dojo-attach-point='contentNode']/div[contains(@class, 'accordion-header')][2]")
        self.other_header = self.driver.find_element(
            by=By.XPATH, value="//div[@id='left_drawer']/div[@data-dojo-attach-point='contentNode']/div[contains(@class, 'accordion-header')][3]")
        # Menu Items
        self.menu_add_account_contact = self.driver.find_element_by_xpath("//div[@id='left_drawer']//a[@data-action='addAccountContact']")
        self.menu_account_list = self.driver.find_element_by_xpath("//div[@id='left_drawer']//a[@data-view='account_list']")
        self.menu_lead_list = self.driver.find_element_by_xpath("//div[@id='left_drawer']//a[@data-view='lead_list']")

    def _is_nav_open(self):
        try:
            self.driver.find_element_by_xpath(
                "//nav[@id='application-menu' and contains(@class, 'is-open')]")
            return True
        except NoSuchElementException:
            return False

    def open_menu_add_account_contact(self):
        """
        Clicks the add account/contact item in the application menu. Will open the menu and header section if necessary.
        """
        self.open_nav()
        self.open_quick_actions_header()
        self.menu_add_account_contact.click()
        wait_for_page(self.driver, "add_account_contact")

    def open_menu_account_list(self):
        """
        Clicks the accounts item in the application menu. Will open the menu and header section if necessary.
        """
        self.open_nav()
        self.open_goto_header()
        self.menu_account_list.click()
        wait_for_page(self.driver, "account_list")

    def open_menu_lead_list(self):
        """
        Clicks the leads item in the application menu. Will open the menu and header section if necessary.
        """
        self.open_nav()
        self.open_goto_header()
        self.menu_lead_list.click()
        wait_for_page(self.driver, "lead_list")

    def open_nav(self):
        """
        Opens the navigation if not already open.
        """
        if not self._is_nav_open():
            self.nav_trigger.click()
            wait_for_animation()

    def open_quick_actions_header(self):
        """
        Expands the quick actions header section.
        """
        self._open_nav_section(self.quick_actions_header)

    def open_goto_header(self):
        """
        Expands the goto header section.
        """
        self._open_nav_section(self.goto_header)

    def open_other_header(self):
        """
        Expands the other header section.
        """
        self._open_nav_section(self.other_header)

    def _open_nav_section(self, header):
        element = header.find_element_by_xpath("a[@aria-expanded]")
        expanded = element.get_attribute("aria-expanded")
        if expanded == "false":
            header.click()
            wait_for_animation()


class Toolbar(object):
    pass
