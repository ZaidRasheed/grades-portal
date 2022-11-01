import { useRef, useState } from 'react'
import { Form, Button, Alert, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

export default function DeleteAccount() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const currentPassword = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const { deleteAccount } = UserAuth();

    const navigate = useNavigate()


    function handleSubmit(event) {
        event.preventDefault();
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
                    setLoading(false)
                    setError(res.message)
                }
            })
            .catch(error => {
                setLoading(false)
                setError("Account couldn't be deleted.")
            })
    }


    return (
        <div className="w-100 text-center">
            <Button variant="link" onClick={handleShow}>
                Delete Account?
            </Button>
            <Modal centered show={show} onHide={() => {
                handleClose()
                setError('')
            }}>
                <Modal.Header closeButton >
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100">
                        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3' >
                                <Form.Label>Confirm Your Password</Form.Label>
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
        </div>
    )
}


