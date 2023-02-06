import{M as t}from"./MainHeader.1e4040be.js";import{j as a,F as s,a as e}from"./index.b267ccbb.js";import{C as d}from"./Container.ec1b4897.js";import{C as r}from"./Card.f8854b59.js";import"./createWithBsPrefix.414b4e56.js";function o(){return a(s,{children:[e(t,{}),e(d,{className:"d-flex mt-5 justify-content-center",style:{minHeight:"100vh"},children:e("div",{className:"w-100 mb-4",style:{maxWidth:"1200px"},children:e(r,{className:"p-2",children:a(r.Body,{children:[e("h1",{id:"grades-portal",children:"Grades Portal"}),e("h2",{id:"tech-stack",children:"Tech Stack"}),a("ul",{children:[e("li",{children:"React.js"}),e("li",{children:"Firebase Authentication"}),e("li",{children:"Firestore Database"})]}),e("h2",{id:"project-overview",children:"Project overview"}),e("ul",{children:e("li",{children:e("h4",{id:"students",children:"Students"})})}),a("ol",{type:"1",children:[e("li",{children:"Students can signUp and create their own account to view their grades."}),e("li",{children:"Students can update their password if they are logged in or request a link to change if they are logged out."}),e("li",{children:"Students can also delete their accounts."})]}),e("ul",{children:e("li",{children:e("h4",{id:"teachers",children:"Teachers"})})}),a("ol",{type:"1",children:[a("li",{children:["Teachers cannot create their accounts instead they are created manually, (an ",e("a",{href:"https://github.com/ZaidRasheed/admin-panel",children:"admin panel"})," was made for this purpose check it out ",e("a",{href:"https://github.com/ZaidRasheed/admin-panel",children:"here"}),")."]}),a("li",{children:["Teachers cannot delete their accounts (the same ",e("a",{href:"https://github.com/ZaidRasheed/admin-panel",children:"admin panel"})," does the job)."]}),e("li",{children:"Teachers can also update their password if they are logged in or request a link to change if they are logged out."}),e("li",{children:"Teachers can view all students and their grades."}),e("li",{children:"Teachers can post, delete and edit grades for all students."}),e("li",{children:"Teachers can sort grades for any students based on different criteria (passed, failed, highest, lowest) per subject."})]}),e("h2",{id:"description-and-approach",children:"Description and Approach"}),a("ul",{children:[a("li",{children:["There are two collections in the database one for students and another for teachers.",e("br",{})]}),e("li",{children:"Whenever a user (student) is created a new student document is created in the database which has the same document id as the user from firebase authentication, the structure of a student object is as follow:"})]}),e("pre",{children:e("code",{children:`   {
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
    }`})}),e("ul",{children:e("li",{children:"Teachers are created following the same approach and have the following document structure in the database:"})}),e("pre",{children:e("code",{children:`    {
    firstName: string
    lastName: string
    email: string
    id: string
    gender: string
    disabled: boolean
    }
`})}),a("ul",{children:[a("li",{children:["Data is validated on the forms and on the functions which add the data to the database and most importantly on firestore security rules.",e("br",{})]}),a("li",{children:["Routes are protected and allow access only of the user is logged in and if the user has a corresponding document in the database, authorized routes are implemented so users can also access the user profile and same thing on for teachers.",e("br",{})]}),a("li",{children:["Requests are protected by firestore as follow:",a("ul",{children:[a("li",{children:["For students",a("ul",{children:[e("li",{children:"Students can be created in the database only upon successfully creating an account and only allowed one student document per account."}),e("li",{children:"A student can only read his own data."}),e("li",{children:"A student can only delete his own account (where IDs match)."}),e("li",{children:"Student aren\u2019t allowed to edit their data."})]})]}),a("li",{children:["For teachers:",a("ul",{children:[e("li",{children:"A teacher can only read his own data."}),e("li",{children:"A teacher can read all student data."}),e("li",{children:"A teacher can write and change students data."}),e("li",{children:"A teacher can\u2019t delete students."}),e("li",{children:"A teacher can\u2019t create new students ## Demo accounts credentials: ### - Student Account"})]})]})]})]}),e("li",{children:"Email: 12@12.com"}),e("li",{children:"Password: 12@12.com ### - Teacher Account"}),e("li",{children:"Email: 123@123.com"}),a("li",{children:["Password: 123@123.com ",e("br",{})," ### - The following firestore rules ensure following in order:"]})]}),a("ol",{type:"1",children:[e("li",{children:"Admins can read their own data only."}),e("li",{children:"Teachers data cannot be changed nor deleted (unless using the admin panel)."}),e("li",{children:"Teachers data can ONLY be read by the teacher himself, admins can read all teachers data."}),e("li",{children:"A student can ONLY read his own data, teachers can read all students data."}),e("li",{children:"Students data can be created ONLY once when the student creates an account."}),e("li",{children:"ONLY a student can delete ONLY his own own account."}),a("li",{children:["ONLY a teacher can update student marks, the name,id and email should remain the same or else rejected, one mark can be deleted or added per request, any new mark should have the correct data types :",a("ol",{type:"1",children:[e("li",{children:"Grade name should be a string and should not be empty."}),e("li",{children:"Grade subject should be a string and should not be empty."}),e("li",{children:"Percentage should be a number and between 0 and 100."}),e("li",{children:"Mark should be a number greater than or equal 0."}),e("li",{children:"Total should be a number greater 0 and also greater than or equal to mark."})]}),e("pre",{children:a("code",{children:["rules_version = '2'; service cloud.firestore ",`
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
`]})})]})]}),e("hr",{})]})})})})]})}export{o as default};
