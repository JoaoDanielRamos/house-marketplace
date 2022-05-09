// * Modules
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// * Firebase / Firestore
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
console.log(db);

// * Components
import Spinner from '../components/Spinner';

export default function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GEOCODING_API;

  const [formData, setFormData]: [formData: any, setFormData: any] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    address: '',
    images: [],
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    offer,
    regularPrice,
    discountedPrice,
    address,
    images,
    latitude,
    longitude,
  } = formData;

  const auth: any = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const onMutate = (event: any) => {
    let boolean: boolean | null = null;

    if (event.target.value === 'true') {
      boolean = true;
    } else if (event.target.value === 'false') {
      boolean = false;
    }

    // Files
    if (event.target.files) {
      setFormData((prevState: any) => ({
        ...prevState,
        images: event.target.files,
      }));
    }

    // Text/Booleans/Numbers
    if (!event.target.files) {
      setFormData((prevState: any) => ({
        ...prevState,
        [event.target.id]: boolean ?? event.target.value,
      }));
    }
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    console.log(formData);

    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discounted price needs to be less than regular price');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('Max 6 images');
      return;
    }

    let geolocation: { lat?: number; lng?: number } = {};
    let location;

    if (geolocationEnabled) {
      const response: any = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address.replaceAll(
          ' ',
          '+'
        )}&key=${apiKey}`
      );

      geolocation.lat = response.data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = response.data.results[0]?.geometry.location.lng ?? 0;

      location =
        response.data.status === 'ZERO_RESULTS'
          ? undefined
          : response.data.results[0]?.formatted_address;

      if (location === undefined || location.includes('undefined')) {
        toast.error('Please, enter a correct address.');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    const storeImage = async (image: any) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          error => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map(image => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Image not uploaded');
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.address;
    if (location) formDataCopy.location = location;
    !formDataCopy.Offer && delete formDataCopy.discountedPrice;
    console.log('formDataCopy', formDataCopy);

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);

    setLoading(false);
    toast.success('Listing saved');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, user => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
          });
        } else {
          navigate('');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className='profile'>
        <header>
          <p className='pageHeader'>Create a listing</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            {/* // * SELL OR RENT PICK */}
            <label className='formLabel'>Sell / Rent</label>
            <div className='formButtons'>
              <button
                type='button'
                className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                id='type'
                value='sale'
                onClick={onMutate}
              >
                Sell
              </button>
              <button
                type='button'
                className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                id='type'
                value='rent'
                onClick={onMutate}
              >
                Rent
              </button>
            </div>

            {/* // * NAME */}
            <label className='formLabel'>Name</label>
            <input
              className='formInputName'
              type='text'
              id='name'
              value={name}
              onChange={onMutate}
              maxLength={32}
              minLength={10}
              required
            />

            {/* // * ROOM */}
            <div className='formRooms flex'>
              <div>
                <label className='formLabel'>Bedrooms</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='bedrooms'
                  value={bedrooms}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Bathrooms</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='bathrooms'
                  value={bathrooms}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
            </div>

            {/* // * PARKING */}
            <label className='formLabel'>Parking spot</label>
            <div className='formButtons'>
              <button
                className={parking ? 'formButtonActive' : 'formButton'}
                type='button'
                id='parking'
                value={true}
                onClick={onMutate}
                min='1'
                max='50'
              >
                Yes
              </button>
              <button
                className={
                  !parking && parking !== null
                    ? 'formButtonActive'
                    : 'formButton'
                }
                type='button'
                id='parking'
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            {/* // * FURNISHED */}
            <label className='formLabel'>Furnished</label>
            <div className='formButtons'>
              <button
                className={furnished ? 'formButtonActive' : 'formButton'}
                type='button'
                id='furnished'
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !furnished && furnished !== null
                    ? 'formButtonActive'
                    : 'formButton'
                }
                type='button'
                id='furnished'
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            {/* // * ADDRESS */}
            <label className='formLabel'>Address</label>
            <textarea
              className='formInputAddress'
              type='text'
              id='address'
              value={address}
              onChange={onMutate}
              required
            />

            {/* // * GEOLOCATION */}
            {!geolocationEnabled && (
              <div className='formLatLng flex'>
                <div>
                  <label className='formLabel'>Latitude</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='latitude'
                    value={latitude}
                    onChange={onMutate}
                    required
                  />
                </div>
                <div>
                  <label className='formLabel'>Longitude</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='longitude'
                    value={longitude}
                    onChange={onMutate}
                    required
                  />
                </div>
              </div>
            )}

            {/* // * OFFER */}
            <label className='formLabel'>Offer</label>
            <div className='formButtons'>
              <button
                className={offer ? 'formButtonActive' : 'formButton'}
                type='button'
                id='offer'
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !offer && offer !== null ? 'formButtonActive' : 'formButton'
                }
                type='button'
                id='offer'
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            {/* // * REGULAR PRICE */}
            <label className='formLabel'>Regular Price</label>
            <div className='formPriceDiv'>
              <input
                className='formInputSmall'
                type='number'
                id='regularPrice'
                value={regularPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required
              />
              {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
            </div>
            {offer && (
              <>
                <label className='formLabel'>Discounted Price</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                  required={offer}
                />
              </>
            )}

            {/* // * IMAGES */}
            <label className='formLabel'>Images</label>
            <p className='imagesInfo'>
              The first image will be the cover (max 6).
            </p>
            <input
              className='formInputFile'
              type='file'
              id='images'
              onChange={onMutate}
              max='6'
              accept='.jpg,.png,.jpeg'
              multiple
              required
            />

            {/* // * SUBMIT */}
            <button type='submit' className='primaryButton createListingButton'>
              Create Listing
            </button>
          </form>
        </main>
      </div>
    );
  }
}
