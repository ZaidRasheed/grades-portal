import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";

import {
    collection, doc,
    getDocs,
    setDoc, getDoc, deleteDoc, updateDoc,
    arrayUnion
} from "firebase/firestore"

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
                        students.push(doc.data())
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

    async function addNewGrade(studentId, newGrade) {
        const studentRef = doc(db, 'students', studentId);
        return new Promise((resolve, reject) => {
            updateDoc(studentRef, { grades: arrayUnion(newGrade) })
                .then(res => {
                    resolve({ state: 'success' });
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    async function deleteGrade(studentID, gradeName, gradeSubject) {
        try {
            const studentRef = doc(db, 'students', studentID);
            const studentDoc = await getDoc(studentRef);
            let student = studentDoc.data()
            const grades = student.grades.filter(grade => {
                return (grade.name !== gradeName || grade.subject !== gradeSubject)
            })
            return new Promise((resolve, reject) => {
                return new updateDoc(docRef, { grades: grades })
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
            return new Promise((resolve, reject) => {
                return new updateDoc(docRef, { grades: grades })
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
            deleteAccount,
            createCredential,
            reAuth,

            getAllStudents,
            getStudentData,
            getTeacherData,
            addStudent,
            deleteStudent,
            checkIfTeacher,
            addNewGrade,
            deleteGrade,
            editGrade

        }}>
            {!loading && children}
        </UserContext.Provider>
    )
}

