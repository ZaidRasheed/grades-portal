import { useState, useMemo } from 'react'
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'

export default function StudentsList(props) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const students = useMemo(() => {
        return props.students.filter(student => {
            return student.email.toLowerCase().includes(email.toLowerCase().trim()) && student.name.toLowerCase().includes(name.trim().toLowerCase())
        })
    }, [props.students, email, name])

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!email.length && !name.length) {
            setLoading(false)
            return setError('Please provide a valid email or name')
        }

        if (!students.length) {
            setLoading(false)
            return setError('No student found.')
        }

        setLoading(false)
    }

    return (
        <Card className='p-2 mb-3'>
            <Card.Body>
                <h2 className='text-center mb-4'>Students</h2>
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '900px' }}>
                        <Form.Label>Student Name</Form.Label>
                        <Form.Control
                            type='name'
                            value={name}
                            onChange={e => { setName(e.target.value) }}
                            placeholder="Student name"
                            aria-label="Student name"
                            autoComplete="name" />
                    </Form.Group>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '900px' }}>
                        <Form.Label>Student Email</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>@</InputGroup.Text>
                            <Form.Control
                                type='email'
                                value={email}
                                onChange={e => { setEmail(e.target.value) }}
                                placeholder="Student Email"
                                aria-label="Student Email"
                                autoComplete="email" />
                        </InputGroup>
                    </Form.Group>
                    <div className='overflow-scroll mt-4 mb-5' style={{ maxHeight: "800px" }}>
                        <table className="table h-25 table-striped">
                            <thead className='table-dark'>
                                <tr>
                                    <th className='text-center' scope="col">Name</th>
                                    <th className='text-center' scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, i) => {
                                    return (
                                        <tr key={i}>
                                            <td className='text-center'>{student.name}</td>
                                            <td className='text-center'>{student.email}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
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
        </Card>
    )
}
