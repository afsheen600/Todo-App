import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: React.ReactElement;
}

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = () => {
    const login = localStorage.getItem("login");
    // Add additional validation if needed
    return login !== null && login !== "false";
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
