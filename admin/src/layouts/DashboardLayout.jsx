import React from 'react'
import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <div>
      sidebar
      navbar
      <Outlet/>
    </div>
  )
}

export default DashboardLayout
