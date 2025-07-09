import React, { useState } from "react";
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
import { navData } from "./data/navData.ts";

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

const App: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const selectedItem = findNavItemByPath(navData, selectedPath);

  const onBreadcrumbClick = (path: string[]) => {
    setSelectedPath(path);
  };

  console.log(selectedItem);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "white" }}
      >
        <Toolbar sx={{ minHeight: "110px !important" }}>
          <img
            src="./uhc-logo.png"
            alt="Universal Health"
            height={90}
            style={{ marginRight: 16, background: "#fff", borderRadius: 8 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ color: "black", fontWeight: "bold" }}
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
        <Toolbar sx={{ minHeight: "110px !important" }} />
        <NestedList
          items={navData}
          onSelect={(item, path) => setSelectedPath(path)}
          selectedPath={selectedPath}
        />
      </Drawer>
      <MainContent
        selectedItem={selectedItem}
        selectedPath={selectedPath}
        onBreadcrumbClick={onBreadcrumbClick}
        onSelect={(item, path) => setSelectedPath(path)}
      />
    </Box>
  );
};

export default App;
