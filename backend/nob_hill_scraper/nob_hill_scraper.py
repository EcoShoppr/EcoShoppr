import os
import time
import re
import subprocess
import tempfile
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup

def extract_options(soup):
    full_text = soup.get_text(separator=" ", strip=True)
    raw_items = re.split(r"Log In to AddBookmark(?=\s*\$)", full_text)
    options = [opt.strip() for opt in raw_items if opt.strip()]
    return options

def scan_egg_options(soup):
    full_text = soup.get_text(separator=" ", strip=True)
    pattern = r"(\$\d+\.\d{2}\s+ea.*?ct(?:\s*\+\s*More)?)(?=\s*Log In to Add Bookmark|$)"
    matches = re.findall(pattern, full_text, re.IGNORECASE | re.DOTALL)
    return matches

def scan_egg_options_dict(soup):
    full_text = soup.get_text(separator=" ", strip=True)
    pattern = r"(\$\d+\.\d{2})\s+ea\s+(.*?ct)(?:\s*\+\s*More)?(?=\s*Log In to Add Bookmark|$)"
    matches = re.findall(pattern, full_text, re.IGNORECASE | re.DOTALL)
    dozen_options = []
    for price, desc in matches:
        cleaned_option = re.sub(r"Original Price\s+\$\d+\.\d{2}", "", desc, flags=re.IGNORECASE)
        cleaned_option = re.sub(r"\s+", " ", cleaned_option).strip()
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
    egg_options = scan_egg_options(soup)  # For debugging (optional)
    dozen_egg_options = scan_egg_options_dict(soup)
    
    driver.quit()
    return dozen_egg_options

def run_wranger_d1_command(database_name, sql_command):
    # Write SQL command to a temporary file
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
    # Create table if not exists
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
    grocery_store = "nob_hill"
    for record in options:
        item = record.get("option", "").replace("'", "''")
        price = record.get("price", "").replace("'", "''")
        insert_sql = f"""
        INSERT INTO dozen_egg_options (food_type, grocery_store, item, price, time)
        VALUES ('{food_type}', '{grocery_store}', '{item}', '{price}', '');
        """
        run_wranger_d1_command(database_name, insert_sql)
    print("Data inserted into D1 SQL database via Wrangler CLI.")

if __name__ == "__main__":
    options = scrape_egg_prices()
    write_results_to_db(options)
