import { Container, Form, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useSignUp from '../hooks/useSignUp'
import MainHeader from '../components/layout/MainHeader'

export default function Signup() {
    const {
        firstNameRef,
        lastNameRef,
        emailRef,
        passwordRef,
        passwordConfirmRef,
        alert,
        loading,
        handleSignUp } = useSignUp()

    return (
        <><MainHeader />
            <Container
                className="d-flex mt-5 justify-content-center"
                style={{ minHeight: "80vh" }}
            >
                <div className="w-100 mb-3" style={{ maxWidth: "450px" }}>
                    <Card className='p-2'>
                        <Card.Body>
                            <h2 className='text-center mb-4'>Sign Up</h2>

                            {alert}

                            <Form onSubmit={handleSignUp}>
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
        </>
    )
}


