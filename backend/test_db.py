import subprocess
import tempfile
import os

def run_wranger_d1_command(database_name, sql_command):
    """
    Executes a single SQL command on the specified D1 database using Wrangler CLI.
    Writes the SQL command to a temporary file and uses the --file argument.
    """
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

        result = subprocess.run(
            command,
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print("Error executing command:")
            print(result.stderr)
            return None
        return result.stdout

    finally:
        os.remove(tmp_filename)

def write_results_to_d1(options, database_name="groceries"):
    """
    Creates the table (if needed) and inserts the provided options into the Cloudflare D1 database.
    """
    # Create the table if it doesn't exist
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

    # Insert each option into the table
    for record in options:
        # Escape single quotes in values to avoid SQL issues
        item = record.get("option", "").replace("'", "''")
        price = record.get("price", "").replace("'", "''")
        insert_sql = f"""
        INSERT INTO dozen_egg_options (food_type, grocery_store, item, price, time)
        VALUES ('{food_type}', '{grocery_store}', '{item}', '{price}', '');
        """
        run_wranger_d1_command(database_name, insert_sql)

def test_db_insert():
    # Sample test data
    sample_options = [
        {"option": "Vital Farms Pasture Raised Large Grade A Eggs", "price": "$9.99/ea"},
        {"option": "Happy Egg Co. Organic Free Range Eggs", "price": "$10.49/ea"}
    ]
    
    # Write test data to the Cloudflare D1 database using Wrangler CLI
    write_results_to_d1(sample_options)
    
    # Query the table to verify insertion
    database_name = "groceries"
    query_sql = "SELECT food_type, grocery_store, item, price, time FROM dozen_egg_options;"
    output = run_wranger_d1_command(database_name, query_sql)
    
    print("Rows in table dozen_egg_options:")
    print(output)

if __name__ == "__main__":
    test_db_insert()
