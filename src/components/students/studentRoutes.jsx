import { Navigate, Outlet } from "react-router-dom"
import { UserAuth } from "../context/AuthContext.jsx";


export default function StudentRoutes() {

    const { currentUser, checkIfTeacher } = UserAuth()
    const email = currentUser?.email
    const isTeacher = async () => {
        return await checkIfTeacher(email);
    }
    const student = !isTeacher();
    console.log(student)
    return (
        student ? <Navigate to='/teacher-profile' /> : <Outlet />
    )
}

