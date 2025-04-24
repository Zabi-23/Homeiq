//client/src/componenets/OAuth.jsx
import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup  } from 'firebase/auth'
import { app } from '../firebase'
import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
export const OAuth = () => {
    const navigate = useNavigate()
    const dispatchEvent = useDispatch()
    const handleGoogleClick = async () => {
        try {
            const Provider = new GoogleAuthProvider();
             const auth = getAuth(app);

             const result = await signInWithPopup(auth, Provider);

             const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                }),
            });
            const data = await res.json();
            dispatchEvent(signInSuccess({ user: data, token: null }));

            navigate('/dashboard'); // Redirect to dashboard or any other page


             console.log(result);
        
        } catch (err) {
        console.log('could not sign in with google', err);
        }
    };
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>
        Continue with google</button>
  )
}
