import { Button, Container } from 'react-bootstrap'
import useTeacher from '../hooks/useTeacher'
import Options from '../components/teachers/Options'

export default function TeacherProfile() {

    const { refreshLoading,
        refreshStudentData,
        students,
        currentUser,
        teacher,
        handleLogOut } = useTeacher()

    return (
        <>

            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100" style={{ maxWidth: "900px" }}>
                    <div class="d-flex justify-content-between">
                        <h1 className='display-4'>Teachers Portal</h1>
                        <Button className=' text-center btn-lg mt-2' style={{height:'50px'}} variant="outline-primary" onClick={handleLogOut}>Log out</Button>
                    </div>
                    <Options
                        refreshStudentData={refreshStudentData}
                        refreshLoading={refreshLoading}

                        students={students}

                        currentUser={currentUser}
                        teacher={teacher}
                    />
                </div>
            </Container >
        </>
    )
}
