//client/src/pages/CreateListing.jsx
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    ImageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.ImageUrls.length <= 6) {
      const promises = [];
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({ ...prev, ImageUrls: [...prev.ImageUrls, ...urls] }));
          setImageUploadError(false);
          toast.success('Images uploaded successfully!');
        })
        .catch((error) => {
          console.error('Error uploading images:', error);
          setImageUploadError('Error uploading images. Please try again (max 2MB per image).');
          toast.error('Error uploading images!');
        })
        .finally(() => {
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError('Please select at least one image to upload.');
      toast.error('Please select at least one image.');
    } else {
      setImageUploadError('You can only upload a maximum of 6 images.');
      toast.error('Max 6 images allowed!');
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel creating this listing?')) {
      navigate('/profile');
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <ToastContainer />
      <h1 className='text-3xl text-center font-semibold mt-4 my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' className='p-3 border border-slate-300 rounded-lg' id='name' maxLength={62} minLength={8} required />
          <textarea placeholder='Description' className='p-3 border border-slate-300 rounded-lg' id='description' required />
          <input type='text' placeholder='Address' className='p-3 border border-slate-300 rounded-lg' id='address' required />

          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((item) => (
              <div className='flex gap-3' key={item}>
                <input type='checkbox' id={item} className='w-5' />
                <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-3'>
              <input type='number' id='bedrooms' min={1} max={10} required className='p-3 border border-slate-300 rounded-lg' />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-3'>
              <input type='number' id='bathrooms' min={1} max={10} required className='p-3 border border-slate-300 rounded-lg' />
              <p>Bathrooms</p>
            </div>
            <div className='flex items-center gap-3'>
              <input type='number' id='regularprice' min={1} required className='p-3 border border-slate-300 rounded-lg' />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>($/month)</span>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <input type='number' id='discountedprice' min={1} required className='p-3 border border-slate-300 rounded-lg' />
              <div className='flex flex-col items-center'>
                <p>Discount Price</p>
                <span className='text-xs'>($/month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='text-center font-semibold'>Images:
            <span className='font-normal text-gray-500 ml-2'>(First image is the cover, max 6)</span>
          </p>

          <div className='flex gap-4'>
            <input onChange={(e) => setFiles(e.target.files)} type='file' id='images' accept='image/*' multiple className='border border-slate-300 rounded-lg p-3' />
            <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80'>
              Upload
            </button>
          </div>

          {uploading && <p className='text-center text-blue-600'>Uploading images, please wait...</p>}
          {imageUploadError && <p className='text-red-600'>{imageUploadError}</p>}

          {formData.ImageUrls.length > 0 && (
            <div className='flex flex-col gap-4'>
              {formData.ImageUrls.map((url, index) => (
                <div key={index} className='flex items-center justify-between border p-2 rounded-lg gap-4'>
                  <div className='w-32 h-20'>
                    <img src={url} alt='uploaded' className='w-full h-full object-cover rounded-lg' />
                  </div>
                  <button
                    type='button'
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this image?')) {
                        setFormData((prev) => ({
                          ...prev,
                          ImageUrls: prev.ImageUrls.filter((_, i) => i !== index),
                        }));
                        toast.info('Image deleted.');
                      }
                    }}
                    className='p-2 text-red-700  rounded-lg uppercase hover:shadow-lg hover:opacity-85'
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className='p-3 text-white bg-slate-700 rounded-lg uppercase hover:shadow-lg'>Create Listing</button>
          <button type='button' onClick={handleCancel} className='p-3 text-white bg-red-700 rounded-lg uppercase hover:shadow-lg'>Cancel</button>
        </div>
      </form>
    </main>
  );
}
