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

def scan_egg_options_dict(soup):
    full_text = soup.get_text(separator=" ", strip=True)
    # Pattern: capture price and option description (up to "ct"), optionally removing trailing " + More"
    pattern = r"(\$\d+\.\d{2})\s+ea\s+(.*?ct)(?:\s*\+\s*More)?(?=\s*Log In to Add Bookmark|$)"
    matches = re.findall(pattern, full_text, re.IGNORECASE | re.DOTALL)
    dozen_options = []
    for price, desc in matches:
        # Remove "Original Price $__.__" if present and collapse extra spaces.
        cleaned_option = re.sub(r"Original Price\s+\$\d+\.\d{2}", "", desc, flags=re.IGNORECASE)
        cleaned_option = re.sub(r"\s+", " ", cleaned_option).strip()
        # Filter only for 12 ct entries that mention "egg"
        if "12 ct" in cleaned_option.lower() and "egg" in cleaned_option.lower():
            dozen_options.append({
                "option": cleaned_option.title(),
                "price": price.strip() + "/ea"
            })
    return dozen_options

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
    # extra spaces collapsed, and trailing " + More" removed.
    filtered_options = []
    for egg in egg_options:
        if "12 ct" in egg.lower() and "egg" in egg.lower():
            modified = egg.replace("ea", "")
            modified = re.sub(r"Original Price\s+\$\d+\.\d{2}", "", modified, flags=re.IGNORECASE)
            modified = re.sub(r"\s+", " ", modified).strip()
            modified = re.sub(r"\s*\+\s*More$", "", modified, flags=re.IGNORECASE)
            filtered_options.append(modified)
    print("\nFiltered 12 ct Egg options (cleaned):")
    for opt in filtered_options:
        print(opt)
    
    # New: extract dozen egg options as dictionary entries.
    dozen_egg_options = scan_egg_options_dict(soup)
    # Write the results to JSON file with the same attributes as the reference.
    import json
    with open("backend/nob_hill_scraper/dozen_egg_options.json", "w") as f:
        json.dump(dozen_egg_options, f, indent=4)
    
    driver.quit()
    return egg_options

if __name__ == "__main__":
    egg_options = scrape_egg_prices()