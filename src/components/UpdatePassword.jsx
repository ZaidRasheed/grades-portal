import useUpdatePassword from '../hooks/useUpdatePassword'
import { Form, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function UpdatePassword() {

    const {
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
    } = useUpdatePassword()

    return (
        <div className="w-100 text-center mt-3">
            <Button
                variant="link"
                onClick={handleShowModal}
            >Update Password?</Button>
            <Modal centered show={show} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100">

                        {errorAlert}
                        {successAlert}

                        <Form onSubmit={handleUpdatePassword}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Old Password</Form.Label>
                                <Form.Control type='password' ref={oldPasswordRef} autoComplete='current-password' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type='password' ref={newPasswordRef} autoComplete='current-password' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control type='password' ref={passwordConfirmRef} autoComplete='current-password' required />
                            </Form.Group>
                            <Button disabled={loading} className='w-100 mt-3 mb-3' type='submit'> Submit</Button>
                        </Form>
                    </div>
                    <div className="w-100 text-center mt-2">
                        Forgot password? <Link to='/reset-password'>Reset</Link>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}


