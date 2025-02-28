import subprocess
import tempfile
import os
import sys

def run_wranger_d1_command(database_name, sql_command):
    # Write SQL command to a temporary file and execute it using Wrangler CLI.
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

def clear_database():
    database_name = "groceries"
    drop_table_sql = "DROP TABLE IF EXISTS dozen_egg_options;"
    run_wranger_d1_command(database_name, drop_table_sql)
    print("Database cleared: 'dozen_egg_options' table dropped.")

def run_scraper(scraper_relative_path):
    scraper_path = os.path.join(os.path.dirname(__file__), scraper_relative_path)
    print(f"Running scraper: {scraper_relative_path}")
    result = subprocess.run([sys.executable, scraper_path], capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"Error running {scraper_relative_path}:", result.stderr)
        exit(result.returncode)

def main():
    # Clear the database before repopulating it
    clear_database()
    
    scrapers = [
        "backend/nob_hill_scraper/nob_hill_scraper.py",
        "backend/safeway_scraper/safeway_scraper.py",
        "backend/staff_of_life_scraper/staff_of_life_scraper.py"
    ]
    for scraper in scrapers:
        run_scraper(scraper)
    print("All scrapers have completed and repopulated the D1 SQL database.")

if __name__ == "__main__":
    main()
