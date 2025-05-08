import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import  SwiperCore  from 'swiper';
import  'swiper/swiper-bundle.css';
import 'swiper/css/bundle';
import ListingItem from '../componenets/ListingItem';


export default function Home  () {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings, rentListings, offerListings)

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();  
      } catch (error) {
        console.error(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchOfferListings();
  }, [])

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl '> FInd your next
           <span className='text-slate-500'>perfect</span>
          <br/>
          place with ease </h1>

          <div className='text-gray-400 text-xs sm:text-sm '>
            HomeIQ is a real estate platform that connects buyers, sellers, and renters with properties <br/>
             that meet their needs. Our mission is to make the process of finding a home as easy and efficient <br/>
              as possible. We offer a wide range of properties, from apartments to single-family homes, and provide <br/>
              tools and resources to help you make informed decisions.
          </div>
          <Link to='/search' className='text-xs sm:text-sm text-blue-800 font-bold hover:underline '>
          Let's get started....</Link>

      </div>


      {/* swiper */}
      <Swiper navigation>

      {
       offerListings && offerListings.length > 0 && 
        offerListings.map((listing) => (
            <SwiperSlide>
              <div style={{background: `url(${listing.imageUrls[0]
                }) center no-repeat`, backgroundSize:"cover"}} className='h-[500px]' key={listing._id}>
               
              </div>
            </SwiperSlide>
          ))
      }
      </Swiper>



      {/* listing result for offer, sale, and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-4'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offer</h2>
              <Link to='/search?offer=true' className='text-xs sm:text-sm text-blue-800 font-bold hover:underline '>
                See all offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
                ))}

            </div>
          </div>
        )}
         {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-4'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link to='/search?type=rent' className='text-xs sm:text-sm text-blue-800 font-bold hover:underline '>
                Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
                ))}

            </div>
          </div>
        )}
         {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-4'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link to='/search?type=sale' className='text-xs sm:text-sm text-blue-800 font-bold hover:underline '>
                Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
                ))}

            </div>
          </div>
        )}

      </div>
      
    </div>
  )
}

