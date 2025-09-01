import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '../lib/api';

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (token) {
      // Store the token
      setToken(token);
      
      // Store user info if available
      if (email) {
        const userInfo = {
          email: decodeURIComponent(email),
          name: name ? decodeURIComponent(name) : '',
          isVerified: true
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
      }

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // If no token, redirect to sign-in with error
      navigate('/sign-in', { 
        replace: true, 
        state: { error: 'Google authentication failed. Please try again.' }
      });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Completing Google sign-in...</p>
      </div>
    </div>
  );
}
