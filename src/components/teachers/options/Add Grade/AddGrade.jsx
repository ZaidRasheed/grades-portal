import { Row, Col, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { useState, useRef } from 'react'
import { UserAuth } from '../../../context/AuthContext';

export default function AddGrade(props) {
    const emailRef = useRef()
    const gradeRef = useRef()
    const subjectRef = useRef()
    const markRef = useRef()
    const totalRef = useRef()

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false);

    const { addNewGrade } = UserAuth()

    const handleSubmit = (e) => {

        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        const grade = {
            name: gradeRef.current?.value,
            mark: markRef.current?.value,
            total: totalRef.current?.value,
            subject: subjectRef.current?.value
        }

        addNewGrade(grade, emailRef?.current?.value, props.students)
            .then((res) => {
                if (res.status === 'success') {
                    setSuccess(res.message)
                    props.refreshStudentData()
                }
                else
                    setError(res.message)
            })
            .catch((e) => {
                setError("Grade Couldn't be added")
            })
            .finally(() => {
                setLoading(false);
            })
    }


    return (
        <Card className='p-2 mb-3'>
            <Card.Body>
                <h2 className='text-center mb-4'>Add Grade</h2>
                {success && <Alert variant='success' onClose={() => setSuccess('')} dismissible>{success}</Alert>}
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '900px' }}>
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
                    <Form.Group className='mb-4' style={{ maxWidth: '900px' }}>
                        <Form.Label>Grade Name*</Form.Label>
                        <Form.Control
                            type='string'
                            placeholder="Grade Name"
                            aria-label="Grade Name"
                            ref={gradeRef}
                            required />
                    </Form.Group>
                    <Form.Group className='mb-4' style={{ maxWidth: '900px' }}>
                        <Form.Label>Subject*</Form.Label>
                        <Form.Control
                            type='string'
                            placeholder="Subject"
                            aria-label="Subject"
                            ref={subjectRef}
                            required />
                    </Form.Group>
                    <Row>
                        <Col lg={3} md={3} sm={4} xs={6}>
                            <Form.Group className='mb-4' style={{ maxWidth: '150px' }}>
                                <Form.Label>Grade*</Form.Label>
                                <Form.Control type='number' ref={markRef} placeholder="ex:3" required />
                            </Form.Group>
                        </Col>
                        <Col lg={3} md={3} sm={4} xs={6}>
                            <Form.Group className='mb-4' style={{ maxWidth: '150px' }}>
                                <Form.Label>/Total *</Form.Label>
                                <Form.Control type='number' placeholder="ex:10" ref={totalRef} required />
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
