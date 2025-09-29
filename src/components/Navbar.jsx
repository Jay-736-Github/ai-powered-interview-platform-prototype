import { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Tabs, Tab } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}
export default function Navbar() {
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [location.pathname]);

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: "#1976d2",
        borderBottom: "1px solid #1565c0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
        }}
      >

        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <RouterLink
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Georgia, serif",
                fontWeight: "bold",
                color: "#fff",
                userSelect: "none",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                cursor: "pointer",
              }}
            >
              Interview-Mate
            </Typography>
          </RouterLink>
        </Box>

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={value}
            aria-label="app navigation tabs"
            TabIndicatorProps={{
              sx: {
                height: "3px",
                borderRadius: "3px",
                backgroundColor: "#fff", 
                mx: "auto", 
                width: "fit-content", 
                minWidth: "40px", 
              },
            }}
            sx={{
              "& .MuiTab-root": {
                minWidth: "auto",
                px: 3,
                py: 0.5,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#fff", 
              },
              "& .Mui-selected": {
                color: "#fff !important", 
              },
              "& .MuiTab-iconWrapper": {
                color: "#fff !important", 
              },
            }}
          >
            <Tab
              icon={<PersonIcon />}
              iconPosition="start"
              label="Interviewee"
              component={RouterLink}
              to="/"
              {...a11yProps(0)}
            />
            <Tab
              icon={<DashboardIcon />}
              iconPosition="start"
              label="Interviewer"
              component={RouterLink}
              to="/dashboard"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <Box sx={{ flex: 1 }} />
      </Toolbar>
    </AppBar>
  );
}