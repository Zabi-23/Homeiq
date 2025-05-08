import React from 'react'

export default function Search  ()  {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className=' p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form  className='flex flex-col gap-8'>
                <div className='flex items-center gap-2' >
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" 
                    id='searchTerm'
                    name="searchTerm" placeholder='Search...'
                     className='bg-slate-400 p-3 rounded-lg w-full' />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>

                    <label className='font-semibold'> Type:</label>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='all'  className='w-5' />
                        <span>Rent & sale</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='rent'  className='w-5' />
                        <span>Rent </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='sale'  className='w-5' />
                        <span> sale</span>  

                    </div>   
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='offer'  className='w-5' />
                        <span>Offer</span>
                    </div>  

                    <label className='font-semibold' > Amenities:</label>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='parking'  className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='furnished'  className='w-5' />
                        <span>Furnished </span>
                    </div>
                     
                    
                </div>

                <div className=' flex items-center gap-2'>
                    <label className='font-semibold' >Sort:</label>
                    <select name="sort" id="sort" className='bg-slate-400 rounded-lg p-3'>
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      
                    </select>

                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg
                 uppercase hover:opacity-90'>Search</button>

            </form>
        </div>

        <div className=''>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing result:</h1>
        </div>
    </div>
  )
}
