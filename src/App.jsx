import { AuthProvider } from "./Contexts/Authenticate";
import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

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
import ViewApplicationJon from "./components/Dashboard-Company/ViewApplicationJon";
import ViewAppSeeker from "./components/Dashboard-Company/ViewAppSeeker";
import DashboardContent from "./components/Dashboard-Company/dashboard-content";
import Jobpost from "./components/Dashboard-Company/jobpost";
import BasicInfo from "./components/Dashboard-Company/post-new-job-modal/BasicInfo";
import Skills from "./components/Dashboard-Company/post-new-job-modal/Skills";
import ExtraSections from "./components/Dashboard-Company/post-new-job-modal/ExtraSections";
import Questions from "./components/Dashboard-Company/post-new-job-modal/Questions";
import Preview from "./components/Dashboard-Company/post-new-job-modal/Preview";
import CompanyProfile from "./components/Dashboard-Company/Company-Profile/CompanyProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/",
    element: <Layout />,
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
  {
    path: "/Home",
    element: <Company />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "/Dashboard",
    element: <Dashboard />,
    children: [
      { path: "", element: <Navigate to="Overview" replace /> }, // Default redirect
      { path: "Overview", element: <DashboardContent /> },
      {
        path: "Jobpost",
        element: <Jobpost />,
        children: [
          { path: "basic-info", element: <BasicInfo /> }, // Route for BasicInfo
          { path: "skills", element: <Skills /> }, // Route for Skills
          { path: "extra-sections", element: <ExtraSections /> }, // Route for Extra Sections
          { path: "questions", element: <Questions /> }, // Route for Questions
          { path: "preview", element: <Preview /> }, // Route for Preview
        ],
      },
      { path: "view-applications/:jobId", element: <ViewApplicationJon /> },
      { path: "application/:id", element: <ViewAppSeeker /> },
      { path: "profile-company", element: <CompanyProfile /> }, // Add route for FirstSection
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