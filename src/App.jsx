import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthContextProvider } from "./context/AuthContext"
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import LoadingSpinner from './components/UI/LoadingSpinner'

const Home = lazy(() => import('./pages/Home'))

const PrivateRoutes = lazy(() => import("./routes/PrivateRoutes"))
const PublicRoutes = lazy(() => import("./routes/PublicRoutes"))

const TeacherRoutes = lazy(() => import('./routes/TeachersRoutes'))
const StudentRoutes = lazy(() => import('./routes/StudentsRoutes'))

const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const Error = lazy(() => import("./pages/Error"))

const Signup = lazy(() => import("./pages/SignUp"))
const LoginStudents = lazy(() => import("./pages/LoginStudents"))
const StudentProfile = lazy(() => import("./pages/StudentProfile"))

const LoginTeacher = lazy(() => import('./pages/LoginTeacher'))
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'))



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
