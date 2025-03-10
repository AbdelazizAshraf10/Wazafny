
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
    <Navbar/>
    <div className="container mx-auto">
      <Outlet/>
    </div>
    </>
  )
}
