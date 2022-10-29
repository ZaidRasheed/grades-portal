import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";

import {
    collection, doc,
    getDocs,
    setDoc, getDoc, deleteDoc, updateDoc,
    arrayUnion
} from "firebase/firestore"

import { auth, db } from "../../firebase";

const UserContext = createContext();

export const UserAuth = () => {
    return useContext(UserContext);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(true)

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const sendResetPasswordLink = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    const logOut = () => {
        signOut(auth);
    }

    const createCredential = (email, password) => {
        const credential = EmailAuthProvider.credential(
            email,
            password
        )
        return credential;
    }

    const resetPassword = async (oldPassword, newPassword) => {
        try {
            const credential = createCredential(currentUser.email, oldPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword)
            return { status: 'success', message: 'Password updated successfully.' }
        }
        catch (error) {
            switch (error.code) {
                case 'auth/weak-password': {
                    return { status: 'error', message: 'Weak Password.' }
                }
                case 'auth/invalid-email': {
                    return { status: 'error', message: 'Please provide a valid email.' }
                }
                case 'auth/wrong-password': {
                    return { status: 'error', message: 'Wrong password please provide your current password, or reset your password through email.' }
                }
                default: {
                    return { status: 'error', message: 'Failed to update password.' }
                }
            }
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const studentRef = doc(db, 'students', user?.uid);
                    const studentSnap = await getDoc(studentRef);
                    const teacherRef = doc(db, 'teachers', user?.uid);
                    const teacherSnap = await getDoc(teacherRef);
                    if (teacherSnap.exists() || studentSnap.exists()) {
                        setCurrentUser(user)
                    }
                    else {
                        signOut(auth);
                    }
                }
                catch (error) {
                    setCurrentUser(null)
                }
                finally {
                    setLoading(false);
                }
            }
            else {
                setCurrentUser(null)
                setLoading(false);
            }
        });
        return () => {
            unsubscribe();
        };
    }, [])

    function getAllStudents() {
        const colRef = collection(db, 'students')
        return new Promise((resolve, reject) => {
            getDocs(colRef)
                .then(snapshot => {
                    let students = []
                    snapshot.docs.forEach(doc => {
                        students.push(doc.data())
                    })
                    resolve(students)
                })
                .catch(err => {
                    reject(err.message)
                })
        })
    }

    async function createStudentAccount(studentData) {
        try {
            const userCredential = await signUp(studentData.email, studentData.password)
            try {
                const student = {
                    id: userCredential.user.uid,
                    email: studentData.email,
                    name: studentData.name,
                    grades: [],
                }
                const studentRef = doc(db, 'students', userCredential.user.uid);
                await setDoc(studentRef, student)
                return { status: 'success', message: 'Account successfully created.' }
            }
            catch (error) {
                //! if the user could
                userCredential.user.delete()
                return { status: 'error', message: error.message }
            }
        }
        catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use': {
                    return { status: 'error', message: 'Email is already in use.' }
                }
                case 'auth/weak-password': {
                    return { status: 'error', message: 'Weak Password.' }
                }
                case 'auth/invalid-email': {
                    return { status: 'error', message: 'Please provide a valid email.' }
                }
                default: {
                    return { status: 'error', message: 'Failed to create an account.' }
                }
            }
        }
    }

    function getStudentData(studentID) {
        const docRef = doc(db, 'students', studentID);
        return new Promise((resolve, reject) => {
            getDoc(docRef)
                .then(student => {
                    if (student.exists)
                        return resolve(student);

                    return reject({ error: 'student is not found' })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    async function deleteAccount(password) {
        try {
            const credential = createCredential(currentUser.email, password);
            await reauthenticateWithCredential(currentUser, credential);
            const studentDoc = doc(db, 'students', currentUser.uid);
            await deleteDoc(studentDoc)
            currentUser.delete();
            return { status: 'success', message: 'Account successfully deleted.' }
        }
        catch (error) {
            return { status: 'error', message: error.message }
        }
    }

    function getTeacherData(teachersId) {
        const teacherRef = doc(db, 'teachers', teachersId);
        return new Promise((resolve, reject) => {
            getDoc(teacherRef)
                .then(res => {
                    if (res.exists())
                        return resolve(res.data());
                    return reject({ error: `Teacher Doesn't exist` })

                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    async function checkIfTeacher(id) {
        const teacherRef = doc(db, 'teachers', id);
        try {
            const teacher = await getDoc(teacherRef)
            if (teacher.exists()) {
                return true;
            }
            return false
        }
        catch (e) {
            return false
        }
    }

    async function addNewGrade(grade, email, students) {

        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !regEmail.test(email)) {
            return { status: 'error', message: 'Email invalid.' }
        }

        let studentId = null
        for (let i = 0; i < students.length; i++) {
            if (students[i].email === email.trim()) {
                studentId = students[i].id
                break
            }
        }
        if (!studentId) {
            return { status: 'error', message: 'No student found.' }
        }

        const regWholeNum = /^\d+$/
        const alphaNumeric = /^[\w\-\s]+$/

        if (!grade.name || !alphaNumeric.test(grade.name)) {
            return { status: 'error', message: 'Grade name invalid, please provide alpha numeric values only.' }
        }

        if (!grade.subject || !alphaNumeric.test(grade.subject)) {
            return { status: 'error', message: 'Grade subject is invalid, please provide a subject.' }
        }
        if (!regWholeNum.test(grade.mark) || !regWholeNum.test(grade.total)) {
            return { status: 'error', message: 'Invalid, Marks cant be negative.' }
        }

        if (!grade.mark || grade.mark < 0) {
            return { status: 'error', message: 'Invalid, Marks cant be negative.' }
        }

        if (!grade.total || grade.total < 1) {
            return { status: 'error', message: 'Invalid, Marks should be at least out of 1.' }
        }

        if (+grade.mark > +grade.total) {
            return { status: 'error', message: 'Invalid, Mark cant be greater than 100%.' }
        }

        const newGrade = {
            name: capitalizeFirstLetter(grade.name.trim()),
            mark: +grade.mark,
            total: +grade.total,
            percentage: +(((+grade.mark / +grade.total) * 100).toFixed(2)),
            subject: capitalizeFirstLetter(grade.subject.trim())
        }

        const studentRef = doc(db, 'students', studentId);
        try {
            await updateDoc(studentRef, { grades: arrayUnion(newGrade) })
            return { status: 'success', message: 'Mark successfully add' }
        }
        catch (e) {
            return { status: 'error', message: e.message }
        }


    }

    async function deleteGrade(studentID, name, subject) {
        try {
            const studentRef = doc(db, 'students', studentID);
            const student = await getDoc(studentRef);
            const grades = student.data().grades.filter(grade => {
                return (grade.name !== name || grade.subject !== subject)
            })
            try {
                await updateDoc(studentRef, { grades: grades })
                // !extra check to see if anything was deleted
                if (grades.length === student.data().grades.length)
                    return { status: 'error', message: "Error in deleting grade due to wrong referencing." };
                else
                    return { status: 'success', message: `${subject} ${name} was deleted successfully` }
            }
            catch (error) {
                return { status: 'error', message: error.message };
            }
        }
        catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async function editGrade(studentID, gradeName, gradeSubject, updatedGrade) {
        const docRef = doc(db, 'students', studentID);
        try {
            const student = await getStudentData(studentID)
            const grades = student.data().grades.map(grade => {
                if (grade.name === gradeName && grade.subject === gradeSubject) {
                    return updatedGrade
                }
                return grade
            })
            try {
                await updateDoc(docRef, { grades: grades })
                return { status: 'success', message: `${gradeSubject} ${gradeName} was updated successfully` }
            }
            catch (error) {
                return { status: 'error', message: error.message };
            }
        }
        catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    return (
        <UserContext.Provider value={{
            currentUser,
            signUp,
            logIn,
            sendResetPasswordLink,
            resetPassword,
            logOut,
            createCredential,

            getAllStudents,
            getStudentData,
            getTeacherData,
            createStudentAccount,
            deleteAccount,
            checkIfTeacher,
            addNewGrade,
            deleteGrade,
            editGrade

        }}>
            {!loading && children}
        </UserContext.Provider>
    )
}

