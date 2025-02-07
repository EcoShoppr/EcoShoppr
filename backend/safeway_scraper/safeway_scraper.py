import requests
from bs4 import BeautifulSoup
import undetected_chromedriver as uc  # new import
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import re
import json  # new import

# def save_cookies(driver, cookies_path):
#     import os, json
#     if not os.path.exists(cookies_path):
#         with open(cookies_path, "w") as f:
#             json.dump(driver.get_cookies(), f, indent=4)

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
    # Increase wait time: wait until document.readyState is complete, then add extra sleep
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")

    time.sleep(10)  # Wait for the page to load
    
    # Optionally save cookies if they don't already exist
    # save_cookies(driver, cookies_path)
    
    # Get page source and parse with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    # Find all ul blocks
    ul_blocks = soup.find_all('ul')
    
    egg_prices = []
    
    for ul in ul_blocks:
        # Find all li entities within each ul block
        li_entities = ul.find_all('li')
        for li in li_entities:
            # Check if the li entity contains egg information
            if 'dozen' in li.text.lower():
                # Extract price information
                price = li.find('span', class_='product-price').text.strip()
                egg_prices.append(price)
    
    driver.quit()
    
    return egg_prices

if __name__ == "__main__":
    prices = scrape_egg_prices()
    for price in prices:
        print(price)
