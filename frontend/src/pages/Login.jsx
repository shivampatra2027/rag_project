import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Spinner } from '../components/ui/spinner';
import useAuthStore from '../store/authStore';

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSuccess = async (response) => {
    const credential = response?.credential;
    if (!credential) {
      setError('Google login failed. Try again.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const apiResponse = await apiClient.post('/api/auth/google', { credential });
      const token = apiResponse.data?.token;
      const user = apiResponse.data?.user;

      if (!token || !user) {
        setError('Invalid auth response from server.');
        return;
      }

      setAuth({ token, user });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in with Google to use AI Study Assistant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Google login failed. Try again.')}
            />
          </div>
          {loading ? (
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner /> Signing you in...
            </p>
          ) : null}
          {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
