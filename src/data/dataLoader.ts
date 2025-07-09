import Papa from "papaparse";

// Define the structure of a row in your CSV data after parsing
interface CsvRow {
  patient_id: string;
  patient: string;
  date_of_service: string;
  primary_billed_amount: string; // PapaParse reads numbers as strings initially
  // Add other fields from your CSV as needed
}

// Define the structure your table component expects
export interface TableRow {
  section: string;
  type: "data" | "total";
  code?: string;
  label?: string;
  values: (number | string)[];
  total: number | string;
  coding: string;
  colorGroup: string;
  isCurrency?: boolean;
  isSectionHeader?: boolean;
}

// Function to fetch and parse the CSV data
export const loadAndProcessCsvData = async (): Promise<TableRow[]> => {
  // NOTE: For this to work, the 'csv.data' directory must be inside the 'public' folder,
  // not 'src'. Please move it there.
  const csvFilePath = "/csv.data/Submitted Claims Report/All Data/All Data_Start_04_01_2025_End_06_30_2025.csv";

  const response = await fetch(csvFilePath);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const transformedData = transformData(results.data);
        resolve(transformedData);
      },
      error: (error: any) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      },
    });
  });
};

// Function to transform the parsed CSV data into the format your table needs
const transformData = (data: CsvRow[]): TableRow[] => {
  // This is where the complex mapping logic will go.
  // For now, let's create a single, simple example row
  // that sums the primary_billed_amount for each month.

  const monthlyTotals = new Array(12).fill(0);
  let grandTotal = 0;

  for (const row of data) {
    if (row.date_of_service && row.primary_billed_amount) {
      const date = new Date(row.date_of_service);
      const month = date.getMonth(); // 0 for Jan, 1 for Feb, etc.
      const amount = parseFloat(row.primary_billed_amount);

      if (!isNaN(amount)) {
        monthlyTotals[month] += amount;
        grandTotal += amount;
      }
    }
  }

  // Example of creating one row for the table.
  // You will need to expand this to create all the rows you need.
  const chargesRow: TableRow = {
    section: "Charges",
    type: "data",
    label: "Total Billed from CSV",
    values: monthlyTotals,
    total: grandTotal,
    coding: "", // You can calculate this if needed
    colorGroup: "green",
    isCurrency: true,
    isSectionHeader: true,
  };

  // We will return this single row for now to demonstrate.
  return [chargesRow];
};
