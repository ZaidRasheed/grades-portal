import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthContextProvider } from "./context/AuthContext";

import { Routes, Route } from 'react-router-dom'

import Home from './Home';

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

import ResetPassword from "./ResetPassword";
import Error from "./Error";

import Signup from "./students/SignUp";
import LoginStudents from "./students/LoginStudents";
import StudentProfile from "./students/StudentProfile";

import LoginTeacher from './teachers/LoginTeacher'
import TeacherProfile from './teachers/TeacherProfile';

import TeacherRoutes from './teachers/TeachersRoutes';
import StudentRoutes from './students/StudentsRoutes'

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route element={<Home />} path="/" exact />
          <Route element={<LoginStudents />} path="/student-login" exact />
          <Route element={<LoginTeacher />} path="/teacher-login" exact />
          <Route element={<Signup />} path="/signup" exact />
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
        <Route element={<ResetPassword />} path="/reset-password" exact />
        <Route path="*" element={<Error />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
