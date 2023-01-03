import useDeleteEditGrade from '../../../../hooks/Teacher Operations/useDeleteEditGrade'
import { Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap'
import DeleteGradeModal from './DeleteGradeModal'
import EditGradeModal from './EditGradeModal'

export default function DeleteEditGrade(props) {
    const { students, refreshLoading, refreshStudentData } = props
    const { emailRef,
        assignmentRef,
        subjectRef,
        ErrorAlert,
        loading,
        student,
        showDeleteModal,
        showEditModal,
        closeDeleteModal,
        closeEditModal,
        deleteData,
        editData,
        handleDeleteMark,
        handleEditGrade,
        handleSearch, } = useDeleteEditGrade(students, refreshLoading)

    return (
        <>
            {showDeleteModal && <DeleteGradeModal
                showDeleteModal={showDeleteModal}
                closeDeleteModal={closeDeleteModal}
                refreshStudentData={refreshStudentData}
                data={deleteData}
            />}
            {showEditModal && <EditGradeModal
                showEditModal={showEditModal}
                closeEditModal={closeEditModal}
                refreshStudentData={refreshStudentData}
                oldGrade={editData}
                student={student}
            />}
            <Card className='p-2 mb-3'>
                {ErrorAlert}
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
                                disabled={loading || refreshLoading}
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
                                                            handleEditGrade(grade)
                                                        }}
                                                    >Edit</Button></th>
                                                    <th className='text-center'><Button
                                                        variant="outline-danger"
                                                        className='btn'
                                                        onClick={() => {
                                                            handleDeleteMark(grade.name, grade.subject)
                                                        }}
                                                    >Delete &times</Button></th>
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
