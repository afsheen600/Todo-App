// import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

interface Props {
  /** MUI example passes a `window` prop for SSR testing — keep the prop name, but we rename it locally */
  window?: () => Window;
}

const drawerWidth = 240;

export default function DrawerAppBar(props: Props) {
  // rename the incoming prop to avoid shadowing the global `window`
  const { window: containerWindow } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false; // SSR safe
    try {
      return localStorage.getItem("isLoggedIn") === "true";
    } catch {
      return false;
    }
  });

  const navigate = useNavigate();

  // Keep component in sync when auth changes (other tabs or app code)
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    // storage event handler (fires in other tabs/windows when localStorage changes)
    const handleStorage = (e: Event) => {
      const se = e as StorageEvent;
      if (se?.key === "isLoggedIn") {
        setIsLoggedIn(se.newValue === "true");
      }
    };

    // custom event handler to notify this tab (we dispatch 'authChange' manually)
    const handleAuthChange = () => {
      try {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      } catch {
        setIsLoggedIn(false);
      }
    };

    // Use the real browser window (not the prop) — no shadowing now
    window.addEventListener("storage", handleStorage as EventListener);
    window.addEventListener("authChange", handleAuthChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage as EventListener);
      window.removeEventListener(
        "authChange",
        handleAuthChange as EventListener
      );
    };
  }, []);

  const handleDrawerToggle = () => setMobileOpen((s) => !s);

  const handleLogout = () => {
    localStorage.removeItem("login");
    window.dispatchEvent(new Event("authChange"));
    setIsLoggedIn(false);
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  // Drawer content (only show nav items when logged in)
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: "#3f1910ff" }}>
        Todo App
      </Typography>
      <Divider />
      {isLoggedIn && (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemText primary="List" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/addTodo")}>
              <ListItemText primary="Add Todo" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  const container =
    containerWindow !== undefined
      ? () => containerWindow().document.body
      : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "#8c0a0ab1" }}>
        <Toolbar>
          {isLoggedIn && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h3"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontFamily: "monospace",
              fontSize: "1.8rem",
              color: "#e5e5dcff",
            }}
          >
            TodoApp
          </Typography>

          {isLoggedIn && (
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button sx={{ color: "#fff" }} onClick={() => navigate("/")}>
                List
              </Button>
              <Button
                sx={{ color: "#eeebebff" }}
                onClick={() => navigate("/addTodo")}
              >
                Add Todo
              </Button>
              <Button sx={{ color: "#fff" }} onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {/* toolbar spacer so content isn't hidden under AppBar */}
      <Toolbar />
    </Box>
  );
}
