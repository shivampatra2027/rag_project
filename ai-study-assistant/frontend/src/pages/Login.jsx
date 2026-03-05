import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios, { API_URL } from '../lib/http';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Spinner } from '../components/ui/spinner';
import useAuthStore from '../store/authStore';

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';

  const handleSuccess = async (response) => {
    const credential = response?.credential;
    if (!credential) {
      setError('Google login failed. Try again.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const apiResponse = await axios.post(`${API_URL}/api/auth/google`, { credential });
      const user = apiResponse.data?.user;

      if (!user) {
        setError('Invalid auth response from server.');
        return;
      }

      setAuth({ user });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in with Google to use AI Study Assistant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            {googleClientId ? (
              <GoogleLogin onSuccess={handleSuccess} onError={() => setError('Google login failed. Try again.')} />
            ) : (
              <p className="text-center text-sm text-red-600 dark:text-red-400">
                Missing `VITE_GOOGLE_CLIENT_ID` in frontend environment.
              </p>
            )}
          </div>
          <div className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Current origin:</span> {currentOrigin}
            </p>
            <p>
              <span className="font-semibold text-foreground">Google Client ID:</span>{' '}
              {googleClientId ? 'Loaded' : 'Missing'}
            </p>
          </div>
          {loading ? (
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner /> Signing you in...
            </p>
          ) : null}
          {error ? <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
