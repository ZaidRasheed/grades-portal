import { Button, Container } from 'react-bootstrap';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Options from './Options';

export default function TeacherProfile() {
    const { currentUser, logOut, getTeacherData, getAllStudents } = UserAuth();

    const navigate = useNavigate()

    const [teacher, setTeacher] = useState();
    const [students, setStudents] = useState([]);

    // ! refresh student data
    const [refresh, setRefresh] = useState(true);
    const [refreshLoading, setRefreshLoading] = useState(false)
    const [refreshSpinner, setRefreshSpinner] = useState(false);

    const refreshStudentData = () => {
        setRefreshLoading(true);
        setRefresh((e) => {
            return !e
        })
    }

    // ! for getting teacher data
    useEffect(() => {
        if (currentUser?.email.length) {
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
    }, [currentUser?.email])

    // ! for getting students data 
    useEffect(() => {
        setRefreshLoading(true);
        getAllStudents()
            .then(studentsData => {
                setStudents(studentsData)
            })
            .catch(() => {
                console.log('Error in fetching students data')
            })
            .finally(() => {
                setRefreshLoading(false);
                setRefreshSpinner(false);
            })
    }, [refresh])

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
                    <h1 className='display-4'>Teachers Portal</h1>
                    <Options
                        refreshStudentData={refreshStudentData}
                        refreshLoading={refreshLoading}

                        setRefreshSpinner={setRefreshSpinner}
                        refreshSpinner={refreshSpinner}

                        students={students}

                        currentUser={currentUser}
                        teacher={teacher}
                    />
                </div>
            </Container >
        </>
    )
}
