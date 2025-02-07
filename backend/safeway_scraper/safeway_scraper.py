import requests
from bs4 import BeautifulSoup
import undetected_chromedriver as uc  # new import
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import re
import json  # new import

def clean_option_text(text):
    return text.title()

def scrape_egg_prices():
    import time
    url = "https://www.safeway.com/shop/aisles/dairy-eggs-cheese/eggs.html?sort=&page=1&loc=3132"

    # Remove standard Options and webdriver.Chrome
    # Set up undetected Chrome WebDriver instead:
    driver = uc.Chrome(version_main=132)  # using undetected-chromedriver with version specification
    
    # Load specific Safeway cookies to bypass automation detection
    # import os
    # cookies_path = "backend/safeway_scraper/safeway_cookies.json"  # specific cookie address for Safeway
    # if os.path.exists(cookies_path):
    #     # Navigate to base domain to set cookies
    #     base_url = url.split("/")[0] + "//" + url.split("/")[2]
    #     driver.get(base_url)
    #     with open(cookies_path, "r") as f:
    #         data = f.read().strip()
    #         if data:  # only load if file is not empty
    #             saved_cookies = json.loads(data)
    #             for cookie in saved_cookies:
    #                 driver.add_cookie(cookie)
    
    driver.get(url)
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")

    time.sleep(10)  # Wait for the page to load
    
    # Get page source and parse with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    text = soup.get_text(separator=" ", strip=True)
    
    # Regex to find egg products and their prices
    pattern = r"(\$\d+\.\d{2}) each ([A-Za-z\s]+Eggs\s+.*\s+-\s+12\s+Count)"
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    egg_prices = []
    for price, option in matches:
        clean_option = clean_option_text(option)
        egg_prices.append({"option": clean_option, "price": price})
    
    driver.quit()
    
    # Write the results to a JSON file (overwriting previous content)
    with open("backend/safeway_scraper/dozen_egg_options.json", "w") as f:
        json.dump(egg_prices, f, indent=4)
    
    return egg_prices

# the following is for testing purposes

if __name__ == "__main__":
    prices = scrape_egg_prices()
    for price in prices:
        print(price)
