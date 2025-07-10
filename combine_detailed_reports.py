import csv
import json
import os
from pathlib import Path

def aggregate_monthly_reports(base_dir, output_json_path):
    """
    Aggregates CSV reports from monthly directories into a single JSON file.

    The script traverses a directory structure like:
    base_dir/
        April/
            Report Type 1/
                report.csv
            Report Type 2/
                report.csv
        May/
            ...

    And creates a JSON file structured as:
    {
        "April": {
            "Report Type 1": [ ... csv data ... ],
            "Report Type 2": [ ... csv data ... ]
        },
        "May": { ... }
    }

    Args:
        base_dir (str): The path to the base directory containing monthly folders.
        output_json_path (str): The path for the output JSON file.
    """
    aggregated_data = {}

    try:
        # Ensure the base directory exists
        if not os.path.isdir(base_dir):
            print(f"Error: Base directory '{base_dir}' not found.")
            return

        # Iterate through each month's directory (e.g., 'April', 'May')
        for month_dir in sorted(Path(base_dir).iterdir()):
            if month_dir.is_dir():
                month_name = month_dir.name
                aggregated_data[month_name] = {}

                # Iterate through each report type directory (e.g., 'Charges By Clinic')
                for report_type_dir in sorted(month_dir.iterdir()):
                    if report_type_dir.is_dir():
                        report_name = report_type_dir.name
                        report_data = []

                        # Find all CSV files in the report directory
                        for csv_file in report_type_dir.glob('*.csv'):
                            with open(csv_file, mode='r', encoding='utf-8') as f:
                                reader = csv.DictReader(f)
                                for row in reader:
                                    report_data.append(row)
                        
                        # Store the collected data
                        if report_data:
                            aggregated_data[month_name][report_name] = report_data

        # Write the aggregated data to the output JSON file
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(aggregated_data, f, indent=4)

        print(f"Successfully aggregated reports into '{output_json_path}'")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # --- Configuration ---
    # Base directory containing the monthly folders
    REPORTS_BASE_DIR = 'public/csv.data/Detailed Charges Report'

    # Path for the final, combined JSON file
    OUTPUT_JSON = 'public/csv.data/Detailed Charges Report/detailed_charges_report.json'

    # --- Execution ---
    aggregate_monthly_reports(REPORTS_BASE_DIR, OUTPUT_JSON)
