import { AuthProvider } from "./Contexts/Authenticate";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import all components
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Layout from "./components/Layout/Layout";
import NotFound from "./components/NotFound/NotFound";
import SignUpCompany from "./components/SignUpCompany/SignUpCompany";
import LoginCompany from "./components/LoginCompany/LoginCompany";
import Forget from "./components/Forget/Forget";
import OtpConfirmation from "./components/OtpConfirmation/OtpConfirmation";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Location from "./components/Location/Location";
import Info from "./components/Info/Info";
import Welcome from "./components/home/welcome/welcome";
import Company from "./components/home/NavIcons/company-nav";
import UserProfile from "./components/home/NavIcons/PROFILE/profile/ProfilePage-1";
import Dashboard from "./components/Dashboard-Company/Dashboard";

import DashboardContent from "./components/Dashboard-Company/dashboard-content";
import Jobpost from "./components/Dashboard-Company/jobpost";

const router = createBrowserRouter([

  // welcome landing page route
  {
    path: "/",
    element: <Welcome />, 
  },




  // login and sign up route
  {
    path: "/",
    element: <Layout />, // Main layout for normal routes
    children: [
      { path: "Register", element: <Register /> },
      { path: "Login", element: <Login /> },
      { path: "SignUpCompany", element: <SignUpCompany /> },
      { path: "LoginCompany", element: <LoginCompany /> },
      { path: "Forget", element: <Forget /> },
      { path: "OtpConfirmation", element: <OtpConfirmation /> },
      { path: "ResetPassword", element: <ResetPassword /> },
      { path: "location", element: <Location /> },
      { path: "info", element: <Info /> },
      { path: "*", element: <NotFound /> },
    ],
  },


  // seeker home page rout when click on find new job

  {
    path: "/Home",
    element: <Company />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },


  // Dashboard when click on post new job route

  {
    path: "/Dashboard",
    element: <Dashboard />, // Dashboard should be the main container
    children: [
      { path: "Overview", element: <DashboardContent /> },
      { path: "Jobpost", element: <Jobpost /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
