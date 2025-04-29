import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../firebase';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 max-w-2xl mx-auto p-4'>
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

        <input type='text' placeholder='Username' id='username' className='p-3 border border-slate-300 rounded-lg' />
        <input type='email' placeholder='Email' id='email' className='p-3 border border-slate-300 rounded-lg' />
        <input type='password' placeholder='Password' id='password' className='p-3 border border-slate-300 rounded-lg' />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>Update</button>
      </form>

      <div className='flex justify-between gap-4 max-w-2xl mx-auto p-4'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
};

export default Profile;






