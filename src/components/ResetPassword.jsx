import { useState, useRef } from 'react'
import { UserAuth } from './context/AuthContext'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
export default function ResetPassword() {

    const emailRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('')

    const { sendResetPasswordLink } = UserAuth();


    async function handleSubmit(event) {

        event.preventDefault();
        setLoading(true);

        if (emailRef.current.value.length < 4) {
            setLoading(false);
            return setError('Invalid email')
        }

        try {
            setError('')
            await sendResetPasswordLink(emailRef.current.value);
            setSuccess("Email sent please check inbox")
        }
        catch {
            setLoading(false);
            setError('Failed to send link')
        }
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "450px" }}>
                <Card className='p-2'>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Reset Password</h2>
                        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                        {success && <Alert variant='success' onClose={() => setSuccess('')} dismissible>{success}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' ref={emailRef} autoComplete="email" required />
                                <p style={{ fontSize: "12px", marginTop: "5px" }}>Email might be in the spam folder</p>
                            </Form.Group>
                            <Button disabled={loading} className='w-100 mt-3 mb-3' type='submit'>Send Reset Link</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Link to='/'>Go back?</Link>
                </div>
            </div>
        </Container>
    )
}
