import { Container, Card } from 'react-bootstrap'
import MainHeader from '../components/layout/MainHeader'

export default function Home() {
    return (
        <>
            <MainHeader />
            <Container
                className="d-flex mt-5 justify-content-center"
                style={{ minHeight: "100vh" }}
            >
                <div className="w-100 mb-4" style={{ maxWidth: "1200px" }}>
                    <Card className='p-2'>
                        <Card.Body>
                            <h1 id="grades-portal">Grades Portal</h1>
                            <h2 id="tech-stack">Tech Stack</h2>
                            <ul>
                                <li>React.js</li>
                                <li>Firebase Authentication</li>
                                <li>Firestore Database</li>
                            </ul>
                            <h2 id="project-overview">Project overview</h2>
                            <ul>
                                <li>
                                    <h4 id="students">Students</h4>
                                </li>
                            </ul>
                            <ol type="1">
                                <li>Students can signUp and create their own account to view their grades.</li>
                                <li>Students can update their password if they are logged in or request a link to change if they are logged out.</li>
                                <li>Students can also delete their accounts.</li>
                            </ol>
                            <ul>
                                <li>
                                    <h4 id="teachers">Teachers</h4>
                                </li>
                            </ul>
                            <ol type="1">
                                <li>Teachers cannot create their accounts instead they are created manually, (an <a
                                    href="https://github.com/ZaidRasheed/admin-panel">admin panel</a> was made for this purpose check it out <a
                                        href="https://github.com/ZaidRasheed/admin-panel">here</a>).</li>
                                <li>Teachers cannot delete their accounts (the same <a href="https://github.com/ZaidRasheed/admin-panel">admin
                                    panel</a> does the job).</li>
                                <li>Teachers can also update their password if they are logged in or request a link to change if they are logged out.
                                </li>
                                <li>Teachers can view all students and their grades.</li>
                                <li>Teachers can post, delete and edit grades for all students.</li>
                                <li>Teachers can sort grades for any students based on different criteria (passed, failed, highest, lowest) per
                                    subject.</li>
                            </ol>
                            <h2 id="description-and-approach">Description and Approach</h2>
                            <ul>
                                <li>There are two collections in the database one for students and another for teachers.<br></br></li>
                                <li>Whenever a user (student) is created a new student document is created in the database which has the same document
                                    id as the user from firebase authentication, the structure of a student object is as follow:</li>
                            </ul><pre><code>{`   {
    name: string
    email: string
    id: string
    grades: array
        [ 
            { 
                name: string
                subject: string
                mark: integer
                total: integer
                percentage: number
            }
        ]
    }`}</code></pre>
                            <ul>
                                <li>Teachers are created following the same approach and have the following document structure in the database:</li>
                            </ul>
                            <pre><code>{`    {
    firstName: string
    lastName: string
    email: string
    id: string
    gender: string
    disabled: boolean
    }
`}</code></pre>
                            <ul>
                                <li>Data is validated on the forms and on the functions which add the data to the database and most importantly on
                                    firestore security rules.<br /></li>
                                <li>Routes are protected and allow access only of the user is logged in and if the user has a corresponding document
                                    in the database, authorized routes are implemented so users can also access the user profile and same thing on for
                                    teachers.<br /></li>
                                <li>Requests are protected by firestore as follow:
                                    <ul>
                                        <li>For students
                                            <ul>
                                                <li>Students can be created in the database only upon successfully creating an account and only allowed one
                                                    student document per account.</li>
                                                <li>A student can only read his own data.</li>
                                                <li>A student can only delete his own account (where IDs match).</li>
                                                <li>Student aren’t allowed to edit their data.</li>
                                            </ul>
                                        </li>
                                        <li>For teachers:
                                            <ul>
                                                <li>A teacher can only read his own data.</li>
                                                <li>A teacher can read all student data.</li>
                                                <li>A teacher can write and change students data.</li>
                                                <li>A teacher can’t delete students.</li>
                                                <li>A teacher can’t create new students ## Demo accounts credentials: ### - Student Account</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li>Email: 12@12.com</li>
                                <li>Password: 12@12.com ### - Teacher Account</li>
                                <li>Email: 123@123.com</li>
                                <li>Password: 123@123.com <br /> ### - The following firestore rules ensure following in order:</li>
                            </ul>
                            <ol type="1">
                                <li>Admins can read their own data only.</li>
                                <li>Teachers data cannot be changed nor deleted (unless using the admin panel).</li>
                                <li>Teachers data can ONLY be read by the teacher himself, admins can read all teachers data.</li>
                                <li>A student can ONLY read his own data, teachers can read all students data.</li>
                                <li>Students data can be created ONLY once when the student creates an account.</li>
                                <li>ONLY a student can delete ONLY his own own account.</li>
                                <li>ONLY a teacher can update student marks, the name,id and email should remain the same or else rejected, one mark
                                    can be deleted or added per request, any new mark should have the correct data types :
                                    <ol type="1">
                                        <li>Grade name should be a string and should not be empty.</li>
                                        <li>Grade subject should be a string and should not be empty.</li>
                                        <li>Percentage should be a number and between 0 and 100.</li>
                                        <li>Mark should be a number greater than or equal 0.</li>
                                        <li>Total should be a number greater 0 and also greater than or equal to mark.</li>
                                    </ol>
                                    <pre><code>rules_version = &#39;2&#39;;
                                        service cloud.firestore {`
    {
        match / databases / { database } / documents {
            match / admins / { userId }{
                allow write,delete,create,update:if false;
                allow read: if request.auth != null && request.auth.uid == userId;
            }
            match /teachers/{userId}{
                allow write,delete,create,update: if false;
                allow read: if request.auth != null && (request.auth.uid == userId ||
                    exists(/databases/$(database)/documents/admins/$(request.auth.uid)));
            }
            match /students/{userId} {
                allow write: if false;
                allow read: if request.auth != null && (request.auth.uid == userId || 
                    exists(/databases/$(database)/documents/teachers/$(request.auth.uid)));
                allow create:if request.auth != null && request.auth.uid == userId;
                allow delete: if request.auth != null && request.auth.uid == userId;
                allow update: if exists(/databases/$(database)/documents/teachers/$(request.auth.uid))
                    && (request.resource.data.id == resource.data.id)
                    && (request.resource.data.email == resource.data.email)
                    && (request.resource.data.name == resource.data.name)
                    && (request.resource.data.grades.size() <= resource.data.grades.size()||
                        (   (request.resource.data.grades.size()== resource.data.grades.  size() +1) &&
                    (
                        (request.resource.data.grades[request.resource.data.  grades.size()-1].name is string)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].name.size() > 0)
                        && (request.resource.data.grades[request.resource.data.grades.size()-1].subject is string)
                        && (request.resource.data.grades[request.resource.data.grades.size()-1].subject.size() > 0)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].percentage is number)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].mark is number)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].total is number)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].percentage >=0 )
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].percentage <=100)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].total >0)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].mark >=0)
                        && (request.resource.data.grades[request.resource.data. grades.size()-1].mark <= 
                            request.resource.data.grades[request.resource.data.grades.size()-1].total)
                        )
                    )
                );
            }
    }
`}
                                    </code>
                                    </pre>
                                </li>
                            </ol>
                            <hr />
                        </Card.Body>
                    </Card>

                </div>

            </Container>
        </>
    )
}
