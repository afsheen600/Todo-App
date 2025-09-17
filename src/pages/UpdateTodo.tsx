import { useEffect, useState } from "react";
import "../App.css";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTodo = () => {
  const [taskData, setTaskData] = useState<{
    _id?: string;
    Title: string;
    Description: string;
  }>({
    Title: "",
    Description: "",
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (id) {
      getTask(id);
    }
  }, [id]);

  const getTask = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/task/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      setTaskData(res.result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching task:", error);
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    try {
      // Include the ID in the URL and make sure to send the correct data
      const result = await fetch(`http://localhost:3000/update-task/${id}`, {
        method: "PUT", // Changed to uppercase
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: taskData.Title,
          Description: taskData.Description,
        }),
      });

      if (result.ok) {
        const responseData = await result.json();
        console.log("Task updated successfully:", responseData);
        navigate("/");
      } else {
        console.error("Failed to update task:", result.status);
        // Optional: Show error message to user
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      sx={{
        width: "100%",
        mt: { xs: 7, sm: 7, md: 6 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        component="div"
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: "100%", sm: "90%", md: "600px" },
          margin: "auto",
          maxWidth: "100%",
          backgroundColor: "#9c6f65ff",
          color: "#3f1910ff",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: "bold",
          }}
        >
          Update Task
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                value={taskData.Title || ""}
                onChange={(event) =>
                  setTaskData({ ...taskData, Title: event.target.value })
                }
                fullWidth
                label="Title"
                variant="outlined"
                placeholder="Add task title"
                required
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#3f1910ff", // Change to your desired color
                    },
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                value={taskData.Description}
                onChange={(event) =>
                  setTaskData({ ...taskData, Description: event.target.value })
                }
                fullWidth
                label="Description"
                variant="outlined"
                placeholder="Add task description"
                multiline
                rows={isMobile ? 3 : 4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#3f1910ff", // Change to your desired color
                    },
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                onClick={handleUpdateTask}
                sx={{ backgroundColor: "#8c0a0ab1" }}
                variant="contained"
                color="primary"
                fullWidth
                size={isMobile ? "medium" : "large"}
                disabled={!taskData.Title.trim()} // Disable if title is empty
              >
                Update Task
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateTodo;
