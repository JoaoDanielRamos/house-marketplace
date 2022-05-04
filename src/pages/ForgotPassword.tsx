// * Modules
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

// * Assets
import Arrow from '../assets/svg/keyboardArrowRightIcon.svg?component';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  console.log('email:', email.length);

  const onSubmit = async (event: any) => {
    event.preventDefault();

    if (email.length <= 10) {
      toast.error('Email is too short or do not exist.');
    } else {
      try {
        const auth = getAuth();

        await sendPasswordResetEmail(auth, email);

        toast.success('An email was sent to you! Check your inbox');
      } catch (error) {
        toast.error('Could not send reset email.');
      }
    }
  };

  const onChange = (event: any) => {
    setEmail(event.target.value);
  };

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type='email'
            name='email'
            id='email'
            value={email}
            className='emailInput'
            placeholder='Email'
            onChange={onChange}
          />

          <Link className='forgotPasswordLink' to='/sign-in'>
            Sing In
          </Link>

          <div className='signInBar'>
            <div className='signInText'>Send Reset Link</div>
            <button className='signInButton'>
              <Arrow fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
