// * Modules
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config.js';
console.log(db);

// * Assets
import ArrowRightAIcon from '../assets/svg/keyboardArrowRightIcon.svg?component';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

export default function SingUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const {
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
    timestamp?: any;
    delete?: number;
  } = formData;

  const navigate = useNavigate();

  const onChange = (event: any) => {
    setFormData(prevState => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const auth: any = getAuth();

      const userCredential: any = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy: {
        name: string;
        email: string;
        password: string | undefined;
        timestamp?: any;
        delete?: any;
      } = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
    } catch (error: any) {
      alert(error);
    }
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Create Account</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='text'
            name='name'
            id='name'
            value={name}
            className='nameInput'
            onChange={onChange}
            placeholder='Name'
          />

          <input
            type='email'
            name='email'
            id='email'
            value={email}
            className='emailInput'
            onChange={onChange}
            placeholder='Email'
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              className='passwordInput'
              value={password}
              onChange={onChange}
              placeholder='Password'
            />

            <img
              src={visibilityIcon}
              className='showPassword'
              onClick={() => setShowPassword(prevState => !prevState)}
            />
          </div>

          <div className='signInBar'>
            <p className='siInText'>Sing Up</p>
            <button className='signInButton'>
              <ArrowRightAIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* Google OAuth */}

        <Link to='/sign-in' className='registerLink'>
          Already have an account? Sign In.
        </Link>
      </div>
    </>
  );
}
