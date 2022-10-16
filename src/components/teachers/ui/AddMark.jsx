import { Row, Col, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { useState, useRef } from 'react'
import { UserAuth } from '../../context/AuthContext.jsx';

export default function AddMark(props) {

    const emailRef = useRef()
    const assignmentRef = useRef()
    const markRef = useRef()
    const outOfRef = useRef()

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false);

    const { addNewMark } = UserAuth()

    const handleSubmit = (e) => {

        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (!assignmentRef.current.value.length) {
            setLoading(false)
            return setError('Assignment name invalid, please provide a name.')
        }

        if (emailRef.current.value.length < 5) {
            setLoading(false)
            return setError('Email invalid.')
        }

        if (!props.studentEmails.includes(emailRef.current.value)) {
            setLoading(false)
            return setError('No student found.')
        }

        if (markRef.current.value < 0) {
            setLoading(false)
            return setError('Invalid, Marks cant be negative.')
        }

        if (outOfRef.current.value < 1) {
            setLoading(false)
            return setError('Invalid, Marks should be at least out of 1.')
        }

        if (parseInt(markRef.current.value) > parseInt(outOfRef.current.value)) {
            setLoading(false)
            return setError('Invalid, Mark cant be greater than 100%.')
        }

        const data = {
            studentEmail: emailRef.current.value,
            mark: {
                assignment: assignmentRef.current.value.trim(),
                mark: `${markRef.current.value}/${outOfRef.current.value}`.trim(),
                percentage: (parseInt(markRef.current.value) / parseInt(outOfRef.current.value) * 100).toFixed(2).trim()
            }
        }

        addNewMark(data.studentEmail, data.mark)
            .then(() => {
                setSuccess('Mark Added Successfully')
                props.refreshStudentData()
            })
            .catch(() => {
                setError("Mark Couldn't be added")
            })
            .finally(() => {
                setLoading(false);
            })
    }


    return (
        <Card className='p-2 '>
            <Card.Body>
                <h2 className='text-center mb-4'>Add Grade</h2>
                {success && <Alert variant='success'>{success}</Alert>}
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '700px' }}>
                        <Form.Label>Student Email*</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>@</InputGroup.Text>
                            <Form.Control
                                type='email'
                                placeholder="Student Email"
                                aria-label="Student Email"
                                ref={emailRef}
                                autoComplete="email"
                                required />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='mb-4' style={{ maxWidth: '700px' }}>
                        <Form.Label>Assignment Name*</Form.Label>
                        <Form.Control
                            type='string'
                            placeholder="Assignment Name"
                            aria-label="Assignment Name"
                            ref={assignmentRef}
                            required />
                    </Form.Group>
                    <Row>
                        <Col lg={3} md={3} sm={4} xs={6}>
                            <Form.Group className='mb-4' style={{ maxWidth: '90px' }}>
                                <Form.Label>Mark*</Form.Label>
                                <Form.Control type='number' ref={markRef} placeholder="ex:3" required />
                            </Form.Group>
                        </Col>
                        <Col lg={3} md={3} sm={4} xs={6}>
                            <Form.Group className='mb-4' style={{ maxWidth: '90px' }}>
                                <Form.Label>Out of/ *</Form.Label>
                                <Form.Control type='number' placeholder="ex:10" ref={outOfRef} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className='text-center'>
                        <Button style={{ maxWidth: '200px' }} disabled={loading || props.refreshLoading} className='w-100 mt-1 mb-1 text-center' type='submit'>Submit</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}
