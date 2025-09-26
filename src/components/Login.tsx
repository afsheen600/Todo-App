import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";

const Login = () => {
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
      // Add your logic here
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevent form submission refresh
    console.log(loginData);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log(result);
        document.cookie = "token=" + result.token;

        localStorage.setItem("login", loginData.email);
        localStorage.setItem("isLoggedIn", "true");
        window.dispatchEvent(new Event("authChange"));
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } else {
        console.error("login failed:", result.message);
      }
    } catch (error) {
      console.error("login error:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 6,
          borderRadius: 3,
          backgroundColor: "#9c6f65ff",
          color: "#3f1910ff",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          Login
        </Typography>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            onChange={(event) =>
              setLoginData({ ...loginData, email: event.target.value })
            }
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3f1910ff", // Change to your desired color
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            onChange={(event) =>
              setLoginData({ ...loginData, password: event.target.value })
            }
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3f1910ff", // Change to your desired color
                },
              },
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, py: 1.2, backgroundColor: "#8c0a0ab1" }}
          >
            Login
          </Button>
          <Link to="/signup" style={{ color: "red" }}>
            Signup
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
