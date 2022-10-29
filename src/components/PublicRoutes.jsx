import { Navigate, Outlet } from "react-router-dom"
import { UserAuth } from "./context/AuthContext";

export default function PublicRoutes() {
    const { currentUser } = UserAuth()
    return (
        currentUser === null ? <Outlet /> : <Navigate to='/student-profile' />
    )
}

