import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MainHeader from '../components/layout/MainHeader'
import useLogin from '../hooks/useLogin'

export default function Login() {
    const { emailRef, passwordRef, alert, loading, handleLogin } = useLogin('teacher')

    return (
        <><MainHeader />
            <Container
                className="d-flex mt-5 justify-content-center"
                style={{ minHeight: "100vh" }}
            >
                <div className="w-100" style={{ maxWidth: "450px" }}>
                    <Card className='p-2'>
                        <Card.Body>
                            <h2 className='text-center mb-4'>Teacher Login</h2>
                            {alert}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className='mb-3'>
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
                        Forgot password? <Link to='/reset-password'>Reset</Link>
                    </div>
                </div>
            </Container>
        </>
    )
}
