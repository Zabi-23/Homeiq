
//cilent/src/pages/UpdateListing.jsx


import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {useSelector} from 'react-redux';
export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const params = useParams(); // Get the listingId from the URL

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    const fetchListing = async () => {
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if(data.success === false) {
            console.log(data.message)
            return;
        }
        setFormData(data)
     
    };
    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      const promises = [];
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
          setImageUploadError(false);
          toast.success('Images uploaded successfully!');
        })
        .catch((error) => {
          console.error('Error uploading images:', error);
          setImageUploadError('Error uploading images. Max 2MB per image.');
          toast.error('Image upload failed!');
        })
        .finally(() => {
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError('Please select at least one image to upload.');
      toast.error('No images selected.');
    } else {
      setImageUploadError('You can only upload a maximum of 6 images.');
      toast.error('Too many images.');
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
    if (window.confirm('Are you sure you want to cancel?')) {
      navigate('/profile');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kontrollera att discountPrice är lägre än regularPrice om offer är true
    if (formData.offer && Number(formData.discountPrice) >= Number(formData.regularPrice)) {
      setImageUploadError('Discount price must be lower than regular price.');
      toast.error('Discount price must be lower than regular price.');
      return;
    }
  
    try {
      setUploading(true);
      setImageUploadError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setUploading(false);
      if (data.success === false) {
        setImageUploadError(data.message);
        toast.error(data.message);
      } else {
        toast.success('Listing created successfully!'); 
        navigate(` /listing/${data._id}`); // Redirect to the listing page
      }
    } catch (error) {
      setUploading(false);
      setImageUploadError(error.message);
      toast.error('Something went wrong. Try again.');
    }
  };
  
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <ToastContainer />
      <h1 className="text-3xl text-center font-semibold mt-4 my-7">Update Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        {/* Left Side */}
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            id="name"
            placeholder="Name"
            maxLength="62"
            minLength="5"
            required
            value={formData.name}
            onChange={handleChange}
            className="p-3 border border-slate-300 rounded-lg"
          />

          <textarea
            id="description"
            placeholder="Description"
            minLength="20"
            maxLength="800"
            required
            value={formData.description}
            onChange={handleChange}
            className="p-3 border border-slate-300 rounded-lg"
          />

          <input
            type="text"
            id="address"
            placeholder="Address"
            required
            value={formData.address}
            onChange={handleChange}
            className="p-3 border border-slate-300 rounded-lg"
          />

          {/* Radios for Rent/Sale */}
          <div className="flex gap-6">
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                id="sale"
                name="type"
                value="sale"
                onChange={() => setFormData((prev) => ({ ...prev, type: 'sale' }))}
                checked={formData.type === 'sale'}
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                id="rent"
                name="type"
                value="rent"
                onChange={() => setFormData((prev) => ({ ...prev, type: 'rent' }))}
                checked={formData.type === 'rent'}
                className="w-5"
              />
              <span>Rent</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 flex-wrap">
            {['parking', 'furnished', 'offer'].map((item) => (
              <div key={item} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={item}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [item]: e.target.checked }))
                  }
                  checked={formData[item]}
                  className="w-5"
                />
                <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
              </div>
            ))}
          </div>

          {/* Numeric inputs */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                value={formData.bedrooms}
                onChange={handleChange}
                className="p-3 border border-slate-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                value={formData.bathrooms}
                onChange={handleChange}
                className="p-3 border border-slate-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-1">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                value={formData.regularPrice}
                onChange={handleChange}
                className="p-3 border border-slate-300 rounded-lg"
              />
              <span className="text-xs">
                {formData.type === 'rent' ? '(Regular price $/month)' : '(Regular price $)'}</span>
            </div>
            {formData.offer && (

            <div className="flex flex-col gap-1">
              <input
                type="number"
                id="discountPrice"
                min="0"
                value={formData.discountedPrice}
                onChange={handleChange}
                className="p-3 border border-slate-300 rounded-lg"
              />
              <span className="text-xs">{formData.type === 'rent' ? '(Discounted price $/month)' : '(Discounted price $)'}</span>
            </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="text-center font-semibold">
            Images:
            <span className="font-normal text-gray-500 ml-2">(Max 6 images)</span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="border border-slate-300 rounded-lg p-3"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>

          {uploading && <p className="text-center text-blue-600">Uploading images...</p>}
          {imageUploadError && <p className="text-center text-red-600">{imageUploadError}</p>}

          {/* Uploaded images */}
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between border p-2 rounded-lg gap-4">
                  <div className="w-32 h-20">
                    <img src={url} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this image?')) {
                        setFormData((prev) => ({
                          ...prev,
                          ImageUrls: prev.imageUrls.filter((_, i) => i !== index),
                        }));
                        toast.info('Image deleted.');
                      }
                    }}
                    className="p-2 text-red-700 border border-red-700 rounded-lg uppercase hover:shadow-lg hover:opacity-85"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="p-3 text-white bg-slate-700 rounded-lg uppercase hover:shadow-lg">
            Update Listing
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-3 text-white bg-red-700 rounded-lg uppercase hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
