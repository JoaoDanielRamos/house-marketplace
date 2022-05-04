// * Modules
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

// * Assets
import Spinner from '../components/Spinner';

// * Component
import ListItem from '../components/ListItem';

export default function Offers() {
  const [listings, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // * Get Reference
        const listingRef = collection(db, 'listings');

        // * Create a query
        const q = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // * Executing Query
        const querySnap = await getDocs(q);

        const listings: {}[] | any = [];

        querySnap.forEach(doc => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListing(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListing();
  }, []);

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map(
                (listing: { id: string | number; data: { name: string } }) => (
                  <ListItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                )
              )}
            </ul>
          </main>
        </>
      ) : (
        <>There are no current offers.</>
      )}
    </div>
  );
}
