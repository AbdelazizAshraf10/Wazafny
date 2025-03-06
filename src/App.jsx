

// import './App.css'
import Register from './components/Register/Register'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login/Login'
import Layout from './components/Layout/Layout'
import NotFound from './components/NotFound/NotFound'
import Company from './components/home/company'
import Welcome from './components/home/welcome/welcome'

import ProfilePage from './components/home/NavIcons/PROFILE/profile/ProfilePage-1'


let x=createBrowserRouter([
  {path:"", element:<Layout/>,children:[
    {index:true,element:<Welcome/>},
    {path:"Register",element:<Register/>},
    {path:"Login",element:<Login/>},
    {path:"Jobs",element:<Company/>},
    {path:"Profile",element:<ProfilePage />},
    {path:"*",element:<NotFound/>},
  ]}
])
function App() {
  

  return (
   <RouterProvider router={x}></RouterProvider>
  )
}

export default App
