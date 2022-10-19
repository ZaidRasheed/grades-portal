import { Navigate, Outlet } from "react-router-dom"
import { UserAuth } from "./context/AuthContext";

export default function PrivateRoutes() {
    
    const { currentUser } = UserAuth()
    return (
        currentUser === null ? <Navigate to='/' /> : <Outlet />
    )
}

