import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../features/auth/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return { isAuthenticated, loading };
};

export default useAuth;