import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

def extract_options(soup):
    full_text = soup.get_text(separator=" ", strip=True)
    # Use regex split so that only occurrences of "Log In to AddBookmark" directly followed by "$" are used as separators.
    raw_items = re.split(r"Log In to AddBookmark(?=\s*\$)", full_text)
    options = [opt.strip() for opt in raw_items if opt.strip()]
    return options

def scan_egg_options(soup):
    full_text = soup.get_text(separator=" ", strip=True)
    # Use a regex pattern to capture every item starting with a dollar sign and ending before the next "Log In to Add Bookmark" or end-of-string.
    pattern = r"(\$\d+\.\d{2}\s+ea.*?ct(?:\s*\+\s*More)?)(?=\s*Log In to Add Bookmark|$)"
    matches = re.findall(pattern, full_text, re.IGNORECASE | re.DOTALL)
    return matches

def scrape_egg_prices():
    url = "https://www.raleys.com/search?q=Eggs"
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    
    driver.get(url)
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")
    time.sleep(5)
    
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    # Extract raw options text using a text-search algorithm
    options = extract_options(soup)
    print("Extracted raw options:")
    for opt in options:
        print(" -", opt)
    
    # Filter these options using the new regex-based approach returning combined strings
    egg_options = scan_egg_options(soup)
    print("\nFiltered egg options with prices:")
    for egg in egg_options:
        print(f"Option: {egg}")
    
    # New filtering: Print only 12 ct options containing "Egg" or "Eggs" with "ea" removed, "Original Price $__.__" removed,
    # and with extra spaces collapsed.
    filtered_options = []
    for egg in egg_options:
        if "12 ct" in egg.lower() and "egg" in egg.lower():
            modified = egg.replace("ea", "")
            modified = re.sub(r"Original Price\s+\$\d+\.\d{2}", "", modified, flags=re.IGNORECASE)
            modified = re.sub(r"\s+", " ", modified).strip()
            filtered_options.append(modified)
    print("\nFiltered 12 ct Egg options (removed 'ea' and 'Original Price $__.__', extra spaces collapsed):")
    for opt in filtered_options:
        print(opt)
    
    driver.quit()
    return egg_options

if __name__ == "__main__":
    egg_options = scrape_egg_prices()