import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import './Layout.scss'

const Layout = function () {
  return <div id='layout'>
    <TopNav />
    <Outlet />
  </div>
}

export default Layout
