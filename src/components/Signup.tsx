import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { baseURL } from "../constants";

const Signup = () => {
  const [signupData, setSignupData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate]); // Added navigate to dependency array

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(signupData);

    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        body: JSON.stringify(signupData),
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

        localStorage.setItem("login", signupData.email);
        navigate("/");
      } else {
        console.error("Signup failed:", result.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
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
          Signup
        </Typography>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSignup}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={signupData.name} // Added value binding
            onChange={(event) =>
              setSignupData({ ...signupData, name: event.target.value })
            }
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3f1910ff",
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            value={signupData.email} // Added value binding
            onChange={(event) =>
              setSignupData({ ...signupData, email: event.target.value })
            }
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3f1910ff",
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
            value={signupData.password} // Added value binding
            onChange={(event) =>
              setSignupData({ ...signupData, password: event.target.value })
            }
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3f1910ff",
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
            Sign Up
          </Button>
          <Link
            to="/login"
            style={{
              color: "red",
              display: "block",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            Already have an account? Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
