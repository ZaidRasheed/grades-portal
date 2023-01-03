import { useState, useRef, useEffect } from 'react'

export default function useDeleteEditGrade(students, refreshLoading) {
    const emailRef = useRef()
    const assignmentRef = useRef()
    const subjectRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [student, setStudent] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    }
    const closeEditModal = () => {
        setShowEditModal(false)
    };

    const [deleteData, setDeleteData] = useState({})
    const [editData, setEditData] = useState({})

    const handleDeleteMark = (gradeName, subject) => {
        setShowDeleteModal(true);
        setDeleteData({
            student: student,
            gradeName: gradeName,
            subject: subject
        })
    }
    const handleEditGrade = (grade) => {
        setEditData(grade)
        setShowEditModal(true);
    }

    const handleSearch = (e) => {
        e?.preventDefault()
        setError('')
        setLoading(true)

        if (emailRef.current.value.length < 5) {
            setLoading(false)
            setStudent(null)
            return setError('Email invalid.')
        }

        const index = students.findIndex(student => {
            return student.email === emailRef.current.value.trim()
        })

        if (students[index]) {
            if (!assignmentRef.current.value && !subjectRef.current.value) {
                setStudent(students[index])
            }
            else {
                let grades = students[index].grades
                if (assignmentRef?.current?.value) {
                    grades = grades.filter(grade => {
                        return grade.name.toLowerCase().includes(assignmentRef.current.value.trim().toLowerCase())
                    })
                }
                if (subjectRef?.current?.value) {
                    grades = grades.filter(grade => {
                        return grade.subject.toLowerCase().includes(subjectRef.current.value.trim().toLowerCase())
                    })
                }
                if (!grades.length) {
                    setStudent(null)
                    setError('No result found')
                }
                else {
                    setStudent({
                        email: students[index].email,
                        name: students[index].name,
                        grades: grades,
                        id: students[index].id
                    })
                }
            }
        }
        else {
            setStudent(null)
            setError('No student found.')
        }
        setLoading(false)
    }

    useEffect(() => {
        if (emailRef?.current?.value)
            handleSearch()
    }, [refreshLoading]);

    const ErrorAlert = <>
        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
    </>

    return {
        emailRef,
        assignmentRef,
        subjectRef,
        ErrorAlert,
        loading,
        student,
        showDeleteModal,
        showEditModal,
        closeDeleteModal,
        closeEditModal,
        deleteData,
        editData,
        handleDeleteMark,
        handleEditGrade,
        handleSearch,
    }
}
