import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import re
import json  # new import

def scrape_egg_prices():
    import time
    url = "https://www.safeway.com/shop/aisles/dairy-eggs-cheese/eggs.html?sort=&page=1&loc=3132"
    
    # Set up Selenium WebDriver
    chrome_options = Options()
    # Comment out headless if needed for full JS support:
    # chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    
    driver.get(url)
    # Increase wait time: wait until document.readyState is complete, then add extra sleep
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")

    time.sleep(20)  # Wait for the page to load
    
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
