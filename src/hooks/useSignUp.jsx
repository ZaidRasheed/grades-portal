import { useState, useRef } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'

export default function useSignUp() {
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { createStudentAccount } = UserAuth()

    const navigate = useNavigate()

    async function handleSignUp(event) {
        event.preventDefault()
        setError('')
        setLoading(true)

        const email = emailRef.current.value.trim()
        const password = passwordRef.current.value
        const passwordConfirm = passwordConfirmRef.current.value
        const firstName = firstNameRef.current.value.trim()
        const lastName = lastNameRef.current.value.trim()

        if (password.length < 6) {
            setLoading(false)
            return setError('Weak Password.')
        }

        if (password !== passwordConfirm) {
            setLoading(false)
            return setError('Passwords do not match.')
        }

        if (firstName.length < 2 || lastName.length < 2) {
            setLoading(false)
            return setError('Please provide valid first and last names.')
        }

        const regName = /^[a-zA-Z ]+$/

        if (!regName.test(firstName.trim()) || !regName.test(lastName.trim())) {
            setLoading(false)
            return setError('First and Last name can only contain alphabetical values.')
        }

        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!regEmail.test(email.trim())) {
            setLoading(false)
            return setError('Please provide a valid Email.')
        }

        let fullName = firstName.trim() + ` ${lastName.trim()}`
        const studentData = {
            name: fullName,
            email: email.trim(),
            password: password
        }
        try {
            const res = await createStudentAccount(studentData)
            if (res.status === 'success') {
                navigate('/student-profile')
            }
            else {
                setLoading(false)
                setError(res.message)
            }
        }
        catch (error) {
            setLoading(false)
            setError(error)
        }
    }

    const alert = <>
        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
    </>

    return {
        firstNameRef,
        lastNameRef,
        emailRef,
        passwordRef,
        passwordConfirmRef,
        loading,
        handleSignUp,
        alert
    }
}
