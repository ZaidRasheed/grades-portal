import React, { useRef, useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext.jsx'


export default function Signup() {

    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const { signUp, addStudent } = UserAuth();

    const navigate = useNavigate()

    async function setUpUser() {
        let fullName = firstNameRef.current.value.trim() + ` ${lastNameRef.current.value.trim()}`;
        setError('')
        setLoading(false);

        signUp(emailRef.current.value.trim(), passwordRef.current.value.trim())
            .then(async (userCredential) => {
                try {
                    const student = {
                        name: fullName,
                        marks: [],
                        email: emailRef.current.value.trim(),
                        id: userCredential.user.uid
                    }
                    await addStudent(student, userCredential.user.uid)
                    console.log('added to db')
                    console.log('account created')
                    navigate('/student-profile')
                }
                catch (e) {
                    setLoading(false);
                }
            })
            .catch((error) => {
                switch (error.code) {
                    case 'auth/email-already-in-use': {
                        setError('Email is already in use')
                        break;
                    }
                    case 'auth/weak-password': {
                        setError('Weak Password')
                        break;
                    }
                    case 'cant update name try again': {
                        setError('cant update name try again')
                        break;
                    }
                    case 'auth/invalid-email':{
                        setError('Invalid email')
                        break;
                    }
                    default: {
                        console.log(error.code)
                        setError('Failed to create an account')
                    }
                        setLoading(false);
                }
            });
    }

    function handleSubmit(event) {

        event.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        if (passwordRef.current.value.length < 6) {
            return setError('Short Password');
        }

        if (firstNameRef.current.value.length < 2 || lastNameRef.current.value.length < 2) {
            return setError('Please provide first and last name');
        }
        setUpUser();
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
                        {error && <Alert variant='danger'>{error}</Alert>}
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
                    Already have an account? <Link to='/'>Log In</Link>
                </div>
            </div>
        </Container>
    )
}


