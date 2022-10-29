import { useRef, useState } from 'react'
import { Container, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const { logIn } = UserAuth();

    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault();

        setError('')
        setLoading(true);

        if (passwordRef.current.value.length < 6) {
            setLoading(false);
            return setError('Please provide a valid Password.');
        }
        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!regEmail.test(emailRef.current.value.trim())) {
            setLoading(false);
            return setError('Please provide a valid Email.');
        }
        try {
            await logIn(emailRef.current.value.trim(), passwordRef.current.value.trim());
            navigate('/student-profile')
        }
        catch (error) {
            switch (error.code) {
                case 'auth/user-not-found': {
                    setError(`A username with this email doesn't exist, try signing up instead.`)
                    break;
                }
                case 'auth/wrong-password': {
                    setError('Wrong password please try again.')
                    break;
                }
                case 'auth/too-many-requests': {
                    setError('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.')
                    break;
                }
                default: {
                    setError('Failed to login.')
                }
            }
            setLoading(false);
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
                    Forgot password? <Link to='/resetPassword'>Reset</Link>
                </div>
                <div className="w-100 text-center mt-2">
                    Go back? <Link to='/'>Home</Link>
                </div>
            </div>
        </Container>

    )
}
