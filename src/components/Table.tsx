import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { ProviderData } from '../App.tsx';

// Define the structure of the provider data prop
// interface ProviderData {
//   visitData: {
//     [category: string]: {
//       cpt_codes: { [code: string]: { [month: string]: number } };
//       totals: { [month: string]: number };
//     };
//   };
//   monthly_kpis: {
//     [kpi: string]: { [month: string]: number };
//   };
// }

interface FinancialKpiTableProps {
  providerData: ProviderData | null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const colorMap: Record<string, string> = {
  "Initial Visits": "#FFF9C4",
  "Subsequent Visits": "#FFE0B2",
  "Discharge": "#E0E0E0",
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const FinancialKpiTable: React.FC<FinancialKpiTableProps> = ({ providerData }) => {
  // --- DEBUGGING LOG ---
  console.log("Table.tsx: Rendering with providerData:", providerData);
  // ---------------------

  if (!providerData) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', boxShadow: 2, borderRadius: 2 }}>
        <Typography>Select a provider to view their data.</Typography>
      </Paper>
    );
  }

  const { visitData, monthly_kpis } = providerData;

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
      <Table aria-label="financial performance table" size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>&nbsp;</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Code/Description</TableCell>
            {MONTHS_ABBR.map((month) => (
              <TableCell key={month} align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                {month}
              </TableCell>
            ))}
            <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(visitData).map(([section, data]) => (
            <React.Fragment key={section}>
              {/* CPT Code Rows */}
              {Object.entries(data.cpt_codes).map(([cpt, values], rowIdx) => (
                <TableRow key={cpt}>
                  {rowIdx === 0 && (
                    <TableCell
                      rowSpan={Object.keys(data.cpt_codes).length + 1}
                      sx={{
                        writingMode: "vertical-rl",
                        textAlign: "center",
                        background: colorMap[section] || "#fff",
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: "#222",
                        minWidth: 20,
                        maxWidth: 20,
                        padding: '8px 4px' // Adjust padding for vertical text
                      }}
                    >
                      {section}
                    </TableCell>
                  )}
                  <TableCell sx={{ fontSize: '0.8rem' }}>{cpt}</TableCell>
                  {MONTHS.map((month, index) => (
                    <TableCell key={month} align="center" sx={{ fontSize: '0.8rem' }}>
                      {values[MONTHS_ABBR[index]] || values[month] || 0}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {values['Total'] || 0}
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row for Section */}
              <TableRow sx={{ background: colorMap[section] || "#fff" }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Total</TableCell>
                {MONTHS.map((month, index) => (
                  <TableCell key={month} align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {data.totals[MONTHS_ABBR[index]] || data.totals[month] || 0}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {data.totals['Grand Total'] || 0}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          {/* Spacer Row */}
          <TableRow sx={{ height: 10 }}><TableCell colSpan={MONTHS.length + 3} /></TableRow>
          {/* Monthly KPIs Section */}
          {Object.entries(monthly_kpis).map(([kpi, values]) => (
            <TableRow key={kpi}>
              <TableCell colSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{kpi}</TableCell>
              {MONTHS.map((month, index) => (
                <TableCell key={month} align="center" sx={{ fontSize: '0.8rem' }}>
                  {kpi === "Charges" ? formatCurrency(values[MONTHS_ABBR[index]] || values[month] || 0) : (values[MONTHS_ABBR[index]] || values[month] || 0)}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                {kpi === "Charges" ? formatCurrency(values['Grand Total'] || values['Total'] || 0) : (values['Grand Total'] || values['Total'] || 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinancialKpiTable;
