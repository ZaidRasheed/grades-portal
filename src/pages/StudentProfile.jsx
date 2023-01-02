import useStudent from '../hooks/useStudent'
import { Button, Container, Dropdown, DropdownButton } from 'react-bootstrap'
import UpdatePassword from '../components/UpdatePassword'
import DeleteAccount from '../components/students/DeleteAccount'

export default function StudentProfile() {

    const { student,
        grades,
        option,
        subjects,
        handleRefresh,
        refreshLoading,
        handleLogOut,
        setOption } = useStudent()

    let gradeCount = 1

    return (
        <Container
            className="d-flex justify-content-center mt-4"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "900px" }}>
                <div class="d-flex justify-content-between">
                    {student?.name ? <h1 className=' mb-4'>Hello {student?.name} !</h1> : null}
                    <Button variant="outline-primary" className='text-center mb-4 btn-lg' onClick={handleLogOut}>Log out</Button>
                </div>

                <h4 className=' mb-4'>Email: {student?.email}</h4>
                <Button
                    variant='outline-primary'
                    className='mb-4 mt-4'
                    onClick={handleRefresh}
                    disabled={refreshLoading}
                >
                    {refreshLoading ?
                        <div className="spinner-border spinner-border text-primary" style={{ width: '1.5rem', height: '1.5rem' }} role="status"></div>
                        : 'Refresh'}
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

                {grades?.length > 0 ?
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
                                {grades.map((grade) => {
                                    return (grade.subject === option || option === 'All Grades') ? (
                                        <tr key={gradeCount}>
                                            <th scope="row">{gradeCount++}</th>
                                            <th scope="row">{grade.subject}</th>
                                            <td>{grade.name}</td>
                                            <td className='text-center'>{grade.mark}/{grade.total}</td>
                                            <td className='text-center'>{grade.percentage}%</td>
                                            <td className={`text-center ${grade.percentage >= 50 ? 'text-success' : 'text-danger'}`}>{grade.percentage >= 50 ? 'Passed' : 'Failed'}</td>
                                        </tr>) : null
                                })}
                            </tbody>
                        </table>
                    </div>
                    : <h5 className='mt-4 mb-4 text-black-50'>**No marks were added yet**</h5>
                }

                <UpdatePassword />
                <DeleteAccount />
            </div>
        </Container>
    )
}
