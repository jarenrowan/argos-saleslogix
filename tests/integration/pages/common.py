class CommonPage(object):
    url = "https://localhost:8000/products/argos-saleslogix/index-dev.html"
    def __init__(self, driver):
        self.driver = driver

    def navigate(self):
        self.driver.get(self.url)

    def init_elements(self):
        pass
