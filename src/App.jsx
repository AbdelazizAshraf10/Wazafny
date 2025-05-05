import { AuthProvider } from "./Contexts/Authenticate";
import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { LoadingProvider, useLoading } from "./Contexts/LoadingContext";

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
import EmailConfirm from "./components/EmailConfirmation/EmailConfirm";
import CompanyNav from "./components/home/NavIcons/company-nav";
import JopsPage from "./components/home/jobs/JopsPage";
import CompanyJobs from "./components/home/companyjobs/CompanyJobs";
import Apply from "./components/home/apply/apply";
import CompanyOverview from "./components/home/companyjobs/CompanyOverview";
import ViewApplications from "./components/home/ViewApplications/ViewApplications";
import JobTilteLink from "./components/Dashboard-Company/JobTilteLink";
import SeekerProfile from "./components/Dashboard-Company/profile-seeker/SeekerProfile";
import ProtectedRoute from "./Contexts/ProtectedRoute";

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
      { path: "EmailConfirm", element: <EmailConfirm /> },
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
  // Protected Seeker routes (only for seekers)
  {
    path: "/seeker",
    element: <ProtectedRoute allowedRole="Seeker"><CompanyNav /></ProtectedRoute>,
    children: [
      { path: "", element: <Navigate to="JopsPage" replace /> },
      { path: "JopsPage", element: <JopsPage /> },
      { path: "JopsPage/:id", element: <JopsPage /> },
      { path: "companypage", element: <CompanyJobs /> },
      { path: "companyOverview", element: <CompanyOverview /> },
      { path: "companyOverview/:companyId", element: <CompanyOverview /> },
      { path: "profile", element: <UserProfile /> },
      { path: "Applications", element: <ViewApplications /> },
      { path: "apply", element: <Apply /> },
      { path: "apply/:jobId", element: <Apply /> },
    ],
  },
  // Protected Dashboard routes (only for companies)
  {
    path: "/Dashboard",
    element: <ProtectedRoute allowedRole="Company"><Dashboard /></ProtectedRoute>,
    children: [
      { path: "", element: <Navigate to="Overview" replace /> },
      { path: "Overview", element: <DashboardContent /> },
      { path: "JobOverview/:jobId", element: <JobTilteLink /> },
      { path: "SeekerApplicant/:seekerId", element: <SeekerProfile /> },
      {
        path: "Jobpost",
        element: <Jobpost />,
        children: [
          { path: "basic-info", element: <BasicInfo /> },
          { path: "skills", element: <Skills /> },
          { path: "extra-sections", element: <ExtraSections /> },
          { path: "questions", element: <Questions /> },
          { path: "preview", element: <Preview /> },
          {
            path: ":jobId",
            children: [
              { path: "", element: <BasicInfo /> },
              { path: "basic-info", element: <BasicInfo /> },
              { path: "skills", element: <Skills /> },
              { path: "extra-sections", element: <ExtraSections /> },
              { path: "questions", element: <Questions /> },
              { path: "preview", element: <Preview /> },
            ],
          },
        ],
      },
      { path: "view-applications/:jobId", element: <ViewApplicationJon /> },
      { path: "application/:id", element: <ViewAppSeeker /> },
      { path: "profile-company", element: <CompanyProfile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <PropagateLoader
            color="#6A0DAD"
            size={20}
            speedMultiplier={1.2}
            cssOverride={{
              "@media (min-width: 768px)": {
                transform: "scale(1.2)",
              },
            }}
          />
        </div>
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;