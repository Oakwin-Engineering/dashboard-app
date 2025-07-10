import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  AppBar,
  Typography,
} from "@mui/material";
import NestedList, { NavItem } from "./components/NestedList.tsx";
import MainContent from "./components/MainContent.tsx";

// --- TYPE DEFINITIONS ---
export interface MonthlyValues {
  [key: string]: number;
}
export type CptCodeData = MonthlyValues;
export interface VisitCategoryData {
  cpt_codes: { [cptCode: string]: CptCodeData };
  totals: MonthlyValues;
}
export interface VisitData {
  "Initial Visits": VisitCategoryData;
  "Subsequent Visits": VisitCategoryData;
  "Discharge": VisitCategoryData;
}
export interface MonthlyKpis {
  [kpiName: string]: MonthlyValues;
}
export interface ProviderData {
  visitData: VisitData;
  monthly_kpis: MonthlyKpis;
}
export interface KpiData {
  [providerName: string]: ProviderData;
}

const drawerWidth = 300;

function findNavItemByPath(items: NavItem[], path: string[]): NavItem | null {
  let current: NavItem | null = null;
  let children = items;
  for (const label of path) {
    current = children.find((item) => item.label === label) || null;
    if (!current) return null;
    children = current.children || [];
  }
  return current;
}

// A simple function to guess the facility from the provider name
function getFacilityFromProvider(providerName: string): string {
    // This is a placeholder. You might need a more robust way to map providers to facilities.
    // For now, we'll assume a simple mapping or a default.
    if (providerName.includes("Arney") || providerName.includes("Landreth") || providerName.includes("Anderson") || providerName.includes("Kolb")) {
        return "AHOSKIE HEALTH AND REHAB";
    }
    return "ALAMANCE HEALTH CARE CENTER"; // Default facility
}

const App: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [dynamicNavData, setDynamicNavData] = useState<NavItem[]>([]);

  useEffect(() => {
    fetch("/data/provider_kpis.json")
      .then((response) => response.json())
      .then((data: KpiData) => {
        setKpiData(data);

        // Dynamically build nav data from the fetched KPI data
        const facilities: { [key: string]: NavItem } = {};
        Object.keys(data).forEach(providerName => {
            const facilityName = getFacilityFromProvider(providerName);
            if (!facilities[facilityName]) {
                facilities[facilityName] = { label: facilityName, children: [] };
            }
            facilities[facilityName].children!.push({ label: providerName });
        });

        const newNavData: NavItem[] = [
            {
                label: "Overall",
                children: Object.values(facilities),
            }
        ];
        setDynamicNavData(newNavData);
      })
      .catch((error) => console.error("Error fetching KPI data:", error));
  }, []);

  const selectedItem = findNavItemByPath(dynamicNavData, selectedPath);
  const selectedProviderName = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : null;
  const providerKpis = kpiData && selectedProviderName ? kpiData[selectedProviderName] : null;

  const onBreadcrumbClick = (path: string[]) => {
    setSelectedPath(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <img
            src="./uhc-logo.png"
            alt="Universal Health"
            height={40} 
            style={{ marginRight: 16 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            Universal Health
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <NestedList
          items={dynamicNavData}
          onSelect={(item, path) => {
            setSelectedPath(path);
          }}
          selectedPath={selectedPath}
        />
      </Drawer>
      <MainContent
        selectedItem={selectedItem}
        selectedPath={selectedPath}
        onBreadcrumbClick={onBreadcrumbClick}
        onSelect={(item, path) => {
          setSelectedPath(path);
        }}
        providerData={providerKpis}
      />
    </Box>
  );
};

export default App;
