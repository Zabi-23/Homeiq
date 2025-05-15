
/* import  {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'


export default function Search  ()  {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebardata, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: "desc",
    });

    const [loading , setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    console.log(listings);
    console.log(loading)
     
    useEffect(() => {
        const urlParms = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParms.get('searchTerm') ;
        const typeFromUrl = urlParms.get('type');
        const parkingFromUrl = urlParms.get('parking');
        const furnishedFromUrl = urlParms.get('furnished');
        const offerFromUrl = urlParms.get('offer');
        const sortFromUrl = urlParms.get('sort');
        const orderFromUrl = urlParms.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData ({
                
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === "true" ? true : false,
                furnished: furnishedFromUrl === "true" ? true : false,
                offer: offerFromUrl === "true" ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParms.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            setListings(data);
            setLoading(false);
          
        }
        fetchListings();
            
    },[location.search]);

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale' ) {
            setSidebarData((prev) => ({ ...prev, type: e.target.id }));
        }
        if(e.target.id === 'searchTerm' ) {
            setSidebarData({...sidebardata, searchTerm: e.target.value});

        }

        if(e.target.id === 'parking'  || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({...setSidebarData, [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false});
        }
        if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt'; 
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({...sidebardata, sort, order});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams  = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        console.log(searchQuery);
        navigate(`/search?${searchQuery}`);

    }
        
  return (
    <div className='flex flex-col md:flex-row'>
        <div className=' p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2' >
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" 
                    id='searchTerm'
                    name="searchTerm" placeholder='Search...'
                     className='bg-slate-400 p-3 rounded-lg w-full'
                     value={sidebardata.searchTerm}
                        onChange={handleChange}
                      />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>

                    <label className='font-semibold'> Type:</label>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='all'  className='w-5' />
                        <span>Rent & sale</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='rent'  className='w-5'
                          onChange={handleChange}
                          checked={sidebardata.type === "all"}
                         />
                        <span>Rent </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='sale'  className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type === "rent"}
                         />
                        <span> sale</span>  

                    </div>   
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='offer'  className='w-5'
                        onChange={handleChange}
                        checked={sidebardata.type === "sale"}
                         />
                        <span>Offer</span>
                    </div>  

                    <label className='font-semibold' > Amenities:</label>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='parking'  className='w-5'
                        onChange={handleChange}
                        checked={sidebardata.offer}
                         />
                        <span>Parking</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="radio" id='furnished'  className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.furnished}
                         
                        />
                        <span>Furnished </span>
                    </div>
                     
                    
                </div>

                <div className=' flex items-center gap-2'>
                    <label className='font-semibold' >Sort:</label>
                    <select
                    onChange={handleChange}
                    defaultValue={'createAt_at_desc'}


                     name="sort" id="sort_order" className='bg-slate-400 rounded-lg p-3'>
                        <option value="createAt_des">Latest</option>
                        <option value="createAt_asc">Oldest</option>
                        <option value="regularPrice_asc">Price: Low to High</option>
                        <option value="regularPrice_desc">Price: High to Low</option>
                      
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
 */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListingItem from '../componenets/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebardata, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  
  useEffect(() => {
    const urlParms = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParms.get('searchTerm');
    const typeFromUrl = urlParms.get('type');
    const parkingFromUrl = urlParms.get('parking');
    const furnishedFromUrl = urlParms.get('furnished');
    const offerFromUrl = urlParms.get('offer');
    const sortFromUrl = urlParms.get('sort');
    const orderFromUrl = urlParms.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParms.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData((prev) => ({ ...prev, type: e.target.id }));
    }

    if (e.target.id === 'searchTerm') {
      setSidebarData((prev) => ({ ...prev, searchTerm: e.target.value }));
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData((prev) => ({ ...prev, sort, order }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const ShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    urlParams.set('limit', 9);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings((prev) => [...prev, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      {/* Sidebar */}
      <div className='p-5 border-b-2 md:border-r-2 md:min-h-screen w-[90vw] sm:w-[300px] md:w-[360px] md:ml-2'>

        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              placeholder="Search..."
              className="bg-slate-400 p-3 rounded-lg w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            {['all', 'rent', 'sale'].map((type) => (
              <div key={type} className='flex items-center gap-2'>
                <input
                  type="radio"
                  id={type}
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === type}
                />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            {['parking', 'furnished', 'offer'].map((feature) => (
              <div key={feature} className='flex items-center gap-2'>
                <input
                  type="checkbox"
                  id={feature}
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata[feature]}
                />
                <span>{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
              name="sort"
              id="sort_order"
              className="bg-slate-400 rounded-lg p-3"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="regularPrice_desc">Price: High to Low</option>
            </select>
          </div>

          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>
            Search
          </button>
        </form>
      </div>

      {/* Listings */}
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5 '>Listing result:</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8 px-6 mt-6 auto-rows-fr'>
          {!loading && listings.length === 0 && (
            <p className='text-2xl font-semibold text-slate-700 p-2 col-span-full'>No listings found</p>
          )}

          {loading && (
            <p className='text-center text-2xl font-semibold text-slate-700 col-span-full'>Loading...</p>
          )}

          {!loading && listings.map((listing) => (
            <div key={listing._id} className='h-full flex flex-col'>

              <ListingItem key={listing._id} listing={listing} />
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {!loading && showMore && (
          <div className='flex justify-center mt-6 mb-10'>
            <button
              className='text-green-700 hover:underline p-3 text-lg'
              onClick={ShowMore}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
