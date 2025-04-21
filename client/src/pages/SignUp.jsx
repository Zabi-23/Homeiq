// client/src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      console.log(data);
      navigate('/sign-in'); // Redirect to Sign-In page on success
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign-Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          className="bg-stone-50 focus:outline-none p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/sign-in" className="text-slate-600 hover:underline">
          Sign-In
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

export default SignUp;
