import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException

class  XSSSearch(unittest.TestCase):

    def setUp(self):
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        self.driver = webdriver.Chrome(chrome_options=chrome_options)
        self.address = "https://danibudi.github.io/Cross-Site%20Scripting%20(safe%20XSS).html"
        #self.address = "https://danibudi.github.io/Cross-Site%20Scripting%20(XSS).html"
        #self.driver = webdriver.Firefox()

    def load_site(self):
        driver = self.driver
        driver.get(self.address)

    def alert_exists(self):
        try:
            alert = self.driver.switch_to_alert()
            alert.accept()
        except:
            return False
        return True
            

    def link1(self):
        link1 = "Click here to see solution of problem in Django"
        print "Searching for link with text \""+link1+"\""
        try:
            site_link1 = self.driver.find_element_by_link_text(link1)
            print "Link found, clicking on it to check if it goes to djangoproject.com"
            site_link1.click()
            self.assertEquals(self.driver.current_url,"https://docs.djangoproject.com/en/2.0/topics/security/")
        except NoSuchElementException:
            self.fail("Link is not present in the page!")

    def link2(self):
        link2 = "Click here to see solution of problem - html file"
        print "Searching for link with text \""+link2+"\""
        try:
            site_link2 = self.driver.find_element_by_link_text(link2)
            print "Link found, clicking on it to check if there is no alert on the referenced file"
            site_link2.click()
            if self.alert_exists():
                self.fail("Alert exists on the site")
        except NoSuchElementException:
            self.fail("Link is not present in the page!")
            

    def test_link1(self):
        print "Loading "+self.address+" with selenium..."
        self.load_site()

        print "Checking for alert..."
        if not self.alert_exists():
            self.fail("No alert on loading the site")
        print "Alert on loading the site exists, accepted."

        print "Checking first link..."
        self.link1()
        print "Link1 success!"

    def test_link2(self):
        print "Loading "+self.address+" with selenium..."
        self.load_site()

        print "Checking for alert..."
        if not self.alert_exists():
            self.fail("No alert on loading the site")
        print "Alert on loading the site exists, accepted."

        print "Checking second link..."
        self.link2()
        print "Link2 success!"

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()

