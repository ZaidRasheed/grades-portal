# Grades Portal  

## Tech Stack
- React.js 
- Firebase Authentication
- Firestore Database

## Project overview

- #### Students 
1. Students can signUp and create their own account to view their grades.
2. Students can update their password if they are logged in or request a link to change if they are logged out.
3. Students can also delete their accounts. 

- #### Teachers
1. Teachers cannot create their accounts instead they are created manually, (an admin panel could be made for this purpose).
2. Teachers cannot delete their accounts (same admin panel would do the job).
3. Teachers can also update their password if they are logged in or request a link to change if they are logged out.
4. Teachers can view all students and their grades.
5. Teachers can post, delete and edit grades for all students.
6. Teachers can sort grades for any students based on different criteria (passed, failed, highest, lowest).

## Description and Approach 

- There are two collections in the database one for students and another for teachers.<br><br>
- Whenever a user (student) is created a new student document is created in the database which has the same id, the structure of a student object is as follow:<br/>
{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: string<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;email: string<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: string<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grades: array<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: string<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mark: integer<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total: integer<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;percentage: number<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br>}<br><br>
- Data is validated on the forms and on the functions which add the data to the database and most importantly on firestore security rules.<br><br>
- Routes are protected and allow access only of the user is logged in, authorized routes are implemented so users can also access the user profile and same thing on for teachers.<br><br>
- Requests are protected by firestore as follow: 
    * For students
        + Students can be created in the database only upon successfully creating an account and only allowed one student document per account.
        + A student can only read his own data.
        + A student can only delete his own account (where IDs match).
        + Student aren't allowed to edit their data.
    * For teachers:
        + A teacher can only read his own data.
        + A teacher can read all student data.
        + A teacher can write and change students data.
        + A teacher can't delete students.
        + A teacher can't create new students
<br><br>
### - The following firestore rules ensure following in order:
1. Teachers data cannot be changed nor deleted.
2. Teachers data can ONLY be read by the teacher himself.
3. A student can ONLY read his own data, teachers can read all students data.
4. Students data can be created ONLY once when the student creates an account.
5. ONLY a student can delete ONLY his own own account.
6. ONLY a teacher can update student marks, the name,id and email should remain the same or else rejected, all marks can be deleted (array length is 0), the new mark should have the correct data types :
    1. Grade name should be a string and should not be empty.
    2. Percentage should be a number and between 0 and 100.
    3. Mark should be a number greater than or equal 0.
    4. Total should be a number greater 0.
    5. Total should be greater than or equal to mark.
>rules_version = '2';
>> service cloud.firestore {
  >>> match /databases/{database}/documents {<br>
    >>>>match /teachers/{userId}{<br>
    	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow write,delete,create,update: if false;<br>
    	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read: if request.auth != null && request.auth.uid == userId;<br>
    }<br>
    match /students/{userId} {<br>
    	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow write: if false;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read: if request.auth != null && (request.auth.uid == userId || exists(/databases/$(database)/documents/teachers/$(request.auth.uid)));<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow create:if request.auth != null && request.auth.uid == userId;<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow delete: if request.auth != null && request.auth.uid == userId;<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow update: if exists(/databases/$(database)/documents/teachers/$(request.auth.uid)) 
      <br>&& (request.resource.data.id == resource.data.id)<br>
      && (request.resource.data.email == resource.data.email)<br>
      && (request.resource.data.name == resource.data.name)<br>
      && (request.resource.data.grades.size()== resource.data.grades.size() -1 ||<br>
      (<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(request.resource.data.grades[request.resource.data.grades.size()-1].name is string)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].name.size() > 0)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&(request.resource.data.grades[request.resource.data.grades.size()-1].percentage is number)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].mark is number)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].total is number)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].percentage >=0 )<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].percentage <=100)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].total >0)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].mark >=0)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&& (request.resource.data.grades[request.resource.data.grades.size()-1].mark <= request.resource.data.grades[request.resource.data.grades.size()-1].total)
      ));}<br>
    }<br>
}<br>


---
## You can view the project live [here](https://zaidrasheed.github.io/grades_portal/)