import { useState } from 'react'
import { UserAuth } from '../components/context/AuthContext'

export default function useLogin() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const { logIn } = UserAuth();

    async function handleLogin(email, password) {
        setError('')
        setLoading(true);

        if (password < 6) {
            setLoading(false);
            return setError('Please provide a valid Password.');
        }
        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!regEmail.test(email.trim())) {
            setLoading(false);
            return setError('Please provide a valid Email.');
        }
        try {
            await logIn(email.trim(), password.trim());
            setStatus('success')
        }
        catch (error) {
            switch (error.code) {
                case 'auth/user-not-found': {
                    setError(`A username with this email doesn't exist, try signing up instead.`)
                    break;
                }
                case 'auth/wrong-password': {
                    setError('Wrong password please try again.')
                    break;
                }
                case 'auth/too-many-requests': {
                    setError('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.')
                    break;
                }
                case 'auth/user-disabled': {
                    setError('Account has been disabled.')
                    break;
                }
                default: {
                    setError('Failed to login.')
                }
            }
            setLoading(false);
        }
    }

    return {
        error,
        loading,
        handleLogin,
        status
    }
}