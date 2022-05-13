// * Modules
import { doc, getDoc, loadBundle } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';

export default function Contact() {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  const onChange = (e: any) => setMessage(e.target.value);

  useEffect(() => {
    const getLandLord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
        console.log('landlord', landlord);
      } else {
        toast.error('Could not get landlord data.');
      }
    };

    getLandLord();
  }, [params.landlordId]);

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                onChange={onChange}
              ></textarea>
            </div>
          </form>

          <a
            href={`mailto:${landlord.email}?Subject=${searchParams.get(
              'listingName'
            )}&body=${message}`}
          >
            <button className='primaryButton' type='button'>
              Send Message
            </button>
          </a>
        </main>
      )}
    </div>
  );
}
