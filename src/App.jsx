
import { AuthProvider } from "./Contexts/Authenticate";
import "./App.css";
import Register from "./components/Register/Register";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

let x = createBrowserRouter([
  { index: true, element: <Welcome /> },
  { path: "Home", element: <Company /> },
  { path: "profile", element: <UserProfile /> },
  { path: "Dashboard", element: <Dashboard /> },

  {
    path: "",
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
]);
function App() {
  

  return (
    <AuthProvider>
      <RouterProvider router={x} />
    </AuthProvider>
  );
}

export default App;
