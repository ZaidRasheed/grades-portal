import { useState } from 'react'
import { Button, Alert, Modal } from 'react-bootstrap'
import { UserAuth } from '../../../../context/AuthContext'

export default function DeleteGradeModal(props) {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const { deleteGrade } = UserAuth()

    const handleDeleteGrade = () => {
        setError('')
        setSuccess('')
        setLoading(true)
        deleteGrade(props.data.student.id, props.data.gradeName, props.data.subject)
            .then((res) => {
                if (res.status === 'success') {
                    setSuccess(res.message)
                }
                else {
                    console.log(res)
                    setLoading(false)
                    setError(res.message)
                }
            })
            .catch(e => {
                setLoading(false)
                setError(`Error, Couldn't Delete Grade ${subject} ${gradeName} `)
            })
            .finally(() => {
                props.refreshStudentData();
            })
    }

    return (
        <Modal centered show={props.showDeleteModal} onHide={props.closeDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Grade</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                {success && <Alert variant='success' onClose={() => setSuccess('')}>{success}</Alert>}
                <p className='display-6'>Delete {props.data.subject} {props.data.gradeName} for :<br /><i> <b>{props.data.student.name}</b></i></p>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={loading} variant='danger' onClick={handleDeleteGrade}>Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}
