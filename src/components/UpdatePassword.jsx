import { useRef, useState } from 'react'
import { Form, Button, Alert, Modal } from 'react-bootstrap'
import { UserAuth } from './context/AuthContext'
import { Link } from 'react-router-dom'
import { updatePassword } from 'firebase/auth';

export default function UpdatePassword() {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setError('');
        setSuccess('');
        setLoading(false);
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const oldPassword = useRef()

    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const { resetPassword } = UserAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true)

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setLoading(false)
            return setError('Passwords do not match.');
        }

        if (oldPassword.current.value === passwordRef.current.value) {
            setLoading(false)
            return setError("New password can't be the same as the old one.");
        }
        if (passwordRef.current.value.length < 6) {
            setLoading(false)
            return setError('Weak Password.');
        }
        resetPassword(oldPassword.current.value, passwordRef.current.value)
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

    return (
        <div className="w-100 text-center mt-3">
            <Button
                variant="link"
                onClick={handleShow}>
                Update Password?
            </Button>
            <Modal centered show={show} onHide={() => {
                handleClose()
                setError('')
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100">
                        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                        {success && <Alert variant='success' onClose={() => setSuccess('')} dismissible>{success}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Old Password</Form.Label>
                                <Form.Control type='password' ref={oldPassword} autoComplete='current-password' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type='password' ref={passwordRef} autoComplete='current-password' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control type='password' ref={passwordConfirmRef} autoComplete='current-password' required />
                            </Form.Group>
                            <Button disabled={loading} className='w-100 mt-3 mb-3' type='submit'> Submit</Button>
                        </Form>
                    </div>
                    <div className="w-100 text-center mt-2">
                        Forgot password? <Link to='/resetPassword'>Reset</Link>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}


