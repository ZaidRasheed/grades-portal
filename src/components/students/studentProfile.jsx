import { Button, Container } from 'react-bootstrap';
import { UserAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UpdatePassword from '../updatePassword.jsx';
import DeleteAccount from './deleteAccount.jsx'
export default function StudentProfile() {

    const { currentUser, logOut, getStudentData } = UserAuth();

    const navigate = useNavigate()

    const [id, setId] = useState('');
    const [userName, setUserName] = useState('');
    const [grades, setGrades] = useState([]);



    // ! update password modal
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);

    const handleCloseUpdatePassword = () => setShowUpdatePassword(false);
    const handleShowUpdatePassword = () => setShowUpdatePassword(true);

    // ! delete account modal
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const handleCloseDeleteAccount = () => setShowDeleteAccount(false);
    const handleShowDeleteAccount = () => setShowDeleteAccount(true);


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

    useEffect(() => {
        if (id !== currentUser?.uid) {
            if (currentUser?.uid) {
                setId(currentUser.uid)
            }
        }
    }, [currentUser?.uid])

    useEffect(() => {
        if (id) {
            getStudentData(id)
                .then((student) => {
                    if (student.exists()) {
                        setUserName(student.data().name)
                        setGrades(student.data().grades)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [id, refresh])



    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "600px" }}>
                {userName?.length ? <h1 className=' mb-4'>Hello {userName}</h1> : null}
                <h4 className=' mb-4'>Email: {currentUser?.email}</h4>
                <Button
                    variant='outline-primary'
                    className='mb-4 mt-4'
                    onClick={refreshStudentData}
                    disabled={refreshLoading}
                >
                    {refreshLoading ? <div className="spinner-border spinner-border text-primary" style={{ width: '1.5rem', height: '1.5rem' }} role="status"></div> : 'Refresh'}
                </Button>

                {grades?.length > 0 ? <div className='overflow-scroll mt-4 mb-5' style={{ maxHeight: "33vh", minHeight: '15vh' }}>
                    <table className="table h-25 table-striped">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Grade Name</th>
                                <th scope="col">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((grade, i) => {
                                return (
                                    <tr key={i}>
                                        <th scope="row">{i + 1}</th>
                                        <td>{grade.name}</td>
                                        <td>{grade.mark}/{grade.total}</td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>
                </div> : <h5 className='mt-4 mb-4 text-black-50'>**No marks were added yet**</h5>}
                <div className="w-100 text-center mt-2">
                    <Button variant="link" onClick={handleShowUpdatePassword}>
                        Update Password?
                    </Button>
                    <UpdatePassword
                        show={showUpdatePassword}
                        handleClose={handleCloseUpdatePassword}
                        handleShow={handleShowUpdatePassword}
                    />
                </div>
                <div className="w-100 text-center mt-2">
                    <Button variant="link" onClick={handleShowDeleteAccount}>
                        Delete Account?
                    </Button>
                    <DeleteAccount
                        show={showDeleteAccount}
                        handleClose={handleCloseDeleteAccount}
                        handleShow={handleShowDeleteAccount}
                    />
                </div>
                <div className="w-100 mt-3">
                    <Button variant="outline-primary" className='text-center mb-4 btn-lg mt-3' onClick={() => {
                        logOut();
                        navigate('/grades_portal')
                    }}>Log out</Button>
                </div>
            </div>
        </Container>
    )
}
