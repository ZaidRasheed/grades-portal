import { useState } from 'react';
import { Button } from 'react-bootstrap';
import AddGrade from './AddGrade.jsx';
import StudentsList from './StudentsList.jsx';
import Data from './Data.jsx';
import DeleteGrade from './DeleteGrade.jsx';
export default function Options(props) {
    const [propertiesShown, setPropertiesShown] = useState('students list')
    return (
        <>
            <ul className="nav nav-pills mb-3 mt-5" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            setPropertiesShown('students list')
                        }}
                        className={`nav-link ${propertiesShown === 'students list' ? 'active' : ''}`}
                    >Students</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            setPropertiesShown('add grade')
                        }}
                        className={`nav-link ${propertiesShown === 'add grade' ? 'active' : ''}`}
                    >Add Grade</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            setPropertiesShown('delete grade')
                        }}
                        className={`nav-link ${propertiesShown === 'delete grade' ? 'active' : ''}`}
                    >Delete & Edit Grade</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        onClick={() => {
                            setPropertiesShown('data')
                        }}
                        className={`nav-link ${propertiesShown === 'data' ? 'active' : ''}`}
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

            <div className="tab-content " style={{ minHeight: '400px' }} id="pills-tabContent">
                {propertiesShown === 'students list' && <div >
                    {props.students.length > 0 ?
                        <StudentsList
                            students={props.students}
                        />
                        : <h1 className='text-center text-danger'>No Students</h1>
                    }
                </div>}
                {propertiesShown === 'add grade' && <div >
                    {props.students.length > 0 ?
                        <AddGrade
                            students={props.students}
                            studentEmails={props.studentEmails}
                            currentUser={props.currentUser}
                            refreshStudentData={props.refreshStudentData}
                            refreshLoading={props.refreshLoading}
                        />
                        : <h1 className='text-center text-danger'>No Students</h1>
                    }
                </div>}
                {propertiesShown === 'data' && <div >
                    {props.students.length > 0 ?
                        <Data
                            students={props.students}
                        />
                        : <h1 className='text-center text-danger'>No Students</h1>
                    }
                </div>}
                {propertiesShown === 'delete grade' && <div >
                    {props.students.length > 0 ?
                        <DeleteGrade
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
