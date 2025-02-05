import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import re
import json  # new import

def scan_item_groupings(soup):
    # Extract all text from the page into a single string.
    text = soup.get_text(separator=" ", strip=True)
    # Regex pattern to match: item name, then a price in the form "$x.xx/ea" before the literal "Product Price".
    pattern = r"([A-Z0-9\s]+)\s+(\$\d+\.\d{2}(?:/ea)?)\s+Product Price"
    matches = re.findall(pattern, text, re.IGNORECASE)
    return matches

def scan_egg_options(soup):
    # Extract full text from the page.
    full_text = soup.get_text(separator=" ", strip=True)
    marker = "100% Organic  5 Fair Trade  1"
    # Only start processing text after the marker.
    if marker in full_text:
        text = full_text.split(marker, 1)[1]
    else:
        text = full_text
    # Regex to capture egg groupings: product description containing "EGGS", then a price before "Product Price".
    pattern = r"([A-Z0-9\s]+EGGS(?:.*?))\s+(\$\d+\.\d{2}(?:/ea)?)\s+Product Price"
    matches = re.findall(pattern, text, re.IGNORECASE)
    return matches

def clean_option_text(text):
    # Remove unwanted phrases.
    text = re.sub(r'ea product price', '', text, flags=re.IGNORECASE)
    text = re.sub(r'quantity 0 add to cart', '', text, flags=re.IGNORECASE)
    # Replace truncated "ct" with "Count".
    text = re.sub(r'\bct\b', 'Count', text, flags=re.IGNORECASE)
    # Replace "1 dzn" with "12 Count".
    text = re.sub(r'\b1 dzn\b', '12 Count', text, flags=re.IGNORECASE)
    # Replace "rnglg" with "Range Large".
    text = re.sub(r'\brnglg\b', 'Range Large', text, flags=re.IGNORECASE)
    # Replace "isl" with "Island".
    text = re.sub(r'\bisl\b', 'Island', text, flags=re.IGNORECASE)
    # Replace "brwn" with "Brown".
    text = re.sub(r'\bbrwn\b', 'Brown', text, flags=re.IGNORECASE)
    # Remove text following "Count" (the brand name) if any.
    text = re.sub(r'(Count)\s+.*', r'\1', text, flags=re.IGNORECASE)
    # Remove extra spaces.
    text = re.sub(r'\s+', ' ', text).strip()
    return text.title()

def get_first_dozen_eggs_price(url):
    chrome_options = Options()
    # Comment out headless if needed for full JS support:
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    
    driver.get(url)
    # Wait until page is loaded by waiting for a known element (e.g., a <ul> element) to appear.
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "ul")))
    
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')
    
    # Capture egg option groupings from our regex scan.
    egg_matches = scan_egg_options(soup)
    # Filter results only for dozen eggs (assuming indicators "12 CT" or "1 DZN").
    filtered = [match for match in egg_matches
                if ("12 CT" in match[0].upper() or "1 DZN" in match[0].upper())]
    options_list = []  # collect results for JSON
    # Display formatted results.
    if filtered:
        print("Dozen egg options:")
        for option, price in filtered:
            clean_option = clean_option_text(option)
            print(f"Option: {clean_option}  --  Price: {price}")
            options_list.append({"option": clean_option, "price": price})
    else:
        print("Dozen eggs option not found.")
    
    # Write the results to a JSON file (overwriting previous content) under the staff_of_life_scraper directory.
    with open("staff_of_life_scraper/dozen_egg_options.json", "w") as f:
        json.dump(options_list, f, indent=4)
    
    driver.quit()
    # Locate the container with the product "dozen eggs"; adjust selectors as needed.
    product = soup.find(lambda tag: tag.name == "div" and "dozen eggs" in tag.get_text().lower())
    if product:
        # Extract price - adjust the selector based on actual page structure.
        price = product.find(lambda tag: tag.name == "span" and "$" in tag.get_text())
        if price:
            return product.get_text(strip=True), price.get_text(strip=True)
    return None

if __name__ == '__main__':
    url = "https://staffoflife.storebyweb.com/s/1000-1010/b?g=CGP-1002-2191"  # Change to actual URL if different
    result = get_first_dozen_eggs_price(url)
