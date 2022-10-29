import { useState } from 'react'
import { Button, Form, Alert, Modal } from 'react-bootstrap'
import { UserAuth } from '../../../context/AuthContext'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function EditGradeModal(props) {
    const [newName, setNewName] = useState(props.oldGrade.name)
    const [newMark, setNewMark] = useState(props.oldGrade.mark)
    const [newTotal, setNewTotal] = useState(props.oldGrade.total)

    const { editGrade } = UserAuth();

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleEditGrade = async (e) => {
        e.preventDefault()
        setLoading(true)


        if (!newMark || +newMark < 0) {
            setLoading(false)
            return setError('Invalid, Marks cant be negative.')
        }

        if (!newTotal || +newTotal < 1) {
            setLoading(false)
            return setError('Invalid, Marks should be at least out of 1.')
        }

        if (+newMark > +newTotal) {
            setLoading(false)
            return setError('Invalid, Mark cant be greater than 100%.')
        }


        if ((props.oldGrade.mark === newMark && props.oldGrade.total === newTotal) && props.oldGrade.name.toLowerCase() === newName.toLowerCase()) {
            setLoading(false)
            return setError('Please provide new values')
        }
        const newGrade = {
            name: capitalizeFirstLetter(newName),
            mark: newMark,
            total: newTotal,
            percentage: +((newMark / newTotal) * 100).toFixed(2),
            subject: props.oldGrade.subject
        }

        editGrade(props.student.id, props.oldGrade.name, props.oldGrade.subject, newGrade)
            .then((resp) => {
                if (resp.status === 'success') {
                    setSuccess(resp.message)
                    props.refreshStudentData();
                }
                else {
                    setLoading(false)
                    setError(resp.message)
                }
            })
            .catch(e => {
                setLoading(false)
                setError(`Error, Couldn't Update Grade "${props.oldGrade.name}"`)
            })
    }
    return (
        <Modal centered show={props.showEditModal} onHide={props.closeEditModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Grade</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="w-100">
                    {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                    {success && <Alert variant='success' onClose={() => setSuccess('')}>{success}</Alert>}
                    <Form onSubmit={handleEditGrade}>
                        <h1>{props.oldGrade.subject} {props.oldGrade.name}</h1>
                        <p className='display-6'>For: <i> {props.student.name}</i></p>
                        <h5>Mark: {props.oldGrade.mark}/ {props.oldGrade.total}</h5>
                        <Form.Group className='mb-3'>
                            <Form.Label>New Grade Name</Form.Label>
                            <Form.Control
                                type='string'
                                value={newName}
                                onChange={(e) => { setNewName(e.target.value) }}
                                placeholder={props.oldGrade.name} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>New Mark</Form.Label>
                            <Form.Control
                                type='number'
                                value={newMark}
                                onChange={(e) => { setNewMark(e.target.value) }}
                                placeholder={props.oldGrade.mark} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>New Total</Form.Label>
                            <Form.Control
                                type='number'
                                value={newTotal}
                                onChange={(e) => { setNewTotal(e.target.value) }}
                                placeholder={props.oldGrade.total} />
                        </Form.Group>
                        <fieldset disabled>
                            <Form.Group className='mb-3'>
                                <Form.Label>Subject</Form.Label>
                                <Form.Control readOnly placeholder={props.oldGrade.subject} />
                            </Form.Group>
                        </fieldset>
                        <Button disabled={loading} className='w-100 mt-3 mb-3' type='submit'> Submit</Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )
}
