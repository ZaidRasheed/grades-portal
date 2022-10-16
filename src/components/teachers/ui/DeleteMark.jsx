import { Row, Col, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'
import { useState, useRef, useEffect } from 'react'
import { UserAuth } from '../../context/AuthContext'
export default function Search(props) {

    const emailRef = useRef()
    const assignmentRef = useRef()

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false);

    const { deleteMark } = UserAuth();

    const [student, setStudent] = useState(null)

    const handleSubmit = async (e) => {

        e?.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (emailRef.current.value.length < 5) {
            setLoading(false)
            setStudent(null)
            return setError('Email invalid.')
        }

        if (!props.studentEmails.includes(emailRef.current.value.trim())) {
            setLoading(false)
            setStudent(null)
            return setError('No student found.')
        }

        for (let i = 0; i < props.students.length; i++) {
            if (props.students[i].email === emailRef.current.value.trim()) {
                if (assignmentRef.current.value.length) {
                    let marks = []
                    props.students[i].marks.forEach(mark => {
                        if (mark.assignment.toLowerCase().includes(assignmentRef.current.value.trim().toLowerCase())) {
                            marks.push(mark)
                        }
                        if (marks.length) {
                            setError('')
                            setStudent({
                                email: props.students[i].email,
                                name: props.students[i].name,
                                marks: marks
                            })
                        }
                        else {
                            setStudent(null)
                            setError('No result found')
                        }
                    })
                }
                else
                    setStudent(props.students[i])
                break
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        if (emailRef.current.value.length) {
            for (let i = 0; i < props.students.length; i++) {
                if (props.students[i].email === emailRef.current.value.trim()) {
                    if (assignmentRef.current.value.length) {
                        let marks = []
                        props.students[i].marks.forEach(mark => {
                            if (mark.assignment.toLowerCase().includes(assignmentRef.current.value.trim().toLowerCase())) {
                                marks.push(mark)
                            }
                            if (marks.length) {
                                setStudent({
                                    email: props.students[i].email,
                                    name: props.students[i].name,
                                    marks: marks
                                })
                            }
                        })
                    }
                    else
                        setStudent(props.students[i])
                    break
                }
            }
        }
    }, [props.refreshLoading])

    const handleDeleteMark = (assignmentName) => {
        if (window.confirm(`Are you sure you want to delete assignment ${assignmentName} for student ${student.name}`)) {
            console.log(student.id)
            deleteMark(student.id, assignmentName.trim())
                .then((data) => {
                    if (data?.state === 'success') {
                        setSuccess("Mark Deleted Successfully")
                        console.log('entered')
                    }
                    else
                        setError("Error, Couldn't delete student mark")
                })
                .catch(e => {
                    setError("Error, Couldn't delete student mark")
                    console.log(e)
                })
                .finally(() => {
                    props.refreshStudentData();
                })
        }
    }

    return (
        <Card className='p-2 '>
            <Card.Body>
                <h2 className='text-center mb-4'>Delete Grade</h2>
                {success && <Alert variant='success'>{success}</Alert>}
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <h4 className='mb-3'>Search</h4>
                    <Row>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <Form.Group className='mb-4 ' style={{ maxWidth: '700px' }}>
                                <Form.Label>Student Email *</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                                    <Form.Control
                                        type='email'
                                        ref={emailRef}
                                        placeholder="Student Email"
                                        aria-label="Student Email"
                                        autoComplete="email"
                                        required />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <Form.Group className='mb-4' style={{ maxWidth: '700px' }}>
                                <Form.Label>Assignment Name</Form.Label>
                                <Form.Control
                                    type='string'
                                    ref={assignmentRef}
                                    placeholder="Assignment Name"
                                    aria-label="Assignment Name" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className='text-center'>
                        <Button
                            style={{ maxWidth: '200px' }}
                            disabled={loading || props.refreshLoading}
                            className='w-100 mt-1 mb-1 text-center'
                            type='submit'
                        >Search</Button>
                    </div>
                </Form>
                {student &&
                    <div className='overflow-scroll mt-4 mb-5' style={{ maxHeight: "50vh" }}>
                        <h2>{student?.name}</h2>
                        <h4 className='mb-3'>{student?.email}</h4>

                        {student.marks.length ? <div className='w-100' style={{ display: 'block' }}>
                            <table className="table h-25 table-striped">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Assignment </th>
                                        <th scope="col">Mark</th>
                                        <th className='text-center' scope="col">Percentage</th>
                                        <th className='text-center' scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.marks.map((e, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <th scope="row">{e.assignment}</th>
                                                <td>{e.mark}</td>
                                                <td className='text-center'>{e.percentage}%</td>
                                                <th className='text-center'><Button
                                                    variant="outline-danger"
                                                    className='btn'
                                                    onClick={() => {
                                                        handleDeleteMark(e.assignment);
                                                    }}
                                                >Delete &times;</Button></th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                            : <h3 className='text-center text-danger'>No marks yet</h3>}
                    </div>
                }
            </Card.Body>
        </Card >
    )
}
