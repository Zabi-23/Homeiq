
import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md"
export default function ListingItem({ listing }) {
  return <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
    <Link to={`/listing/${listing._id}`} >
      <img src={listing.imageUrls[0]} alt='listing cover' 
      className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 duration-300" />

        <div className="p-3 flex flex-col gap-2 w-full">
            <p className="text-lg font-semibold text-slate-700 truncate ">{listing.name}</p>

            <div className="flex items-center gap-2  ">
                <MdLocationOn className="h-5 w-5 text-green-500"/>
                {/* <span className="text-sm text-slate-500">{listing.address}</span> */}
                <p className="text-sm text-slate-500 truncate">{listing.address}</p>
                
            </div>
            <p className=" text-sm text-gray-600 line-clamp-2">{listing.description}</p>
            <p className="text-lg font-semibold text-slate-500 mt-2">
                {listing.offer ?listing.discountPrice : listing.regularPrice }
                {listing.type === 'rent' && '/month'} $</p>

                <div className=" text-slate-700 flex gap-4">
                    <div className="font-bold text-xs">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : '1 bed'}

                    </div>
                    <div className="font-bold text-xs">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : '1 bath'}

                    </div>

                </div>

        </div>
     
    </Link>
  </div>
}