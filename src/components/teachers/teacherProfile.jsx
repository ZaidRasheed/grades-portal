import { Button, Container } from 'react-bootstrap';
import { UserAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import UpdatePassword from '../updatePassword.jsx';
import Options from './ui/Options.jsx';

export default function TeacherProfile() {

    const { currentUser, logOut, getTeacherData, getAllStudentsEmails, getAllStudents } = UserAuth();

    const navigate = useNavigate()

    const [teacher, setTeacher] = useState('');
    const [email, setEmail] = useState('');
    const [students, setStudents] = useState([]);


    const [studentEmails, setStudentEmails] = useState([])


    // ! refresh student data
    const [refresh, setRefresh] = useState(true);
    const [refreshLoading, setRefreshLoading] = useState(false)



    const refreshStudentData = () => {
        setRefreshLoading(true);

        setRefresh((e) => {
            return !e
        })

        setTimeout(() => {
            setRefreshLoading(false);
        }, 2000)
    }


    // ! for the update password modal
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // ! for getting teacher data
    useEffect(() => {
        if (email.length) {
            getTeacherData(currentUser.uid)
                .then((data => {
                    if (data.error) {
                        console.log('Error in fetching teacher data');
                    }
                    else {
                        setTeacher(data)
                    }
                }))
                .catch(() => {
                    console.log('Error in fetching teacher data');
                })
        }
    }, [email])


    // ! for getting student data and there emails

    useEffect(() => {
        getAllStudents()
            .then(studentsData => {
                setStudents(studentsData)
            })
            .catch(() => { })
        getAllStudentsEmails()
            .then(studentsEmails => {
                setStudentEmails(studentsEmails)
            })
            .catch(() => { })

    }, [refresh])

    useEffect(() => {
        if (email !== currentUser?.email) {
            if (currentUser?.email) {
                setEmail(currentUser.email)
            }
        }
    }, [currentUser?.email])

    return (
        <>
            <div style={{ maxWidth: "900px", margin: '0 auto' }} className='d-flex flex-row-reverse' >
                <Button className=' text-center mb-1 btn-lg mt-2' variant="outline-primary" onClick={() => {
                    logOut();
                    navigate('/')
                }}>Log out</Button>
            </div>

            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100" style={{ maxWidth: "900px" }}>
                    {teacher?.name ? <h1 className=' mb-4'>Hello {teacher?.gender.toLowerCase() === 'male' ? 'Mr' : 'Mrs'} {teacher.name}</h1> : null}
                    <h4 className=' mb-4'>Email: {email}</h4>

                    <Options
                        refreshStudentData={refreshStudentData}
                        refreshLoading={refreshLoading}

                        students={students}
                        studentEmails={studentEmails}

                        currentUser={currentUser}
                    />

                    <div className="w-100 text-center mt-3 mb-5">
                        <Button
                            variant="link"
                            onClick={handleShow}>
                            Update Password?
                        </Button>
                        <UpdatePassword
                            show={show}
                            handleClose={handleClose}
                            handleShow={handleShow}
                        />
                    </div>

                </div>
            </Container >
        </>
    )
}
