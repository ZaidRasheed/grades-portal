import React, { useState } from 'react'
import { Row, Col, Form, Button, Card, Alert, Dropdown, DropdownButton, InputGroup } from 'react-bootstrap'

export default function Data(props) {
    const [email, setEmail] = useState('')
    const [option, setOption] = useState('')
    const [result, setResult] = useState([])

    const [data, setData] = useState({
        name: '',
        email: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);


    const findStudent = async () => {
        for (let i = 0; i < props.students.length; i++) {
            if (props.students[i].email.includes(email.trim())) {
                return props.students[i]
            }
        }
        return null
    }

    function getHighestMark(student) {
        if (student.marks.length) {
            let highest = student.marks[0].percentage
            let grade
            student.marks.forEach(mark => {
                if (mark.percentage > highest) {
                    highest = mark.percentage
                    grade = mark
                }
            })
            setResult([grade])
        }
    }

    function getLowestMark(student) {
        if (student.marks.length) {
            let lowest = student.marks[0].percentage
            let grade
            student.marks.forEach(mark => {
                if (mark.percentage < lowest) {
                    lowest = mark.percentage
                    grade = mark
                }
            })
            setResult([grade])
        }
    }

    function allPassed(student) {
        if (student.marks.length) {
            let lowest = 50
            let grades = []
            student.marks.forEach(mark => {
                if (mark.percentage > lowest) {
                    grades.push(mark)
                }
            })
            setResult(grades)
        }
    }

    function allFailed(student) {
        if (student.marks.length) {
            let lowest = 50
            let grades = []
            student.marks.forEach(mark => {
                if (mark.percentage < lowest) {
                    grades.push(mark)
                }
            })
            setResult(grades)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResult([])

        if (email.length < 4) {
            setLoading(false)
            return setError('Please provide a valid email')
        }

        findStudent()
            .then((student) => {
                if (student === null || student === undefined) {
                    setLoading(false)
                    setResult([])
                    return setError('No student found.')
                }

                if (student?.marks?.length === 0) {
                    setLoading(false)
                    return setError("Student Doesn't have any marks yet")
                }

                setData(() => {
                    return {
                        name: student.name,
                        email: student.email
                    }
                })

                switch (option) {
                    case 'Highest Grade': {
                        getHighestMark(student)
                        break;
                    }
                    case 'Lowest Grade': {
                        getLowestMark(student)
                        break;
                    }
                    case 'Passed Grades': {
                        allPassed(student)
                        break;
                    }
                    case 'Failed Grades': {
                        allFailed(student)
                        break;
                    }
                    case 'All Grades': {
                        setResult([...student.marks])
                        break;
                    }
                    default: {
                        setError('Invalid selection please select the type of search query')
                        break;
                    }
                }
                setLoading(false);
            })
    }

    function resetData() {
        setEmail('')
        setEmail('')
        setError('')
        setOption('')
        setData({
            name: '',
            email: '',
        })
        setResult([])
        setLoading(false)

    }

    return (
        <Card className='p-2 '>
            <Card.Body>
                <h2 className='text-center mb-4'>Search</h2>
                {error && <Alert variant='danger'>{error}</Alert>}
                <div style={{ maxWidth: '700px', marginBottom: '60px' }}>
                    <Button
                        onClick={resetData}
                        className=' mt-1 mb-1 text-center float-end'
                        variant='outline-danger'
                        type='submit'
                    >Reset</Button>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '700px' }}>
                        <Form.Label>Student Email</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>@</InputGroup.Text>
                            <Form.Control
                                value={email}
                                placeholder="Student Email"
                                aria-label="Student Email"
                                onChange={(e) => { setEmail(e.target.value) }}
                                autoComplete="email"
                                required />
                        </InputGroup>
                    </Form.Group>
                    <Row>
                        <Col lg={2} md={2} sm={3} xs={6}>
                            <DropdownButton
                                title="Options"
                                variant='secondary'
                                className='mt-2'
                            >
                                <Dropdown.Item onClick={() => { setOption('Highest Grade') }}>Highest Grade</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setOption('Lowest Grade') }}>Lowest Grade</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setOption('Failed Grades') }}>Failed Grades</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setOption('Passed Grades') }}>Passed Grades</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setOption('All Grades') }}>All Grades</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col lg={10} md={10} sm={9} xs={7}>
                            <fieldset disabled>
                                <Form.Group className='mb-4 mt-2' style={{ maxWidth: '555px' }}>
                                    <Form.Control readOnly value={option} />
                                </Form.Group>
                            </fieldset>
                        </Col>
                    </Row>
                    {(result.length > 0) && <><h3 className='mt-3'>{data.name}</h3><h5>Email: {data.email}</h5></>}
                    {result?.length > 0 && <div className='w-100' style={{ display: 'block' }}>
                        <table className="table h-25 table-striped">
                            <thead className='table-dark'>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Assignment </th>
                                    <th scope="col">Mark</th>
                                    <th className='text-center' scope="col">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((mark, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <th scope="row">{mark.assignment}</th>
                                            <td>{mark.mark}</td>
                                            <td className='text-center'>{mark.percentage}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>}
                    <div className='text-center'>
                        <Button
                            style={{ maxWidth: '200px' }}
                            disabled={loading}
                            className='w-100 mt-1 mb-1 text-center'
                            type='submit'
                        >Search</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card >
    )
}
