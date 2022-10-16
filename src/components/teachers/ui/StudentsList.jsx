import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap'


export default function StudentsList(props) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [student, setStudent] = useState(null)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            let flag = false;
            for (let i = 0; i < props.students.length; i++) {
                if (props.students[i].email.includes(email.trim()) && props.students[i].name.toLowerCase().includes(name.trim().toLowerCase())) {
                    setStudent(props.students[i])
                    flag = true;
                }
            }
            if (!flag)
                setStudent(null)
        }, [200])

        if (!email.length && !name.length) {
            setError('')
        }

        return () => {
            clearTimeout(timer)
        };
    }, [email, name]);

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!email.length && !name.length) {
            setLoading(false)
            return setError('Please provide a valid email or name')
        }

        if (student === null || student === undefined) {
            setLoading(false)
            return setError('No student found.')
        }

        setLoading(false);
    }

    return (
        <Card className='p-2 '>
            <Card.Body>
                <h2 className='text-center mb-4'>Students</h2>
                {error && <Alert variant='danger'>{error}</Alert>}
                {/* <div style={{ maxWidth: '700px', marginBottom: '60px' }}>
                        <Button
                            disabled={loading}
                            onClick={resetData}
                            className=' mt-1 mb-1 text-center float-end'
                            variant='outline-danger'
                            type='submit'
                        >Reset</Button>
                    </div> */}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '700px' }}>
                        <Form.Label>Student Email</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>@</InputGroup.Text>
                            <Form.Control
                                type='email'
                                value={email}
                                placeholder="Student Email"
                                aria-label="Student Email"
                                onChange={(e) => { setEmail(e.target.value) }}
                                autoComplete="email" />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='mb-4 ' style={{ maxWidth: '700px' }}>
                        <Form.Label>Student Name</Form.Label>
                        <Form.Control
                            type='name'
                            value={name}
                            placeholder="Student name"
                            aria-label="Student name"
                            onChange={(e) => { setName(e.target.value) }}
                            autoComplete="name" />
                    </Form.Group>
                    {(email.length === 0 && name.length === 0) ? <div className='overflow-scroll mt-4 mb-5' style={{ maxHeight: "800px" }}>
                        <table className="table h-25 table-striped">
                            <thead className='table-dark'>
                                <tr>
                                    <th className='text-center' scope="col">Name</th>
                                    <th className='text-center' scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.students.map((student, i) => {
                                    return (
                                        <tr key={i}>
                                            <td className='text-center'>{student.name}</td>
                                            <td className='text-center'>{student.email}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div> : (student !== null && <div className='overflow-scroll mt-4 mb-5' style={{ maxHeight: "800px" }}>
                        <table className="table h-25 table-striped">
                            <thead className='table-dark'>
                                <tr>
                                    <th className='text-center' scope="col">Name</th>
                                    <th className='text-center' scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='text-center'>{student.name}</td>
                                    <td className='text-center'>{student.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>)}
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
