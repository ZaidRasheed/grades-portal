import { useState } from 'react'
import { UserAuth } from '../components/context/AuthContext'

export default function useSignUp() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const { createStudentAccount } = UserAuth();

    async function handleSignUp(email, password, passwordConfirm, firstName, lastName) {
        setError('')
        setLoading(true)

        if (password.length < 6) {
            setLoading(false)
            return setError('Weak Password.');
        }

        if (password !== passwordConfirm) {
            setLoading(false)
            return setError('Passwords do not match.');
        }

        if (firstName.length < 2 || lastName.length < 2) {
            setLoading(false)
            return setError('Please provide valid first and last names.');
        }

        const regName = /^[a-zA-Z ]+$/;

        if (!regName.test(firstName.trim()) || !regName.test(lastName.trim())) {
            setLoading(false)
            return setError('First and Last name can only contain alphabetical values.');
        }

        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!regEmail.test(email.trim())) {
            setLoading(false)
            return setError('Please provide a valid Email.');
        }

        let fullName = firstName.trim() + ` ${lastName.trim()}`;
        const studentData = {
            name: fullName,
            email: email.trim(),
            password: password
        }
        try {
            const res = await createStudentAccount(studentData)
            if (res.status === 'success') {
                setStatus('success')
            }
            else {
                setLoading(false);
                setError(res.message)
            }
        }
        catch (error) {
            setLoading(false)
            setError(error)
        }
    }

    return {
        error,
        loading,
        handleSignUp,
        status
    }
}
