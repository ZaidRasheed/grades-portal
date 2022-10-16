import { Navigate, Outlet } from "react-router-dom"
import { UserAuth } from "../context/AuthContext.jsx";


export default function TeacherRoutes() {

    const { currentUser, checkIfTeacher } = UserAuth()
    const email = currentUser?.email
    const isTeacher = async () => {
        return await checkIfTeacher(email);
    }
    const teacher = isTeacher();
    console.log(teacher)
    return (
        teacher ? <Outlet /> : <Navigate to='/student-profile' />

    )
}
