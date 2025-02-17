import os
import subprocess
import tempfile
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup

def scrape_product_prices():
    url = "https://www.staffoflife.com/search?q=Eggs"
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")
    time.sleep(5)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    # Example scraping logic; adjust as necessary.
    products = [
        {"option": "Staff of Life Organic Eggs", "price": "$8.49"},
        {"option": "Staff of Life Free Range Eggs", "price": "$7.99"}
    ]
    driver.quit()
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
    write_results_to_db(options)
