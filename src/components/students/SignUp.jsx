import { useRef } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import useSignUp from '../../hooks/useSignUp'

export default function Signup() {
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const { error, loading, handleSignUp, status } = useSignUp()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault();

        const email = emailRef.current.value.trim()
        const password = passwordRef.current.value
        const passwordConfirm = passwordConfirmRef.current.value
        const firstName = firstNameRef.current.value.trim()
        const lastName = lastNameRef.current.value.trim()

        console.table(password, passwordConfirm)

        await handleSignUp(email, password, passwordConfirm, firstName, lastName)
        if (status === 'success') navigate('/student-profile')
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "450px" }}>
                <Card className='p-2'>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Sign Up</h2>
                        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type='name' ref={firstNameRef} autoComplete='username' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type='name' ref={lastNameRef} autoComplete='username' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' ref={emailRef} autoComplete='email' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' ref={passwordRef} autoComplete='current-password' required />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type='password' ref={passwordConfirmRef} autoComplete='current-password' required />
                            </Form.Group>
                            <Button disabled={loading} className='w-100 mt-3 mb-3' type='submit'> Sign Up</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    Already have an account? <Link to='/student-login'>Log In</Link>
                </div>
            </div>
        </Container>
    )
}


