import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { UserAuth } from '../context/AuthContext'

export default function useDeleteAccount() {
    const currentPassword = useRef()

    const [show, setShow] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCloseModal = () => {
        setShow(false)
        setError('')
    }
    const handleShowModal = () => setShow(true)

    const { deleteAccount } = UserAuth()

    const navigate = useNavigate()


    function handleDeleteAccount(event) {
        event.preventDefault()
        setLoading(true)

        if (currentPassword.current.value.length < 6) {
            setLoading(false)
            return setError('Invalid Password.')
        }
        deleteAccount(currentPassword.current.value)
            .then(res => {
                if (res.status === 'success') {
                    navigate('/')
                }
                else {
                    switch (res.message) {
                        case 'auth/wrong-password':
                            setError('Wrong password')
                            break
                        case 'auth/too-many-requests':
                            setError('Too many attempts to delete the account have failed please try again later.')
                            break
                        default:
                            setError('Account could not be deleted')
                    }
                    setLoading(false)
                }
            })
            .catch(error => {
                setLoading(false)
                setError("Account couldn't be deleted.")
            })
    }

    const alert = <>
        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
    </>
    return {
        currentPassword,
        show,
        alert,
        loading,
        handleCloseModal,
        handleShowModal,
        handleDeleteAccount
    }
}
