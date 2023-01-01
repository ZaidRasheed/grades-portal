import useDeleteAccount from '../../hooks/useDeleteAccount'
import { Form, Button, Modal } from 'react-bootstrap'

export default function DeleteAccount() {

    const { currentPassword,
        show,
        alert,
        loading,
        handleCloseModal,
        handleShowModal,
        handleDeleteAccount } = useDeleteAccount()

    return (
        <div className="w-100 text-center">
            <Button variant="link" onClick={handleShowModal}>Delete Account?</Button>
            <Modal centered show={show} onHide={handleCloseModal}>
                <Modal.Header closeButton >
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100">
                        {alert}
                        <Form onSubmit={handleDeleteAccount}>
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


