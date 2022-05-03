//* Modules
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function Profile() {
  const [user, setUser]: any = useState(null);

  const auth: any = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return user ? (
    <div>
      <h1>Hi, {`${user.displayName}!`}</h1>
    </div>
  ) : (
    <div> Not Logged In </div>
  );
}
