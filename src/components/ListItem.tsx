import { Link } from 'react-router-dom';
import DeleteIcon from '../assets/svg/deleteIcon.svg?component';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

export default function ListItem({ listing, id }) {
  return (
    <li className='categoryListing'>
      <Link
        to={`/category/${listing.type}/${id}`}
        className='categoryListingLink'
      >
        <img src={listing.imageUrls[0]} alt='' className='categoryListingImg' />
        <div className='categoryListingDetails'>
          <p className='categoryListingLocation'>{listing.location}</p>
          <p className='categoryListingName'>{listing.name}</p>
          <p className='categoryListingPrice'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, '')
              : listing.RegularPrice.toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ''
                )}
            {listing.type === 'rent' && ' / Month'}
          </p>
          <div className='categoryListingInfoDiv'>
            <img src={bedIcon} alt='bed' />
            <p className='categoryListingInfoText'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : `${listing.bedrooms} Bedroom`}
            </p>
            <img src={bathtubIcon} alt='bed' />
            <p className='categoryListingInfoText'>
              {listing.bedrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : `${listing.bathrooms} Bathroom`}
            </p>
          </div>
        </div>
      </Link>

      {/* {onDelete && (
        <DeleteIcon
          className='removeIcon'
          fill='rgb(231, 76, 50'
          width=''
          height=''
          onClick={() => {
            onDelete(listing.id, listing.name);
          }}
        />
      )} */}
    </li>
  );
}
