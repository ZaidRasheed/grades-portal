import { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AuthorizedStudent({ children }) {
    const { currentUser, checkIfTeacherOrStudent, logOut } = UserAuth()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState('')

    useEffect(() => {
        if (currentUser?.uid)
            checkIfTeacherOrStudent(currentUser?.uid)
                .then(res => {
                    if (res.state) {
                        if (res.role === 'student')
                            setUser('student')
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
        if (user === 'student')
            return children
        return <Navigate to='/teacher-profile' />
    }

}
