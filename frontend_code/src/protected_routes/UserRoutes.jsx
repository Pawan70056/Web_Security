import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const UserRoutes = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    //check user and isAdmin
    return user != null ? <Outlet />
        : <Navigate to={'/login'} />
}

export default UserRoutes