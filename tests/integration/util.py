from .pages.login import LoginPage

NETWORK_TIMEOUT = 30

def login(driver, username, password=''):
    login_page = LoginPage(driver)
    login_page.navigate()
    login_page.set_username(username)
    login_page.set_password(password)
    login_page.login()
