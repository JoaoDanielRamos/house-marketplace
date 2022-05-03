//* Modules
import { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../firebase.config';
import { updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Profile() {
  const auth: any = getAuth();
  const [changeDetails, setChangeDetails]: any = useState();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const navigate = useNavigate();

  // * LogOut user and redirect to home page
  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  // * Update user info on Firebase / Firestore
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update Display Name in Firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  // * Change the formData values based on user input
  const onChange = (event: any) => {
    setFormData(prevState => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  return (
    <>
      <div className='profile'>
        <header className='profileHeader'>
          <p className='pageHeader'>My Profile</p>
          <button type='button' className='logOut' onClick={onLogout}>
            Logout
          </button>
        </header>

        <main>
          <div className='profileDetailsHeader'>
            <p className='profileDetailsText'>Personal Details</p>
            <p
              className='changePersonalDetails'
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState: any) => !prevState);
              }}
            >
              {changeDetails ? 'done' : 'change'}
            </p>
          </div>
          <div className='profileCard'>
            <form>
              <input
                type='text'
                id='name'
                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type='text'
                id='email'
                className={
                  !changeDetails ? 'profileEmail' : 'profileEmailActive'
                }
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
