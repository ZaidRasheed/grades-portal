import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signOut,
    updatePassword,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";

import {
    collection, doc,
    getDocs,
    setDoc, getDoc, deleteDoc, updateDoc,
    arrayUnion, query, where,
} from 'firebase/firestore'

import { auth, db } from "../../firebase.jsx";

const UserContext = createContext();

export const UserAuth = () => {
    return useContext(UserContext);
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

    const resetPassword = (password) => {
        return updatePassword(currentUser, password)
    }

    const updateName = (name) => {
        return updateProfile(currentUser, {
            displayName: name
        })
    }
    const deleteAccount = () => {
        currentUser.delete();
    }

    const createCredential = (email, password) => {
        const credential = EmailAuthProvider.credential(
            email,
            password
        )
        return credential;
    }
    const reAuth = (currentUser, credential) => {
        return reauthenticateWithCredential(currentUser, credential);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setCurrentUser(user)
            }
            else {
                setCurrentUser(null)
            }
            setLoading(false);
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
                        students.push({ ...doc.data(), id: doc.id })
                    })
                    resolve(students)
                })
                .catch(err => {
                    reject(err.message)
                })
        })
    }

    function addStudent(student, id) {
        const docRef = doc(db, 'students', id);
        return new Promise((resolve, reject) => {
            setDoc(docRef, student)
                .then(res => {
                    resolve({ state: 'success' });
                })
                .catch(err => {
                    reject(err)
                })
        })
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

    function getAllTeachersEmails() {
        const colRef = collection(db, 'teachers')
        return new Promise((resolve, reject) => {
            getDocs(colRef)
                .then(snapshot => {
                    let teachers = []
                    snapshot.docs.forEach(doc => {
                        teachers.push(doc.data().email)
                    })
                    resolve(teachers)
                })
                .catch(err => {
                    reject(err.message)
                })
        })
    }

    function getAllStudentsEmails() {
        const colRef = collection(db, 'students')
        return new Promise((resolve, reject) => {
            getDocs(colRef)
                .then(snapshot => {
                    let studentsEmails = []
                    snapshot.docs.forEach(doc => {
                        studentsEmails.push(doc.data().email)
                    })
                    // console.log(studentsEmails)
                    resolve(studentsEmails)
                })
                .catch(err => {
                    reject(err.message)
                })
        })
    }

    function deleteStudent(id) {
        const docRef = doc(db, 'students', id);
        return new Promise((resolve, reject) => {
            deleteDoc(docRef)
                .then(res => {
                    resolve({ state: 'success' });
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    function getTeacherData(teachersId) {
        const teacherRef = doc(db, 'teachers', teachersId);
        return new Promise((resolve, reject) => {
            getDoc(teacherRef)
                .then(res => {
                    if (res.exists())
                        return resolve(res.data());
                    return reject({ error: "Teacher Doesn't exist" })

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

    async function checkIfStudent(email) {
        try {
            const studentEmails = await getAllStudentsEmails();
            if (studentEmails.includes(email)) {
                return true;
            }
            return false
        }
        catch (e) {
            return false
        }
    }

    async function addNewGrade(studentEmail, newGrade) {
        const q = query(collection(db, "students"), where("email", "==", studentEmail));
        const querySnapshot = await getDocs(q);
        let id = null
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            id = doc.id;
        });
        const docRef = doc(db, 'students', id);
        return new Promise((resolve, reject) => {
            updateDoc(docRef, { grades: arrayUnion(newGrade) })
                .then(res => {
                    resolve({ state: 'success' });
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    async function deleteGrade(studentID, gradeName) {
        const docRef = doc(db, 'students', studentID);
        try {
            const student = await getStudentData(studentID)
            const newData = {
                email: student.data().email,
                name: student.data().name,
                grades: student.data().grades.filter(grade => {
                    return grade.name !== gradeName
                }),
                id: studentID
            }
            return new Promise((resolve, reject) => {
                return new setDoc(docRef, newData)
                    .then(res => {
                        resolve({ state: 'success' });
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
        catch (e) {
            return { error: e };
        }
    }

    async function editGrade(studentID, gradeName, updatedGrade) {
        const docRef = doc(db, 'students', studentID);
        try {
            const student = await getStudentData(studentID)
            const newData = {
                email: student.data().email,
                name: student.data().name,
                grades: student.data().grades.map(grade => {
                    if (grade.name === gradeName) {
                        return updatedGrade
                    }
                    return grade
                }),
                id: studentID
            }
            return new Promise((resolve, reject) => {
                return new setDoc(docRef, newData)
                    .then(res => {
                        resolve({ state: 'success' });
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
        catch (e) {
            return { error: e };
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
            updateName,
            deleteAccount,
            createCredential,
            reAuth,

            getAllStudents,
            getStudentData,
            getTeacherData,
            addStudent,
            getAllTeachersEmails,
            getAllStudentsEmails,
            deleteStudent,
            checkIfStudent,
            checkIfTeacher,
            addNewGrade,
            deleteGrade,
            editGrade

        }}>
            {!loading && children}
        </UserContext.Provider>
    )
}

