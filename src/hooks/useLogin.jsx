import { useState, useRef } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'

export default function useLogin(role) {
    const emailRef = useRef()
    const passwordRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { logIn } = UserAuth()

    const navigate = useNavigate()

    async function handleLogin(event) {
        event.preventDefault()
        setError('')
        setLoading(true)

        const email = emailRef.current.value.trim()
        const password = passwordRef.current.value

        if (password < 6) {
            setLoading(false)
            return setError('Please provide a valid Password.')
        }
        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!regEmail.test(email.trim())) {
            setLoading(false)
            return setError('Please provide a valid Email.')
        }
        try {
            await logIn(email.trim(), password.trim())
            role === 'student' ? navigate('/student-profile') : navigate('/teacher-profile')
        }
        catch (error) {
            switch (error.code) {
                case 'auth/user-not-found': {
                    setError(`A username with this email doesn't exist, try signing up instead.`)
                    break
                }
                case 'auth/wrong-password': {
                    setError('Wrong password please try again.')
                    break
                }
                case 'auth/too-many-requests': {
                    setError('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.')
                    break
                }
                case 'auth/user-disabled': {
                    setError('Account has been disabled.')
                    break
                }
                default: {
                    setError('Failed to login.')
                }
            }
            setLoading(false)
        }
    }

    const alert = <>
        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
    </>



    return {
        emailRef,
        passwordRef,
        error,
        loading,
        handleLogin,
        alert
    }
}
