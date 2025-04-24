import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser} = useSelector((state) => state.user);
  console.log(currentUser)
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form  className='flex flex-col gap-4 max-w-2xl mx-auto p-4'>
        <img src={currentUser?.avatar} alt="profile" className='w-24 h-24 rounded-full mx-auto cursor-pointer
        self-center mt-2' />
        <input type="text" placeholder='Username' id='username' className='p-3 border border-slate-300 rounded-lg' />
        <input type="text" placeholder='Email' id='email' className='p-3 border border-slate-300 rounded-lg' />
        <input type="text" placeholder='Password' id='password' className='p-3 border border-slate-300 rounded-lg' />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>Update</button>

      </form>
      <div className='flex justify-between gap-4 max-w-2xl mx-auto p-4'>
        <span className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign out
        </span>


      </div>
    </div>
  )
}

export default Profile