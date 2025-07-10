import csv
import json
import os

def convert_csv_to_json(csv_file_path, json_file_path):
    """
    Reads data from a CSV file and converts it into a JSON file.

    Args:
        csv_file_path (str): The full path to the input CSV file.
        json_file_path (str): The full path for the output JSON file.
    """
    data = []
    try:
        # Open the CSV file for reading with utf-8 encoding
        with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
            # Use DictReader to treat each row as a dictionary
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                data.append(row)

        # Open the JSON file for writing
        with open(json_file_path, mode='w', encoding='utf-8') as json_file:
            # Dump the list of dictionaries to the JSON file with an indent for readability
            json.dump(data, json_file, indent=4)

        print(f"Successfully converted {os.path.basename(csv_file_path)} to {os.path.basename(json_file_path)}")

    except FileNotFoundError:
        print(f"Error: The file {csv_file_path} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # --- Configuration ---
    # The script assumes it's in the root of your project directory.
    # You can change these paths if needed.

    # Input CSV file path
    csv_file = 'public/csv.data/Submitted Claims Report/All Data/All Data_Start_04_01_2025_End_06_30_2025.csv'

    # Output JSON file path (will be created in the same directory as the CSV)
    json_file = 'public/csv.data/Submitted Claims Report/All Data/claims_data.json'

    # --- Execution ---
    convert_csv_to_json(csv_file, json_file)
