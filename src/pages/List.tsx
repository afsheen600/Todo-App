import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../Api/apiClients";

interface Task {
  _id: string;
  Title: string;
  Description: string;
}

const List = () => {
  const [tasksData, setTasksData] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiClient("/tasks"); // 👈 using apiClient
      setTasksData(data.result || []);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tasks";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletTask = async (id: string) => {
    try {
      const data = await apiClient(`/delete/${id}`, { method: "DELETE" });
      if (data.success) {
        console.log("Task deleted successfully:", data);
      } else {
        console.error("Failed to delete task:", data.message);
      }
      fetchTasks();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Mobile view for tasks
  const MobileTaskView = ({ task, index }: { task: Task; index: number }) => (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: "#9c6f65ff",
        color: "whitesmoke",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "medium",
            wordBreak: "break-word",
            maxWidth: "70%",
            color: "whitesmoke",
          }}
        >
          {index + 1}. {task.Title}
        </Typography>
        <Box>
          <IconButton
            color="primary"
            aria-label="edit"
            size="small"
            sx={{ mr: 1, color: "whitesmoke" }}
            onClick={() => navigate(`/updateTodo/${task._id}`)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            aria-label="delete"
            size="small"
            sx={{ color: "whitesmoke" }}
            onClick={() => deletTask(task._id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{
          wordBreak: "break-word",
          color: "whitesmoke",
        }}
      >
        {task.Description}
      </Typography>
    </Paper>
  );

  return (
    // <Box
    //   sx={{
    //     display: "flex",
    //     justifyContent: "center",
    //     width: "100%",
    //     // maxWidth: "80%",
    //   }}
    // >
    <Box
      sx={{
        padding: { xs: 1, sm: 2, md: 2 },
        // margin: { xs: 0.5, sm: 1, md: 1 },
        margin: "0 auto",
        overflow: "hidden",
        maxWidth: "80%",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          mb: 2,
          // mt: { xs: 2, sm: 2 }, // Reduced top margin
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" }, // Slightly smaller on medium screens
          textAlign: { xs: "center", sm: "left" },
          fontFamily: "monospace",
          color: "#3e0322ff",
          fontWeight: "bold",
        }}
      >
        Tasks List
      </Typography>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 2, // Reduced vertical margin
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      {isMobile ? (
        // Mobile view
        <Box sx={{ overflow: "hidden" }}>
          {tasksData.length > 0
            ? tasksData.map((task, index) => (
                <MobileTaskView key={task._id} task={task} index={index} />
              ))
            : !loading && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ py: 2 }} // Reduced padding
                >
                  No tasks found
                </Typography>
              )}
        </Box>
      ) : (
        // Tablet/Desktop view
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#9c7171ff",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#685c5cff",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          <Table
            sx={{
              minWidth: isTablet ? 400 : 650, // Adjusted for medium screens
              backgroundColor: "#9c6f65ff",
            }}
            aria-label="tasks table"
            size={isTablet ? "small" : "medium"}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2c1320" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    width: "8%", // Adjusted column widths
                    minWidth: "40px",
                    py: 1.5, // Reduced cell padding
                    pl: 2,
                    pr: 1,
                  }}
                >
                  S.No
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    width: "22%",
                    minWidth: "120px",
                    py: 1.5,
                    px: 1.5,
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    width: "50%",
                    minWidth: "200px",
                    py: 1.5,
                    px: 1.5,
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    width: "20%",
                    minWidth: "100px",
                    py: 1.5,
                    pl: 1.5,
                    pr: 2,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasksData.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    "&:hover": { backgroundColor: "action.selected" },
                  }}
                >
                  <TableCell sx={{ color: "white", py: 1.5, pl: 2, pr: 1 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "medium",
                      wordBreak: "break-word",
                      color: "whitesmoke",
                      py: 1.5,
                      px: 1.5,
                    }}
                  >
                    {item.Title}
                  </TableCell>
                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      color: "whitesmoke",
                      py: 1.5,
                      px: 1.5,
                    }}
                  >
                    {item.Description}
                  </TableCell>
                  <TableCell sx={{ py: 1.5, pl: 1.5, pr: 2 }}>
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      size="small"
                      sx={{ mr: 1, color: "whitesmoke" }}
                      onClick={() => navigate(`/updateTodo/${item._id}`)}
                    >
                      <Edit fontSize={isTablet ? "small" : "medium"} />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label="delete"
                      size="small"
                      sx={{ color: "whitesmoke" }}
                      onClick={() => deletTask(item._id)}
                    >
                      <Delete fontSize={isTablet ? "small" : "medium"} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {tasksData.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No tasks found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    // </Box>
  );
};

export default List;
