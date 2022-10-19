import React, { useRef, useState } from 'react'
import { Form, Button, Alert, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext.jsx'

export default function UpdateEmail(props) {

    const currentPassword = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const { deleteAccount, currentUser, createCredential, reAuth, deleteStudent } = UserAuth();

    const navigate = useNavigate()

    async function deleteUser() {
        try {
            const credential = createCredential(currentUser.email, currentPassword.current.value);
            await reAuth(currentUser, credential);
            try {
                const id = currentUser.uid
                setError('')
                setLoading(true);
                deleteStudent(id)
                    .then(res => {
                        if (res.state === 'success') {
                            try {
                                deleteAccount()
                                navigate('/grades_portal');
                            }
                            catch (e) {
                                setError("An error occurred while deleting account")
                                setLoading(false);
                            }
                        }
                        else {
                            setError("An error occurred while deleting account")
                        }
                    })
                    .catch(error => {
                        setError("An error occurred while deleting account")
                    })
            }
            catch (e2) {
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
                    break;
                }
            }
            setLoading(false);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        deleteUser();
    }


    return (
        <Modal centered show={props.show} onHide={() => {
            props.handleClose()
            setError('')
        }}>
            <Modal.Header closeButton >
                <Modal.Title>Delete Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className="w-100">
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3' >
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type='password' ref={currentPassword} autoComplete='current-password' required />
                        </Form.Group>
                        <Button disabled={loading} className='w-100 mt-3 mb-3' type='submit'>Submit</Button>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="w-100 text-center mt-2">
                    Note! This action is irreversible and all data will be lost permanently.
                </div>
            </Modal.Footer>
        </Modal>

    )
}


