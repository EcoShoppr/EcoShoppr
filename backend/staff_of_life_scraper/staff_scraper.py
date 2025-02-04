import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def get_first_dozen_eggs_price(url):
    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    
    driver.get(url)
    # Optionally wait for page to load
    # from selenium.webdriver.support.ui import WebDriverWait
    # WebDriverWait(driver, 10).until(lambda d: d.execute_script("return document.readyState") == "complete")
    
    page_source = driver.page_source
    driver.quit()
    
    soup = BeautifulSoup(page_source, 'html.parser')
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
    if result:
        product_name, product_price = result
        print(f"Product: {product_name}\nPrice: {product_price}")
    else:
        print("Dozen eggs option not found.")
