import { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AuthorizedTeacher({ children }) {
    const { currentUser, checkIfTeacherOrStudent } = UserAuth()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState('')

    useEffect(() => {
        if (currentUser?.uid)
            checkIfTeacherOrStudent(currentUser?.uid)
                .then(res => {
                    if (res.state) {
                        if (res.role === 'teacher')
                            setUser('teacher')
                    }
                    else {
                        logOut()
                    }
                })
                .catch(e => {

                })
                .finally(() => {
                    setLoading(true)
                })
    }, [currentUser?.uid])

    if (loading) {
        if (user === 'teacher')
            return children
        return <Navigate to='/student-profile' />
    }

}
