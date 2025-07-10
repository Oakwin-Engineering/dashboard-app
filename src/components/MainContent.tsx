import React from "react";
import { Box, Typography, Toolbar, Paper, Breadcrumbs } from "@mui/material";
import { NavItem } from "./NestedList.tsx";
import FinancialKpiTable from "./Table.tsx";
import { ProviderData } from "../App.tsx";

type MainContentProps = {
  selectedItem: NavItem | null;
  selectedPath: string[];
  onBreadcrumbClick: (path: string[]) => void;
  onSelect: (item: NavItem, path: string[]) => void;
  providerData: ProviderData | null;
};

const MainContent: React.FC<MainContentProps> = ({
  selectedItem,
  selectedPath,
  onBreadcrumbClick,
  onSelect,
  providerData,
}) => {
  const hasChildren = selectedItem && selectedItem.children && selectedItem.children.length > 0;

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 1, height: '100vh', overflow: 'auto' }}>
      <Toolbar />
      {selectedItem ? (
        <>
          <Paper sx={{ p: 1, mb: 2 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Typography
                sx={{ cursor: 'pointer' }}
                onClick={() => onBreadcrumbClick([])}
              >
                Home
              </Typography>
              {selectedPath.slice(0, -1).map((seg, idx) => (
                <Typography
                  key={idx}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onBreadcrumbClick(selectedPath.slice(0, idx + 2))}
                >
                  {seg}
                </Typography>
              ))}
              <Typography color="text.primary">{selectedItem.label}</Typography>
            </Breadcrumbs>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              {selectedItem.label} Data
            </Typography>

            {providerData && <FinancialKpiTable providerData={providerData} />}
          </Paper>

          {hasChildren && (
            <Paper sx={{ p: 1 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                {selectedItem.label} Facilities
              </Typography>
              <ul>
                {selectedItem.children?.map((child) => (
                  <li
                    key={child.label}
                    onClick={() => onSelect(child, [...selectedPath, child.label])}
                    style={{ cursor: "pointer", padding: '4px 0' }}
                  >
                    <Typography>{child.label}</Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          )}
        </>
      ) : (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography>Select an item from the navigation menu to get started.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MainContent;
