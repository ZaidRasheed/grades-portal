import { useState, useRef } from 'react'
import { UserAuth } from '../context/AuthContext'

export default function useResetPassword() {
    const emailRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    const { sendResetPasswordLink } = UserAuth()

    const resetError = () => {
        setError('')
    }
    const resetSuccess = () => {
        setSuccess('')
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)

        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailRef?.current.value || !regEmail.test(emailRef.current.value)) {
            setLoading(false)
            return setError('Invalid email')
        }

        try {
            setError('')
            await sendResetPasswordLink(emailRef.current.value)
            setSuccess("Email sent please check inbox")
        }
        catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('User not found, there is no account with the provided email.')
                    break
                default:
                    setError('Unable to send reset link to provided email.')
            }
            setLoading(false)
        }
    }
    return {
        emailRef,
        error,
        loading,
        success,
        handleSubmit,
        resetError,
        resetSuccess
    }
}
