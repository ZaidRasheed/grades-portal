import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

export default function useTeacher() {
    const { currentUser, logOut, getTeacherData, getAllStudents } = UserAuth()

    const navigate = useNavigate()

    const [teacher, setTeacher] = useState()
    const [students, setStudents] = useState([])

    // ! refresh student data
    const [refresh, setRefresh] = useState(true)
    const [refreshLoading, setRefreshLoading] = useState(false)

    const refreshStudentData = () => {
        setRefreshLoading(true)
        setRefresh((e) => {
            return !e
        })
    }

    const handleLogOut = () => {
        logOut()
        navigate('/')
    }

    // ! for getting teacher data
    useEffect(() => {
        if (currentUser?.email.length) {
            getTeacherData(currentUser.uid)
                .then((data => {
                    if (data.error) {
                        console.log('Error in fetching teacher data')
                    }
                    else {
                        setTeacher(data)
                    }
                }))
                .catch(() => {
                    console.log('Error in fetching teacher data')
                })
        }
    }, [currentUser?.email])

    // ! for getting students data 
    useEffect(() => {
        setRefreshLoading(true)
        getAllStudents()
            .then(studentsData => {
                setStudents(studentsData)
            })
            .catch(() => {
                console.log('Error in fetching students data')
            })
            .finally(() => {
                setRefreshLoading(false)
            })
    }, [refresh])


    return {
        refreshLoading,
        refreshStudentData,
        students,
        currentUser,
        teacher,
        handleLogOut
    }
}
