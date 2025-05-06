import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const seekerId = localStorage.getItem("seeker_id");
  const userRole = localStorage.getItem("role"); // Get user role from localStorage
  const companyid = localStorage.getItem("company_id");
  console.log(userRole);
  console.log(seekerId);
  console.log(token);
  console.log(companyid);
  // If no token or seekerId, redirect to login
  if (!token && !seekerId || !token && !companyid) {
    
    return <Navigate to="/Login" replace />;
  }

  // If user role doesn't match the allowed role, redirect to home
  if (userRole !== allowedRole) {
    
    return <Navigate to="/" replace />;
    
  }

  // If authenticated and role matches, render the requested component
  return children;
};

export default ProtectedRoute;