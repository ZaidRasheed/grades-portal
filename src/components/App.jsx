import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthContextProvider } from "./context/AuthContext"
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './Home'

import PrivateRoutes from "./PrivateRoutes"
import PublicRoutes from "./PublicRoutes"

import TeacherRoutes from './teachers/TeachersRoutes'
import StudentRoutes from './students/StudentsRoutes'

import LoadingSpinner from './UI/LoadingSpinner'

const ResetPassword = lazy(() => import("./ResetPassword"))
const Error = lazy(() => import("./Error"))

const Signup = lazy(() => import("./students/SignUp"))
const LoginStudents = lazy(() => import("./students/LoginStudents"))
const StudentProfile = lazy(() => import("./students/StudentProfile"))

const LoginTeacher = lazy(() => import('./teachers/LoginTeacher'))
const TeacherProfile = lazy(() => import('./teachers/TeacherProfile'))



function App() {
  return (
    <AuthContextProvider>
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </AuthContextProvider>
  )
}

export default App
