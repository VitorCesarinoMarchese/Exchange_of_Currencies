import { Navigate, Outlet } from 'react-router'

export const PrivateRoutes = () => {

return (
    localStorage.getItem("access_token") ? <Outlet/> : <Navigate to='/login'/>
  )
}