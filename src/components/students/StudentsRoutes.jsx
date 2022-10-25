import { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AuthorizedStudent({ children }) {

    const { currentUser, checkIfTeacher } = UserAuth()
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('')
    useEffect(() => {
        if (currentUser?.uid)
            checkIfTeacher(currentUser?.uid)
                .then(res => {
                    if (res)
                        setUser('teacher')
                    else
                        setUser('student')
                })
                .catch(e => {

                })
                .finally(() => {
                    setLoading(true);
                })
    }, [currentUser?.uid]);

    if (loading) {
        if (user === 'student')
            return children
        return <Navigate to='/teacher-profile' />
    }

}
