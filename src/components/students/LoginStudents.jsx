import { useRef } from 'react'
import { Container, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import useLogin from '../../hooks/useLogin'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()

    const { error, loading, handleLogin, status } = useLogin()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        const email = emailRef.current.value.trim()
        const password = passwordRef.current.value

        await handleLogin(email, password)
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
                        <h2 className='text-center mb-4'>Student Login</h2>
                        {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                        <Form onSubmit={handleSubmit} >
                            <Form.Group className='mb-3' >
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>@</InputGroup.Text>
                                    <Form.Control
                                        type='email'
                                        ref={emailRef}
                                        autoComplete="email"
                                        placeholder="Email"
                                        aria-label="Email"
                                        required />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>*</InputGroup.Text>
                                    <Form.Control
                                        type='password'
                                        ref={passwordRef}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        aria-label="Password"
                                        required />
                                </InputGroup>
                            </Form.Group>
                            <Button disabled={loading} className='w-100 mt-3 mb-3' type='submit'>Login</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    Don't have an account? <Link to='/signup'>Sign Up</Link>
                </div>
                <div className="w-100 text-center mt-2">
                    Forgot password? <Link to='/reset-password'>Reset</Link>
                </div>
                <div className="w-100 text-center mt-2">
                    Go back? <Link to='/'>Home</Link>
                </div>
            </div>
        </Container>

    )
}
