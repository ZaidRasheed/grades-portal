import { useState, useRef } from 'react'
import { UserAuth } from '../../context/AuthContext'
import { Alert } from 'react-bootstrap'

export default function useAddGrade(students, refreshStudentData) {
    const emailRef = useRef()
    const gradeRef = useRef()
    const subjectRef = useRef()
    const markRef = useRef()
    const totalRef = useRef()

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const { addNewGrade } = UserAuth()

    const handleAddGrade = (e) => {

        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        const grade = {
            name: gradeRef.current?.value,
            mark: markRef.current?.value,
            total: totalRef.current?.value,
            subject: subjectRef.current?.value
        }

        addNewGrade(grade, emailRef?.current?.value, students)
            .then((res) => {
                if (res.status === 'success') {
                    setSuccess(res.message)
                    refreshStudentData()
                }
                else
                    setError(res.message)
            })
            .catch((e) => {
                setError("Grade Couldn't be added")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const SuccessAlert = <>
        {success && <Alert variant='success' onClose={() => setSuccess('')} dismissible>{success}</Alert>}
    </>
    const ErrorAlert = <>
        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
    </>

    return {
        emailRef,
        gradeRef,
        subjectRef,
        markRef,
        totalRef,
        loading,
        handleAddGrade,
        SuccessAlert,
        ErrorAlert
    }
}
