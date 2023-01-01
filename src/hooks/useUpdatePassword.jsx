import { useRef, useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { Alert } from 'react-bootstrap'

export default function useUpdatePassword() {
    const oldPasswordRef = useRef()

    const newPasswordRef = useRef()
    const passwordConfirmRef = useRef()

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)

    const { resetPassword } = UserAuth()

    const handleCloseModal = () => {
        setSuccess('')
        setError('')
        setLoading(false)
        setShow(false)
    }
    const handleShowModal = () => setShow(true)

    function handleUpdatePassword(event) {
        event.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (newPasswordRef.current.value !== passwordConfirmRef.current.value) {
            setLoading(false)
            return setError('Passwords do not match.')
        }

        if (oldPasswordRef.current.value === newPasswordRef.current.value) {
            setLoading(false)
            return setError("New password can't be the same as the old one.")
        }
        if (newPasswordRef.current.value.length < 6) {
            setLoading(false)
            return setError('Weak Password.')
        }
        resetPassword(oldPasswordRef.current.value, newPasswordRef.current.value)
            .then((res) => {
                if (res.status === 'success') {
                    setSuccess(res.message)
                }
                else {
                    setLoading(false)
                    setError(res.message)
                }
            })
            .catch(error => {
                setLoading(false)
                setError("Error, Couldn't Update password ")
            })
    }

    const successAlert = <>
        {success && <Alert variant='success' onClose={() => setSuccess('')} dismissible>{success}</Alert>}
    </>

    const errorAlert = <>
        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
    </>

    return {
        oldPasswordRef,
        newPasswordRef,
        passwordConfirmRef,
        successAlert,
        errorAlert,
        loading,
        show,
        handleShowModal,
        handleCloseModal,
        handleUpdatePassword
    }
}
