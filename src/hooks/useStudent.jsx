import { useEffect, useState, useMemo } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function useStudent() {
    const [student, setStudent] = useState()
    const [grades, setGrades] = useState([])
    const [option, setOption] = useState('All Grades')

    // refresh student data
    const [refresh, setRefresh] = useState(true)
    const [refreshLoading, setRefreshLoading] = useState(false)

    const { currentUser, logOut, getStudentData } = UserAuth()

    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser?.uid) {
            getStudentData(currentUser?.uid)
                .then((student) => {
                    if (student.exists()) {
                        setStudent(student.data())
                        setGrades(student.data().grades)
                    }
                })
                .catch((error) => {

                })
                .finally(() => {
                    setRefreshLoading(false)
                })
        }
    }, [currentUser?.uid, refresh])

    const handleLogOut = () => {
        logOut()
        navigate('/')
    }

    const handleRefresh = () => {
        setRefreshLoading(true)

        setRefresh((e) => {
            return !e
        })
    }

    const subjects = useMemo(() => {
        const subjects = []
        grades.forEach(grade => {
            if (!subjects.includes(grade.subject))
                subjects.push(grade.subject)
        })
        return subjects
    }, [grades.length])

    return {
        student,
        grades,
        option,
        subjects,
        handleRefresh,
        refreshLoading,
        handleLogOut,
        setOption
    }
}
