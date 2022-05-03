// * Modules
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// * Assets
import ArrowRightAIcon from '../assets/svg/keyboardArrowRightIcon.svg?component';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

export default function SingIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (event: any) => {
    console.log(typeof [event.target.id]);
    setFormData(prevState => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>

        <form>
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

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link>

          <div className='signInBar'>
            <p className='siInText'>Sing in</p>
            <button className='signInButton'>
              <ArrowRightAIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* Google OAuth */}

        <Link to='/sign-up' className='registerLink'>
          Don't have an account? Sing Up!
        </Link>
      </div>
    </>
  );
}
