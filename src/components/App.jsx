import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthContextProvider } from "./context/AuthContext";

import { Routes, Route } from 'react-router-dom'

import Home from './home.jsx';

import PrivateRoutes from "./privateRoutes.jsx";
import PublicRoutes from "./publicRoutes.jsx";

import ResetPassword from "./resetPassword.jsx";
import Error from "./error.jsx";


import Signup from "./students/signUp.jsx";
import LoginStudents from "./students/loginStudents.jsx";
import StudentProfile from "./students/studentProfile.jsx";

import LoginTeacher from './teachers/loginTeacher.jsx'
import TeacherProfile from './teachers/teacherProfile.jsx';

import TeacherRoutes from './teachers/TeachersRoutes.jsx';
import StudentRoutes from './students/StudentsRoutes.jsx'

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route element={<Home />} path="/" exact />
            <Route element={<LoginStudents />} path="/student-login" exact />
            <Route element={<LoginTeacher />} path="/teacher-login" exact />
            <Route element={<Signup />} path="/signup" exact />
            {/* <Route element={<ResetPassword />} path="/resetPassword" exact /> */}
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route
              path='/student-profile'
              element={
                <StudentRoutes>
                  <StudentProfile />
                </StudentRoutes>
              }
            />
            <Route
              path='/teacher-profile'
              element={
                <TeacherRoutes>
                  <TeacherProfile />
                </TeacherRoutes>
              }
            />
          </Route>
          <Route element={<ResetPassword />} path="/resetPassword" exact />
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
