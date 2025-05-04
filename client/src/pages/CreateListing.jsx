//client/src/pages/CreateListing.jsx
import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-center font-semibold mt-4 my-7'>Create Listing</h1>
        <form className=' flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
            <input type='text' placeholder='Name' className='p-3 border border-slate-300
             rounded-lg' id='name' maxLength={62} minLength={8} required/>
            <textarea placeholder='Description' className='p-3 border border-slate-300 rounded-lg'
            id='description' required />
            <input type='text' placeholder='Address' className='p-3 border border-slate-300 rounded-lg' id='address' required />

            <div className=' flex gap-6 flex-wrap'>
                <div className='flex gap-3'>
                    <input type="checkbox" id='sale' className='w-5' />
                    <span>Sell</span>

                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id='rent' className='w-5' />
                    <span>Rent</span>

                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id='parking' className='w-5' />
                    <span>Parking spot</span>

                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id='furnished' className='w-5' />
                    <span>Furnished</span>

                </div>
                <div className='flex gap-3'>
                    <input type="checkbox" id='offer' className='w-5' />
                    <span>Offer</span>

                </div>
            
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-3'>
                    <input type="number" id='bedrooms' min={1} max={10} required
                    className='p-3 border border-slate-300 rounded-lg' />
                    <p>Beds</p>

                </div>
                <div className='flex items-center gap-3'>
                    <input type="number" id='bathrooms' min={1} max={10} required
                    className='p-3 border border-slate-300 rounded-lg' />
                    <p>Bathroom</p>

                </div>
                <div className='flex items-center gap-3'>
                    <input type="number" id='regularprice' min={1} max={10} required
                    className='p-3 border border-slate-300 rounded-lg' />
                    <div className='flex flex-col items-center'>
                    <p>Regular Price</p>
                     <span className='text-xs'>($/month )</span>
                    </div>


                </div>
                <div className='flex items-center gap-3'>
                    <input type="number" id='discountedprice' min={1} max={10} required
                    className='p-3 border border-slate-300 rounded-lg' />
                    <div className='flex flex-col items-center'>
                    <p>Discount Price</p>
                     <span className='text-xs'>($/month )</span>
                    </div>

                </div>

            </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='text-center font-semibold'>Images:
                <span className='font-normal text-gray-500 ml-2'>The first image will be the cover (max 6)</span>
                     </p>
                <div className='flex gap-4'>
                    <input type="file" id='images' accept='image/*' multiple className='border border-slate-300 rounded-lg p-3' />
                    <button className='p-3 text-green-700 border border-green-700 
                     rounded-lg uppercase hover:shadow-lg disabled:opacity-80 ' > Upload</button>
                </div>
                    <button className='p-3 text-white bg-slate-700 rounded-lg uppercase hover:shadow-lg'> Create Listing</button>
                    <button className='p-3 text-white bg-red-700 rounded-lg uppercase hover:shadow-lg'> Cancel</button>
                </div>
               
                
        </form>
    </main>
  )
}
