import { Row, Col, Form, Button, Card, InputGroup, Alert } from 'react-bootstrap'
import { useState, useRef, useEffect } from 'react'
import DeleteGradeModal from './DeleteGradeModal'
import EditGradeModal from './EditGradeModal'

export default function DeleteEditGrade(props) {
    const emailRef = useRef()
    const assignmentRef = useRef()
    const subjectRef = useRef()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [student, setStudent] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    }
    const closeEditModal = () => {
        setShowEditModal(false)
    };

    const [deleteData, setDeleteData] = useState({})
    const [editData, setEditData] = useState({})

    const handleDeleteMark = (gradeName, subject) => {
        setShowDeleteModal(true);
        setDeleteData({
            student: student,
            gradeName: gradeName,
            subject: subject
        })
    }
    const handleEditGrade = (grade) => {
        setEditData(grade)
        setShowEditModal(true);
    }

    const handleSearch = (e) => {
        e?.preventDefault()
        setError('')
        setLoading(true)

        if (emailRef.current.value.length < 5) {
            setLoading(false)
            setStudent(null)
            return setError('Email invalid.')
        }

        const index = props.students.findIndex(student => {
            return student.email === emailRef.current.value.trim()
        })

        if (props.students[index]) {
            if (!assignmentRef.current.value && !subjectRef.current.value) {
                setStudent(props.students[index])
            }
            else {
                let grades = props.students[index].grades
                if (assignmentRef?.current?.value) {
                    grades = grades.filter(grade => {
                        return grade.name.toLowerCase().includes(assignmentRef.current.value.trim().toLowerCase())
                    })
                }
                if (subjectRef?.current?.value) {
                    grades = grades.filter(grade => {
                        return grade.subject.toLowerCase().includes(subjectRef.current.value.trim().toLowerCase())
                    })
                }
                if (!grades.length) {
                    setStudent(null)
                    setError('No result found')
                }
                else {
                    setStudent({
                        email: props.students[index].email,
                        name: props.students[index].name,
                        grades: grades,
                        id: props.students[index].id
                    })
                }
            }
        }
        else {
            setStudent(null)
            setError('No student found.')
        }
        setLoading(false)
    }
    
    useEffect(() => {
        if (emailRef?.current?.value)
            handleSearch()
    }, [props.refreshLoading]);

    return (
        <>
            {showDeleteModal && <DeleteGradeModal
                showDeleteModal={showDeleteModal}
                closeDeleteModal={closeDeleteModal}
                refreshStudentData={props.refreshStudentData}
                data={deleteData}
            />}
            {showEditModal && <EditGradeModal
                showEditModal={showEditModal}
                closeEditModal={closeEditModal}
                refreshStudentData={props.refreshStudentData}
                oldGrade={editData}
                student={student}
            />}
            <Card className='p-2 mb-3'>
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                <Card.Body>
                    <h2 className='text-center mb-4'>Delete and Edit Grades</h2>
                    <Form onSubmit={handleSearch}>
                        <h4 className='mb-3'>Search</h4>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Form.Group className='mb-4 ' style={{ maxWidth: '900px' }}>
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
                                <Form.Group className='mb-4' style={{ maxWidth: '900px' }}>
                                    <Form.Label>Grade Name</Form.Label>
                                    <Form.Control
                                        type='string'
                                        ref={assignmentRef}
                                        placeholder="Grade Name"
                                        aria-label="Grade Name" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Form.Group className='mb-4' style={{ maxWidth: '900px' }}>
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control
                                        type='string'
                                        ref={subjectRef}
                                        placeholder="Subject"
                                        aria-label="Subject" />
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

                            {student.grades.length ? <div className='w-100' style={{ display: 'block' }}>
                                <table className="table h-25 table-striped">
                                    <thead className='table-dark'>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Subject</th>
                                            <th scope="col">Grade</th>
                                            <th className='text-center' scope="col">Percentage</th>
                                            <th className='text-center' scope="col">Edit</th>
                                            <th className='text-center' scope="col">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.grades.map((grade, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <th scope="row">{grade.name}</th>
                                                    <th scope="row">{grade.subject}</th>
                                                    <td>{grade.mark}/{grade.total}</td>
                                                    <td className='text-center'>{grade.percentage}%</td>
                                                    <th className='text-center'><Button
                                                        variant="outline-success"
                                                        className='btn'
                                                        onClick={() => {
                                                            handleEditGrade(grade);
                                                        }}
                                                    >Edit</Button></th>
                                                    <th className='text-center'><Button
                                                        variant="outline-danger"
                                                        className='btn'
                                                        onClick={() => {
                                                            handleDeleteMark(grade.name, grade.subject);
                                                        }}
                                                    >Delete &times;</Button></th>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                                : <h3 className='text-center text-danger'>No grades yet</h3>}
                        </div>
                    }
                </Card.Body>
            </Card >
        </>

    )
}
