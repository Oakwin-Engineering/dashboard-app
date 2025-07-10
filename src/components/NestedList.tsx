import React, { useState, useEffect } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { loadNavData, NavDataItem } from "../data/navDataLoader.ts";

interface NavItemProps {
  item: NavDataItem;
  level: number;
  onSelect: (item: NavDataItem, path: string[]) => void;
  selectedPath: string[];
  parentPath?: string[];
}

const NavItem: React.FC<NavItemProps> = ({
  item,
  level,
  onSelect,
  selectedPath,
  parentPath = [],
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const currentPath = [...parentPath, item.label];
  const isSelected =
    selectedPath.length === currentPath.length &&
    selectedPath.every((v, i) => v === currentPath[i]);

  return (
    <React.Fragment>
      <ListItemButton
        sx={{
          pl: 2 * (level + 1),
          bgcolor: isSelected ? "#e3f2fd" : undefined,
        }}
        onClick={() => {
          if (item.children && item.children.length > 0) {
            handleClick();
            onSelect(item, currentPath);
          } else {
            onSelect(item, currentPath);
          }
        }}
        selected={isSelected}
      >
        <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
        <ListItemText primary={item.label} />
        {item.children ? (
          open ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )
        ) : null}
      </ListItemButton>
      {item.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 2 }}>
            {item.children.map((child, index) => (
              <NavItem
                key={index}
                item={child}
                level={level + 1}
                onSelect={onSelect}
                selectedPath={selectedPath}
                parentPath={currentPath}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </React.Fragment>
  );
};

interface NestedListProps {
  onSelect: (item: NavDataItem, path: string[]) => void;
  selectedPath: string[];
}

const NestedList: React.FC<NestedListProps> = ({
  onSelect,
  selectedPath,
}) => {
  const [navData, setNavData] = React.useState<NavDataItem[]>([]);

  useEffect(() => {
    const fetchNavData = async () => {
      const data = await loadNavData();
      setNavData(data);
    };

    fetchNavData();
  }, []);

  return (
    <List component="nav" disablePadding>
      {navData.map((item, index) => (
        <NavItem
          key={index}
          item={item}
          level={0}
          onSelect={onSelect}
          selectedPath={selectedPath}
        />
      ))}
    </List>
  );
};

export default NestedList;
