import json
import os
from collections import defaultdict

def get_cpt_code_category(cpt_code):
    if not cpt_code:
        return None
    try:
        cpt_code_num = int(cpt_code)
        if 99304 <= cpt_code_num <= 99306:
            return "Initial Visits"
        if 99307 <= cpt_code_num <= 99310:
            return "Subsequent Visits"
        if 99315 <= cpt_code_num <= 99316:
            return "Discharge"
    except ValueError:
        # Handle non-numeric CPT codes like 'G0317'
        pass
    return None

def generate_provider_kpis(input_path, output_path):
    with open(input_path, 'r') as f:
        data = json.load(f)

    provider_data = defaultdict(lambda: {
        "visitData": {
            "Initial Visits": {"cpt_codes": defaultdict(lambda: defaultdict(int)), "totals": defaultdict(int)},
            "Subsequent Visits": {"cpt_codes": defaultdict(lambda: defaultdict(int)), "totals": defaultdict(int)},
            "Discharge": {"cpt_codes": defaultdict(lambda: defaultdict(int)), "totals": defaultdict(int)},
        },
        "monthly_kpis": {
            "Total Visits": defaultdict(int),
            "Charges": defaultdict(int)
        }
    })

    for month, reports in data.items():
        if "Charges By Provider" in reports:
            for charge in reports["Charges By Provider"]:
                provider_name = charge.get("provider_name")
                cpt_code = charge.get("code")
                category = get_cpt_code_category(cpt_code)
                
                # --- Robust data conversion ---
                try:
                    visits = int(float(charge.get("units_billed", 0)))
                except (ValueError, TypeError):
                    visits = 0

                try:
                    charges = float(charge.get("insurance_billed_amount", 0.0))
                except (ValueError, TypeError):
                    charges = 0
                # ----------------------------

                if provider_name and category:
                    # Aggregate visit data by CPT code
                    provider_data[provider_name]["visitData"][category]["cpt_codes"][cpt_code][month] += visits
                    provider_data[provider_name]["visitData"][category]["cpt_codes"][cpt_code]["Total"] += visits
                    
                    # Aggregate visit totals for the category
                    provider_data[provider_name]["visitData"][category]["totals"][month] += visits
                    provider_data[provider_name]["visitData"][category]["totals"]["Grand Total"] += visits

                    # Aggregate monthly KPIs
                    provider_data[provider_name]["monthly_kpis"]["Total Visits"][month] += visits
                    provider_data[provider_name]["monthly_kpis"]["Total Visits"]["Grand Total"] += visits
                    provider_data[provider_name]["monthly_kpis"]["Charges"][month] += charges
                    provider_data[provider_name]["monthly_kpis"]["Charges"]["Grand Total"] += charges

    # Create the directory for the output file if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w') as f:
        json.dump(provider_data, f, indent=2)

    print(f"Successfully generated provider KPIs at {output_path}")

if __name__ == "__main__":
    INPUT_JSON = 'public/csv.data/detailed_charges_report.json'
    OUTPUT_JSON = 'public/data/provider_kpis.json'
    generate_provider_kpis(INPUT_JSON, OUTPUT_JSON)
