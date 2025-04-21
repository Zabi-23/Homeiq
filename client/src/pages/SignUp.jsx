//client/src/pages/SignUp.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 className='text-3xl text-center font-semibold my-7'>Sign-Up</h1>
        <form className='flex flex-col gap-4'>
          <input type="text" placeholder='Enter your name' 
          className='  bg-stone-50 focus:outline-none p-3 rounded-lg' id= 'username'/>

          <input type="email" placeholder='Enter your email'
           className=' bg-stone-50 focus:outline-none p-3 rounded-lg ' id= 'email'/>

          <input type="password" placeholder='Enter your password' 
          className=' bg-stone-50 focus:outline-none  p-3 rounded-lg ' id= 'password'/>

          <button className='bg-slate-600 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-75 p-3 '>Sign-Up</button>
        </form>

         {/* Already have an account */}
           <p className='text-center mt-4'>
               Already have an account?{' '}
              <Link to="/sign-in" className='text-slate-600 hover:underline'>
                Sign-In
              </Link>
            </p>
            <p className='text-center mt-4'>
               <Link to="/" className='text-slate-600 hover:underline'>
                 Back to Home
               </Link>
            </p>

       </div>
  )
}

export default SignUp