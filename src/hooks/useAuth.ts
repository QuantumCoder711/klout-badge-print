import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if we have a token but no user data (page refresh)
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId && !user) {
      // Here you might want to fetch user data from an endpoint like /api/me
      // For now, we'll just update the token in the state
      dispatch(loginUser.fulfilled({
        id: parseInt(userId, 10),
        access_token: token,
        access_token_type: 'Bearer',
        email: '', // These will be empty until we fetch the user data
        name: '',
        company_name: '',
        message: '',
        status: 200,
        user_id: parseInt(userId, 10),
        user_uuid: ''
      }, 'auth/checkAuth', { email: '', password: '' }));
    }
  }, [dispatch, user]);

  return {
    isAuthenticated: !!token,
    isLoading: loading,
    user
  };
};
