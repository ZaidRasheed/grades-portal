import { Button, Container, Dropdown, DropdownButton } from 'react-bootstrap';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import UpdatePassword from '../UpdatePassword';
import DeleteAccount from './DeleteAccount'

export default function StudentProfile() {
    const { currentUser, logOut, getStudentData } = UserAuth();
    
    const navigate = useNavigate()

    const [student, setStudent] = useState();
    const [grades, setGrades] = useState([])
    const [gradesList, setGradesList] = useState([])
    const [option, setOption] = useState('All Grades')

    // ! refresh student data
    const [refresh, setRefresh] = useState(true);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [refreshSpinner, setRefreshSpinner] = useState(false);

    useEffect(() => {
        if (currentUser?.uid) {
            getStudentData(currentUser?.uid)
                .then((student) => {
                    if (student.exists()) {
                        setStudent(student.data())
                        setGrades(student.data().grades)
                        setGradesList(student.data().grades)
                    }
                })
                .catch((error) => {

                })
                .finally(() => {
                    setRefreshLoading(false);
                    setRefreshSpinner(false);
                })
        }
    }, [currentUser?.uid, refresh])

    const refreshStudentData = () => {
        setRefreshLoading(true);

        setRefresh((e) => {
            return !e
        })
    }

    const subjects = useMemo(() => {
        const subjects = []
        grades.forEach(grade => {
            if (!subjects.includes(grade.subject))
                subjects.push(grade.subject)
        })
        return subjects
    }, [grades.length])

    useEffect(() => {
        if (option === 'All Grades')
            setGradesList(() => {
                return grades
            })
        else
            setGradesList(() => {
                return grades.filter(grade => {
                    return grade.subject === option
                })
            })
    }, [option])

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "900px" }}>
                {student?.name ? <h1 className=' mb-4'>Hello {student?.name} !</h1> : null}
                <h4 className=' mb-4'>Email: {student?.email}</h4>
                <Button
                    variant='outline-primary'
                    className='mb-4 mt-4'
                    onClick={() => {
                        setRefreshSpinner(true);
                        refreshStudentData();
                    }}
                    disabled={refreshLoading}
                >
                    {refreshSpinner ? <div className="spinner-border spinner-border text-primary" style={{ width: '1.5rem', height: '1.5rem' }} role="status"></div> : 'Refresh'}
                </Button>

                <h3>Showing: </h3>
                <DropdownButton
                    title={option}
                    variant='secondary'
                    className='mt-2'
                >
                    {subjects.map((subject, i) => {
                        return (
                            <Dropdown.Item key={i} onClick={() => { setOption(`${subject}`) }}>{subject}</Dropdown.Item>
                        )
                    })}
                    <Dropdown.Item onClick={() => { setOption(`All Grades`) }}>All Grades</Dropdown.Item>
                </DropdownButton>

                {gradesList?.length > 0 ?
                    <div className='overflow-scroll mt-4 mb-5' style={{ maxHeight: "33vh", minHeight: '15vh' }}>
                        <table className="table h-25 table-striped">
                            <thead className='table-dark'>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Name</th>
                                    <th scope="col" className='text-center'>Grade</th>
                                    <th scope="col" className='text-center'>Percentage</th>
                                    <th scope="col" className='text-center'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradesList.map((grade, i) => {
                                    return (
                                        <tr key={i}>
                                            <th scope="row">{i + 1}</th>
                                            <th scope="row">{grade.subject}</th>
                                            <td>{grade.name}</td>
                                            <td className='text-center'>{grade.mark}/{grade.total}</td>
                                            <td className='text-center'>{grade.percentage}%</td>
                                            <td className={`text-center ${grade.percentage >= 50 ? 'text-success' : 'text-danger'}`}>{grade.percentage >= 50 ? 'Passed' : 'Failed'}</td>
                                        </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                    : <h5 className='mt-4 mb-4 text-black-50'>**No marks were added yet**</h5>
                }

                <UpdatePassword />

                <DeleteAccount />

                <div className="w-100 mt-3">
                    <Button variant="outline-primary" className='text-center mb-4 btn-lg mt-3' onClick={() => {
                        logOut();
                        navigate('/')
                    }}>Log out</Button>
                </div>

            </div>
        </Container>
    )
}
