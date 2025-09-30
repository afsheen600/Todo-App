import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import List from "./pages/List";
import AddTodo from "./pages/AddTodo";
import UpdateTodo from "./pages/UpdateTodo";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Protected from "./pages/ProtectedRoute";
import { Box } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        backgroundColor: "#d0aea6ff",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <List />
            </Protected>
          }
        />
        <Route
          path="/addTodo"
          element={
            <Protected>
              <AddTodo />
            </Protected>
          }
        />
        <Route path="/updateTodo/:id" element={<UpdateTodo />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;
