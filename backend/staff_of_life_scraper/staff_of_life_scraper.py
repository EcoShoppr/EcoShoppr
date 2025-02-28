import os
import subprocess
import tempfile
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup
from datetime import date

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
    # Define a regex pattern that allows flexible whitespace for the marker.
    marker_pattern = r"Fair Trade\s+1"
    match = re.search(marker_pattern, full_text, re.IGNORECASE)
    text = full_text[match.end():] if match else full_text
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

def scrape_product_prices():
    #Scrapes Product Prices

    # Current Date
    today = date.today().isoformat()

    # Staff URL for Eggs; adjust as necessary.
    url = "https://staffoflife.storebyweb.com/s/1000-1010/b?g=CGP-1002-2191"

    # Comment out headless if needed for full JS support:
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)

    #Wait time until document.readyState is complete, then add extra sleep
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")
    time.sleep(5) # additional wait time
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    # Capture egg option groupings from our regex scan.
    egg_matches = scan_egg_options(soup)
    
    #print(egg_matches)  # Debugging

    #Filter results in egg_matches to only include dozen egg options
    filtered = []
    for match in egg_matches:
        if "12 CT" in match[0].upper() or "1 DZN" in match[0].upper():
            filtered.append(match)
    
    #print(filtered)  # Debugging
    
    # Collecting results for database
    products = []

    # Display formatted results and store in products
    if filtered:
        print("Dozen egg options:")
        for option, price in filtered:
            clean_option = clean_option_text(option)
            print(f"Option: {clean_option}  --  Price: {price}")
            products.append({"option": clean_option, "price": price, "date": today})

      # Potentially unnecessary code
    # else: 
    #     print("Dozen eggs option not found, retrying with more wait time")
    #     time.sleep(5)  # extra wait time
    #     # Re-read page source and update soup after waiting
    #     page_source = driver.page_source
    #     soup = BeautifulSoup(page_source, "html.parser")
    #     egg_matches = scan_egg_options(soup)
    #     filtered_retry = [match for match in egg_matches
    #                       if ("12 CT" in match[0].upper() or "1 DZN" in match[0].upper())]
    #     if filtered_retry:
    #         for option, price in filtered_retry:
    #             clean_option = clean_option_text(option)
    #             print(f"Option: {clean_option}  --  Price: {price}")
    #             options_list.append({"option": clean_option, "price": price})

    driver.quit()

    # the following code is from the original staff_scraper.py

        # Locate the container with the product "dozen eggs"; adjust selectors as needed.
    # product = soup.find(lambda tag: tag.name == "div" and "dozen eggs" in tag.get_text().lower())
    # if product:
    #     # Extract price - adjust the selector based on actual page structure.
    #     price = product.find(lambda tag: tag.name == "span" and "$" in tag.get_text())
    #     if price:
    #         return product.get_text(strip=True), price.get_text(strip=True)
    # return None

    return products

def run_wranger_d1_command(database_name, sql_command):
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".sql") as tmp:
        tmp.write(sql_command)
        tmp.flush()
        tmp_filename = tmp.name

    try:
        command = [
            "wrangler",
            "d1",
            "execute",
            database_name,
            "--remote",
            "--file",
            tmp_filename
        ]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            print("Error executing command:")
            print(result.stderr)
        return result.stdout
    finally:
        os.remove(tmp_filename)

def write_results_to_db(options):
    database_name = "groceries"
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS dozen_egg_options (
        food_type TEXT,
        grocery_store TEXT,
        item TEXT,
        price TEXT,
        time TEXT
    );
    """
    run_wranger_d1_command(database_name, create_table_sql)
    
    food_type = "dozen_egg_options"
    grocery_store = "staff_of_life"
    for record in options:
        item = record.get("option", "").replace("'", "''")
        price = record.get("price", "").replace("'", "''")
        insert_sql = f"""
        INSERT INTO dozen_egg_options (food_type, grocery_store, item, price, time)
        VALUES ('{food_type}', '{grocery_store}', '{item}', '{price}', '');
        """
        run_wranger_d1_command(database_name, insert_sql)
    print("Staff of Life data inserted into D1 SQL database via Wrangler CLI.")

if __name__ == "__main__":
    options = scrape_product_prices()
    #write_results_to_db(options)
    print(options)
