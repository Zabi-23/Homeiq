import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess, signOutUserFailure, signOutUserStart,signOutUserSuccess } from '../redux/user/userSlice';
import { Link,useNavigate} from 'react-router-dom';


import { useDispatch } from 'react-redux';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showListingError, setShowListingError] = useState(false); 
  const [userListing, setUserListing] = useState([]); // State to store user listings
 

  const handleFileUpload = useCallback((file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setFilePerc(0);
    setFileUploadError(false);
    setUploadSuccess(false);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
        setFileUploadError(true);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('Download URL:', downloadURL);

        // ✅ TA BORT GAMMAL BILD om den finns och inte är gravatar/google
        if (formData.avatar && !formData.avatar.includes('gravatar.com') && !formData.avatar.includes('googleusercontent.com')) {
          const oldImageRef = ref(storage, formData.avatar);
          try {
            await deleteObject(oldImageRef);
            console.log('Old image deleted successfully');
          } catch (error) {
            console.warn('Failed to delete old image:', error);
          }
        }

        // ✅ Spara nya bildens URL
        setFormData((prev) => ({
          ...prev,
          avatar: downloadURL,
        }));

        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setFilePerc(0);
        }, 9000); // success-text syns i 9 sekunder
      }
    );
  }, [formData.avatar]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleDeleteUser = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(signOutUserFailure(data.message));
          console.error('Failed to delete account:', data.message);
          return;
        }
        console.log('Account deleted successfully');
        setDeleteSuccess(true);
        dispatch(signOutUserSuccess());  // ✔️ bättre här också
        navigate('/sign-in');
      } catch (error) {
        dispatch(signOutUserFailure(error.message));
        console.error('Error deleting account:', error.message);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      



    } catch (error) {
      dispatch(updateUserFailure(error.message));
     
    }
    
  }

  // 🟢 Sign out function
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart()); // 🟢 1. Starta logout loading
      const res = await fetch('http://localhost:3000/api/auth/signout', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message)); // 🔴 3. Om fel: sätt error
        console.error('Failed to sign out:', data.message);
        return;
      }
      dispatch(signOutUserSuccess()); // 🟢 2. Om allt gick bra: clear user
      navigate('/sign-in'); // ➡️ Redirect till sign-in
    } catch (error) {
      dispatch(signOutUserFailure(error.message)); // 🔴 3. Vid error: error
      console.error('Error signing out:', error.message);
    }
  };
   
  // 🟢 Show listings function
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`http://localhost:3000/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data); // Store the listings in state
      console.log('User listings:', data);
    } catch (error) {
      setShowListingError(true);
      console.error('Error fetching listings:', error.message);
    }
  };
  

  
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-2xl mx-auto p-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar || '/default-avatar.png'}
          alt='profile'
          className='w-24 h-24 rounded-full mx-auto cursor-pointer self-center mt-2'
        />

        {/* 🟢 Upload status feedback */}
        {filePerc > 0 && filePerc < 100 && (
          <p className='text-center text-gray-500'>{filePerc}% uploaded</p>
        )}

        {uploadSuccess && (
          <p className='text-center text-green-600'>Upload successful!</p>
        )}

        {fileUploadError && (
          <div className='text-center text-red-700'>
            <p>Upload failed!</p>
            <p>(Image must be less than 2 MB)</p>
          </div>
        )}

        <input type='text' placeholder='Username' defaultValue={currentUser.username} id='username' className='p-3 border border-slate-300 rounded-lg' onChange={handleChange} />
        <input type='email' placeholder='Email' id='email' defaultValue={currentUser.email} className='p-3 border border-slate-300 rounded-lg' onChange={handleChange} />
        <input type='password' placeholder='Password' id='password' className='p-3 border border-slate-300 rounded-lg' onChange={handleChange} />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>Update</button>
        <Link className='bg-green-700 text-slate-100 p-3 rounded-lg uppercase text-center hover:opacity-90 ' to={"/create-listing"} >
        Create Listing
        </Link>
      </form>

      <div className='flex justify-between gap-4 max-w-2xl mx-auto p-4'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>

        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      
      {updateSuccess && (
        <p className='text-center text-green-600'> User is updated successful!</p>
      )}

      {deleteSuccess && (
        <p className='text-center text-red-600'> User is deleted successful!</p>
      )}
      <button onClick={handleShowListings} className='text-green-700 w-full' >Show Listings</button>
      {showListingError && (
        <p className='text-center text-red-600'> Failed to fetch listings!</p>
      )}

      {userListing && userListing.length > 0 && (
      <div className='flex flex-col gap-4 max-w-2xl mx-auto p-4'>
        <h2 className='text-2xl font-semibold text-center mt-7'>Your Listings</h2>
        {userListing.map((listing) => (
         <div key={listing._id} className='border border-slate-300 rounded-lg p-3  my-4 max-w-2xl mx-auto flex justify-between items-center gap-4'>
           <Link to= {`/listing/${listing._id}`} className='text-blue-700 hover:underline'>
             <img src={listing.imageUrls[0]} alt={listing.cover} className='h-16 w-16 object-contain rounded-lg' />
           </Link>
           <Link className='text-slate-700 font-semibold hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
             <p >{listing.name}</p>
           </Link>
           <div className='flex flex-col items-center'>
             <button className='text-red-700 uppercase'>Delete</button>
             <button className='text-green-700 uppercase'>Edit</button>
 
           </div>
 
         </div>
        ))}
      </div>
      )}

    </div>
  );
};


  export default Profile;






