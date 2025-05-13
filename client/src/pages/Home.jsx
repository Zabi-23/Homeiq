import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/swiper-bundle.css';
import 'swiper/css/bundle';
import ListingItem from '../componenets/ListingItem';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const { t, i18n } = useTranslation();

  SwiperCore.use([Navigation]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=6');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=6');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 text-xs px-2 py-1 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition z-50"
      >
        {i18n.language === 'sv' ? 'EN' : 'SV'}
      </button>

      {/* Hero Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-700 leading-tight">
          {t('homeTitle1')}{' '}
          <span className="text-slate-500">{t('homeTitle2')}</span>
          <br />
          <span className="text-slate-500">{t('homeTitle3')}</span>
        </h1>

        <div className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-3xl">
          {t('homeIntro')}
        </div>

        <Link
          to="/search"
          className="text-sm sm:text-base text-blue-800 font-bold hover:underline"
        >
          {t('homeStart')}

        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-4">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offer
              </h2>
              <Link
                to="/search?offer=true"
                className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
              >
                See all offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-4">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-4">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                to="/search?type=sale"
                className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
