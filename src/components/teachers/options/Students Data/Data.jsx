import { useState } from 'react'
import { Form, Button, Card, Alert, Dropdown, DropdownButton, InputGroup } from 'react-bootstrap'

export default function Data(props) {
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [option, setOption] = useState('All Grades')
    const [result, setResult] = useState([])

    const [data, setData] = useState({
        name: '',
        email: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);


    const findStudent = async () => {
        const index = props.students.findIndex(student => {
            return student.email.includes(email.trim())
        })
        if (props.students[index]) {
            if (subject.length) {
                let filteredGrades = props.students[index].grades.filter((grade) => {
                    return grade.subject.toLowerCase().includes(subject.trim().toLowerCase())
                })
                return { student: props.students[index], grades: filteredGrades }
            }

            return {
                student: props.students[index],
                grades: props.students[index].grades
            }
        }
        else
            return null
    }

    function getHighestMark(grades) {
        if (grades.length) {
            let highest = grades[0].percentage
            let grade = grades[0]
            grades.forEach(mark => {
                if (mark.percentage > highest) {
                    highest = mark.percentage
                    grade = mark
                }
            })
            setResult([grade])
        }
    }

    function getLowestMark(grades) {
        if (grades.length) {
            let lowest = grades[0].percentage
            let grade = grades[0]
            grades.forEach(mark => {
                if (mark.percentage < lowest) {
                    lowest = mark.percentage
                    grade = mark
                }
            })
            setResult([grade])
        }
    }

    function allPassed(grades) {
        if (grades.length) {
            let lowest = 50
            let passedGrades = []
            grades.forEach(mark => {
                if (mark.percentage >= lowest) {
                    passedGrades.push(mark)
                }
            })

            if (!passedGrades.length)
                return setError("No match found.")

            setResult(passedGrades)
        }
    }

    function allFailed(grades) {
        if (grades.length) {
            let lowest = 50
            let failedGrades = []
            grades.forEach(mark => {
                if (mark.percentage < lowest) {
                    failedGrades.push(mark)
                }
            })

            if (!failedGrades.length)
                return setError("No match found.")

            setResult(failedGrades)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResult([])

        if (email.length < 4) {
            setLoading(false)
            return setError('Please provide a valid email')
        }

        findStudent()
            .then(data => {
                if (!data) {
                    setLoading(false)
                    setResult([])
                    return setError('No student found.')
                }

                if (data.student?.grades?.length === 0) {
                    setLoading(false)
                    return setError("Student Doesn't have any grades yet.")
                }

                if (!data.grades.length) {
                    setLoading(false)
                    return setError("No match found.")
                }

                setData(() => {
                    return {
                        name: data.student.name,
                        email: data.student.email
                    }
                })

                switch (option) {
                    case 'Highest Grade': {
                        getHighestMark(data.grades)
                        break;
                    }
                    case 'Lowest Grade': {
                        getLowestMark(data.grades)
                        break;
                    }
                    case 'Passed Grades': {
                        allPassed(data.grades)
                        break;
                    }
                    case 'Failed Grades': {
                        allFailed(data.grades)
                        break;
                    }
                    case 'All Grades': {
                        setResult(data.grades)
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
        setSubject('')
        setOption('All Grades')
        setData({
            name: '',
            email: '',
        })
        setResult([])
        setLoading(false)

    }

    return (
        <Card className='p-2 mb-3'>
            <Card.Body>
                <h2 className='text-center mb-4'>Search</h2>
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                <div style={{ maxWidth: '900px', marginBottom: '60px' }}>
                    <Button
                        onClick={resetData}
                        className=' mt-1 mb-1 text-center float-end'
                        variant='outline-danger'
                        type='submit'
                    >Reset</Button>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '900px' }}>
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
                    <Form.Group className='mb-4 ' style={{ maxWidth: '900px' }}>
                        <Form.Label>Subject</Form.Label>
                        <InputGroup>
                            <Form.Control
                                value={subject}
                                placeholder="Subject"
                                aria-label="Subject"
                                onChange={(e) => { setSubject(e.target.value) }}
                                autoComplete="subject" />
                        </InputGroup>
                    </Form.Group>
                    <DropdownButton
                        title={option}
                        variant='secondary'
                        className='mt-2 mb-3'
                    >
                        <Dropdown.Item onClick={() => { setOption('Passed Grades') }}>Passed Grades</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setOption('Failed Grades') }}>Failed Grades</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setOption('Highest Grade') }}>Highest Grade</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setOption('Lowest Grade') }}>Lowest Grade</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setOption('All Grades') }}>All Grades</Dropdown.Item>
                    </DropdownButton>
                    <div className='text-center'>
                        <Button
                            style={{ maxWidth: '200px' }}
                            disabled={loading}
                            className='w-100 mt-1 mb-1 text-center'
                            type='submit'
                        >Search</Button>
                    </div>
                </Form>
                {result.length > 0 && <><h3 className='mt-3'>{data.name}</h3><h5>Email: {data.email}</h5></>}
                {result.length > 0 && <div className='w-100' style={{ display: 'block' }}>
                    <table className="table h-25 table-striped">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Grade</th>
                                <th className='text-center' scope="col">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((grade, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <th scope="row">{grade.name}</th>
                                        <th scope="row">{grade.subject}</th>
                                        <td>{grade.mark}/{grade.total}</td>
                                        <td className='text-center'>{grade.percentage}%</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>}
            </Card.Body>
        </Card >
    )
}
