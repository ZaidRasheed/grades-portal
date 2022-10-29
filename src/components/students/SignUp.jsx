import { useRef, useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

export default function Signup() {
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const { createStudentAccount } = UserAuth();

    const navigate = useNavigate()

    function handleSubmit(event) {

        event.preventDefault();
        setLoading(true)

        if (passwordRef.current.value.length < 6) {
            setLoading(false)
            return setError('Weak Password.');
        }

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setLoading(false)
            return setError('Passwords do not match.');
        }

        if (firstNameRef.current.value.length < 2 || lastNameRef.current.value.length < 2) {
            setLoading(false)
            return setError('Please provide valid first and last names.');
        }

        const regName = /^[a-zA-Z ]+$/;

        if (!regName.test(firstNameRef.current.value.trim()) || !regName.test(lastNameRef.current.value.trim())) {
            setLoading(false)
            return setError('First and Last name can only contain alphabetical values.');
        }

        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!regEmail.test(emailRef.current.value.trim())) {
            setLoading(false)
            return setError('Please provide a valid Email.');
        }

        let fullName = firstNameRef.current.value.trim() + ` ${lastNameRef.current.value.trim()}`;
        const studentData = {
            name: fullName,
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value
        }
        createStudentAccount(studentData)
            .then(resp => {
                if (resp.status === 'success') {
                    navigate('/student-profile')
                }
                else {
                    setLoading(false);
                    setError(resp.message)
                }
            }).catch(error => {
                setLoading(false)
                setError(error)
            })
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


