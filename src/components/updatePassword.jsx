import React, { useRef, useState } from 'react'
import { Form, Button, Alert, Modal } from 'react-bootstrap'
import { UserAuth } from './context/AuthContext'


export default function UpdatePassword(props) {


    const oldPassword = useRef()

    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const { resetPassword, currentUser, createCredential, reAuth } = UserAuth();


    async function handleSubmit(event) {

        event.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        if (oldPassword.current.value === passwordRef.current.value) {
            return setError("New password can't be same as old one!");
        }

        try {
            const credential = createCredential(currentUser.email, oldPassword.current.value);
            await reAuth(currentUser, credential);
            try {
                setError('')
                setLoading(true);
                await resetPassword(passwordRef.current.value);
                setSuccess("Password updated successfully")
            }
            catch (e2) {
                switch (e2.code) {
                    case 'auth/weak-password': {
                        setError('Weak password')
                        break;
                    }
                    default: {
                        setError("An error occurred while updating new password")
                    }
                }
                setLoading(false);
            }
        }
        catch (e1) {
            switch (e1.code) {
                case 'auth/wrong-password': {
                    setError('Wrong password please enter your current password')
                    break;
                }
                default: {
                    setError("An error occurred while verifying current password")
                }
            }
            setLoading(false);
        }
    }

    return (
        <Modal centered show={props.show} onHide={() => {
            props.handleClose()
            setError('')
        }}>
            <Modal.Header closeButton>
                <Modal.Title>Update Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="w-100">
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {success && <Alert variant='success'>{success}</Alert>}
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
            </Modal.Body>
        </Modal>

    )
}


