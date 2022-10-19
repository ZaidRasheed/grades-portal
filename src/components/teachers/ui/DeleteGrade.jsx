import { Row, Col, Form, Button, Card, Alert, InputGroup, Modal } from 'react-bootstrap'
import { useState, useRef, useEffect } from 'react'
import { UserAuth } from '../../context/AuthContext'
export default function DeleteGrade(props) {

    const emailRef = useRef()
    const assignmentRef = useRef()

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false);

    const [modalError, setModalError] = useState('')
    const [modalSuccess, setModalSuccess] = useState('')
    const [modalLoading, setModalLoading] = useState(false);

    const { deleteGrade, editGrade } = UserAuth();

    const [student, setStudent] = useState(null)


    // ! for edit grade modal
    const [show, setShow] = useState(false);

    const closeModal = () => {
        setModalError('')
        setModalSuccess('')
        setModalLoading(false)
        setShow(false)
    };
    const showModal = (gradeName, gradeMark, gradeTotal) => {
        currentNameRef.current = gradeName
        currentMarkRef.current = gradeMark
        currentTotalRef.current = gradeTotal
        setShow(true)
    };

    // ! for editing the grade
    const newNameRef = useRef()
    const newMarkRef = useRef()
    const newTotalRef = useRef()

    const currentNameRef = useRef()
    const currentMarkRef = useRef()
    const currentTotalRef = useRef()

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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
                    let grades = []
                    props.students[i].grades.forEach(grade => {
                        if (grade.name.toLowerCase().includes(assignmentRef.current.value.trim().toLowerCase())) {
                            grades.push(grade)
                        }
                        if (grades.length) {
                            setError('')
                            setStudent({
                                email: props.students[i].email,
                                name: props.students[i].name,
                                grades: grades,
                                id: props.students[i].id
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
                        let grades = []
                        props.students[i].grades.forEach(grade => {
                            if (grade.name.toLowerCase().includes(assignmentRef.current.value.trim().toLowerCase())) {
                                grades.push(grade)
                            }
                            if (grades.length) {
                                setError('')
                                setStudent({
                                    email: props.students[i].email,
                                    name: props.students[i].name,
                                    grades: grades,
                                    id: props.students[i].id
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

    const handleDeleteMark = (gradeName) => {
        setError('')
        setError('')
        if (window.confirm(`Are you sure you want to delete grade ${gradeName} for student ${student.name}`)) {
            deleteGrade(student.id, gradeName)
                .then((data) => {
                    if (data?.state === 'success') {
                        setSuccess("Grade Deleted Successfully")
                    }
                    else
                        setError("Error, Couldn't Delete Student Grade")
                })
                .catch(e => {
                    setError("Error, Couldn't Delete Student Grade")
                    console.log(e)
                })
                .finally(() => {
                    props.refreshStudentData();
                })
        }
    }
    const handleEditGrade = (e) => {
        e.preventDefault()
        setModalError('')
        setModalSuccess('')
        setModalLoading(true)
        // console.log(currentMarkRef.current, currentNameRef.current, currentTotalRef.current)
        // console.log(newMarkRef.current.value, newNameRef.current.value, newTotalRef.current.value)
        let newGrade = {
            name: currentNameRef.current,
            mark: +currentMarkRef.current,
            total: +currentTotalRef.current,
            percentage: +((parseInt(currentMarkRef.current) / parseInt(currentTotalRef.current) * 100).toFixed(2))
        }
        // ! flags for knowing if data changed or not 
        let nameChanged = false;
        let markChanged = false;
        let totalChanged = false;

        if (newNameRef.current.value.length) {
            nameChanged = true;
            newGrade = {
                ...newGrade,
                name: capitalizeFirstLetter(newNameRef.current.value)
            }
        }
        if (newMarkRef.current.value.length) {
            markChanged = true;
            newGrade = {
                ...newGrade,
                mark: +newMarkRef.current.value
            }
        }
        if (newTotalRef.current.value.length) {
            totalChanged = true;
            newGrade = {
                ...newGrade,
                total: +newTotalRef.current.value
            }
        }

        if (+newGrade.mark < 0) {
            setModalLoading(false)
            return setModalError('Invalid, Marks cant be negative.')
        }

        if (+newGrade.total < 1) {
            setModalLoading(false)
            return setModalError('Invalid, Marks should be at least out of 1.')
        }

        if (+newGrade.mark > +newGrade.total) {
            setModalLoading(false)
            return setModalError('Invalid, Mark cant be greater than 100%.')
        }

        if (!nameChanged && (!markChanged && !totalChanged)) {
            setModalLoading(false)
            return setModalError('Please change values')
        }

        if (markChanged && totalChanged) {
            newGrade = {
                ...newGrade,
                percentage: +((parseInt(newMarkRef.current.value) / parseInt(newTotalRef.current.value) * 100).toFixed(2))
            }
        }
        else if (markChanged) {
            newGrade = {
                ...newGrade,
                percentage: +((parseInt(newMarkRef.current.value) / parseInt(currentTotalRef.current) * 100).toFixed(2))
            }
        }
        else if (totalChanged) {
            newGrade = {
                ...newGrade,
                percentage: +((parseInt(currentMarkRef.current) / parseInt(newTotalRef.current.value) * 100).toFixed(2))
            }
        }
        editGrade(student.id, currentNameRef.current, newGrade)
            .then((data) => {
                if (data?.state === 'success') {
                    setModalSuccess("Grade Updated Successfully")
                }
                else
                    setModalError("Error, Couldn't Update Grade Grade")
            })
            .catch(e => {
                setModalError("Error, Couldn't Update Grade Grade")
                console.log(e)
            })
            .finally(() => {
                props.refreshStudentData();
            })
    }

    return (
        <Card className='p-2 '>
            <Modal centered show={show} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Grade</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100">
                        {modalError && <Alert variant='danger'>{modalError}</Alert>}
                        {modalSuccess && <Alert variant='success'>{modalSuccess}</Alert>}
                        <Form onSubmit={handleEditGrade}>
                            <h1>{currentNameRef.current} Grade for :</h1>
                            <p className='display-6'><i> {student?.name}</i></p>
                            <h5>Mark: {currentMarkRef.current}/ {currentTotalRef.current}</h5>
                            <br />
                            <Form.Group className='mb-3'>
                                <Form.Label>New Grade Name</Form.Label>
                                <Form.Control type='string' ref={newNameRef} placeholder={currentNameRef.current} />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>New Mark</Form.Label>
                                <Form.Control type='number' ref={newMarkRef} placeholder={currentMarkRef.current} />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>New Total</Form.Label>
                                <Form.Control type='number' ref={newTotalRef} placeholder={currentTotalRef.current} />
                            </Form.Group>
                            <Button disabled={modalLoading} className='w-100 mt-3 mb-3' type='submit'> Submit</Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
            <Card.Body>
                <h2 className='text-center mb-4'>Delete and Edit Grades</h2>
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
                                <Form.Label>Grade Name</Form.Label>
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

                        {student.grades.length ? <div className='w-100' style={{ display: 'block' }}>
                            <table className="table h-25 table-striped">
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Assignment </th>
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
                                                <td>{grade.mark}/{grade.total}</td>
                                                <td className='text-center'>{grade.percentage}%</td>
                                                <th className='text-center'><Button
                                                    variant="outline-success"
                                                    className='btn'
                                                    onClick={() => {
                                                        showModal(grade.name, grade.mark, grade.total);
                                                    }}
                                                >Edit</Button></th>
                                                <th className='text-center'><Button
                                                    variant="outline-danger"
                                                    className='btn'
                                                    onClick={() => {
                                                        handleDeleteMark(grade.name);
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
    )
}
