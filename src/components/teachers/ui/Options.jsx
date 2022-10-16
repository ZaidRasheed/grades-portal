import { Button } from 'react-bootstrap';
import AddMark from './AddMark';
import StudentsList from './StudentsList.jsx';
import Data from './Data.jsx';
import DeleteMark from './DeleteMark.jsx';
export default function Options(props) {
    return (
        <>
            <ul className="nav nav-pills mb-3 mt-5" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            props.setPropertiesShown('students list')
                        }}
                        className={`nav-link ${props.propertiesShown === 'students list' ? 'active' : ''}`}
                    >Students</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            props.setPropertiesShown('add grade')
                        }}
                        className={`nav-link ${props.propertiesShown === 'add grade' ? 'active' : ''}`}
                    >Add Grade</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            props.setPropertiesShown('delete mark')
                        }}
                        className={`nav-link ${props.propertiesShown === 'delete mark' ? 'active' : ''}`}
                    >Delete Mark</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            props.setPropertiesShown('data')
                        }}
                        className={`nav-link ${props.propertiesShown === 'data' ? 'active' : ''}`}
                    >Data</button>
                </li>
            </ul>

            <Button
                variant='outline-primary'
                className='mb-4 mt-4'
                onClick={props.refreshStudentData}
                disabled={props.refreshLoading}
            >
                {props.refreshLoading ? <div className="spinner-border spinner-border text-primary" style={{ width: '1.5rem', height: '1.5rem' }} role="status"></div> : 'Refresh'}
            </Button>

            <div className="tab-content " style={{ minHeight:'400px' }} id="pills-tabContent">
                {props.propertiesShown === 'students list' && <div >
                    {props.students.length > 0 ?
                        <StudentsList
                            students={props.students}
                        />
                        : <h1 className='text-center text-danger'>No Students</h1>
                    }
                </div>}
                {props.propertiesShown === 'add grade' && <div >
                    {props.students.length > 0 ?
                        <AddMark
                            students={props.students}
                            studentEmails={props.studentEmails}
                            currentUser={props.currentUser}
                            refreshStudentData={props.refreshStudentData}
                            refreshLoading={props.refreshLoading}
                        />
                        : <h1 className='text-center text-danger'>No Students</h1>
                    }
                </div>}
                {props.propertiesShown === 'data' && <div >
                    {props.students.length > 0 ?
                        <Data 
                            students={props.students}
                        />
                        : <h1 className='text-center text-danger'>No Students</h1>
                    }
                </div>}
                {props.propertiesShown === 'delete mark' && <div >
                    {props.students.length > 0 ?
                        <DeleteMark
                            students={props.students}
                            studentEmails={props.studentEmails}
                            currentUser={props.currentUser}
                            refreshStudentData={props.refreshStudentData}
                            refreshLoading={props.refreshLoading}
                        />
                        : <h1 className='text-center text-danger'>No Students</h1>
                    }
                </div>}
            </div>
        </>
    )
}
