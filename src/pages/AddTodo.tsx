import { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TodoTask = () => {
  const [taskData, setTaskData] = useState<{
    Title: string;
    Description: string;
  }>({
    Title: "",
    Description: "",
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleAddTask = async () => {
    const result = await fetch("http://localhost:3000/add-task", {
      method: "post",
      body: JSON.stringify(taskData),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      console.log("Task added successfully:", result);
      navigate("/");
    } else {
      console.error("Failed to add task:", result.status);
    }

    setTaskData({ Title: "", Description: "" });
  };

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
          Add New Task
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                onChange={(event) =>
                  setTaskData({ ...taskData, Title: event.target.value })
                }
                value={taskData.Title}
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
                onChange={(event) =>
                  setTaskData({ ...taskData, Description: event.target.value })
                }
                value={taskData.Description}
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
                onClick={handleAddTask}
                variant="contained"
                sx={{ backgroundColor: "#8c0a0ab1" }}
                color="primary"
                fullWidth
                size={isMobile ? "medium" : "large"}
                disabled={!taskData.Title.trim()} // Disable if title is empty
              >
                Add Task
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default TodoTask;
