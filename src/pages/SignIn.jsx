//client/src/pages/SignUp.jsx
// client/src/pages/SignIn.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { OAuth } from '../componenets/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
         dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess({user: data.user, token: data.token}));
      navigate('/dashboard'); // eller till någon annan sida
    } catch (err) {
      console.error(err);
      dispatch(signInFailure(error.message));
      
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign-In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="bg-stone-50 focus:outline-none p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="bg-stone-50 focus:outline-none p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-600 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-75 p-3"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>
      </form>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      <p className="text-center mt-4">
        Don’t have an account?{' '}
        <Link to="/sign-up" className="text-slate-600 hover:underline">

          Sign-Up
        </Link>
      </p>
      <p className="text-center mt-4">
        <Link to="/" className="text-slate-600 hover:underline">
          Back to Home
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
