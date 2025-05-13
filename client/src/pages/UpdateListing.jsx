import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function UpdateListing() {
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
  const [removedImages, setRemovedImages] = useState([]); // 🟢 Lagrar borttagna bilder
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/get/${params.listingId}`);
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, [params.listingId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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
          console.error('Upload error:', error);
          setImageUploadError('Upload failed. Images must be under 2MB.');
          toast.error('Image upload failed.');
        })
        .finally(() => {
          setUploading(false);
        });
    } else if (files.length === 0) {
      toast.error('No images selected.');
    } else {
      toast.error('Maximum 6 images allowed.');
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        reject,
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.offer && Number(formData.discountPrice) >= Number(formData.regularPrice)) {
      toast.error('Discount price must be lower than regular price.');
      return;
    }

    try {
      setUploading(true);

      // 🟢 Uppdatera listing med nya data
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      // 🟢 Skicka borttagna bilder till backend + radera från Firebase
      if (removedImages.length > 0) {
        await fetch(`/api/listing/delete-images/${params.listingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrls: removedImages }),
        });

        const storage = getStorage(app);
        for (const url of removedImages) {
          const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
          const imageRef = ref(storage, path);
          try {
            await deleteObject(imageRef);
            console.log('Deleted image from Firebase:', path);
          } catch (err) {
            console.warn('Could not delete from Firebase:', err.message);
          }
        }
      }

      toast.success('Listing updated successfully!');
      navigate(`/listing/${params.listingId}`);
    } catch (err) {
      console.error(err.message);
      toast.error('Update failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Cancel changes?')) {
      navigate('/profile');
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <ToastContainer />
      <h1 className="text-3xl text-center font-semibold my-7">Update Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        {/* Left */}
        <div className="flex flex-col flex-1 gap-4">
          <input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="p-3 border rounded" />
          <textarea id="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="p-3 border rounded" />
          <input type="text" id="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="p-3 border rounded" />

          <div className="flex gap-6">
            <label><input type="radio" value="sale" checked={formData.type === 'sale'} onChange={() => setFormData((prev) => ({ ...prev, type: 'sale' }))} /> Sell</label>
            <label><input type="radio" value="rent" checked={formData.type === 'rent'} onChange={() => setFormData((prev) => ({ ...prev, type: 'rent' }))} /> Rent</label>
          </div>

          <div className="flex gap-6 flex-wrap">
            {['parking', 'furnished', 'offer'].map((item) => (
              <label key={item}>
                <input type="checkbox" checked={formData[item]} onChange={(e) => setFormData((prev) => ({ ...prev, [item]: e.target.checked }))} />
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </label>
            ))}
          </div>

          <div className="flex gap-6">
            <input type="number" id="bedrooms" min="1" value={formData.bedrooms} onChange={handleChange} className="p-3 border rounded" />
            <input type="number" id="bathrooms" min="1" value={formData.bathrooms} onChange={handleChange} className="p-3 border rounded" />
          </div>

          <div className="flex gap-6">
            <input type="number" id="regularPrice" min="1" value={formData.regularPrice} onChange={handleChange} className="p-3 border rounded" />
            {formData.offer && (
              <input type="number" id="discountPrice" min="0" value={formData.discountPrice} onChange={handleChange} className="p-3 border rounded" />
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images: <span className="text-gray-500">(Max 6)</span></p>

          <div className="flex gap-4">
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="border p-3 rounded" />
            <button type="button" onClick={handleImageSubmit} className="border p-3 rounded text-green-700">Upload</button>
          </div>

          {uploading && <p className="text-blue-600">Uploading...</p>}
          {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}

          {/* 🟢 Visa befintliga bilder med delete-funktion */}
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-4 border p-2 rounded">
                  <img src={url} alt="listing" className="w-32 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this image?')) {
                        setFormData((prev) => ({
                          ...prev,
                          imageUrls: prev.imageUrls.filter((_, i) => i !== index),
                        }));
                        setRemovedImages((prev) => [...prev, url]); // 🟢 Spara URL för borttagning
                        toast.info('Image marked for deletion.');
                      }
                    }}
                    className="text-red-700 border border-red-700 p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="p-3 bg-slate-700 text-white rounded hover:shadow uppercase">Update Listing</button>
          <button type="button" onClick={handleCancel} className="p-3 bg-red-700 text-white rounded hover:shadow uppercase">Cancel</button>
        </div>
      </form>
    </main>
  );
}
