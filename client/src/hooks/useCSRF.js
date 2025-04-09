import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCSRFToken } from '../features/csrf/csrfSlice';

export function useCSRF() {
  const dispatch = useDispatch();
  const { token: csrfToken } = useSelector((state) => state.csrf);

  useEffect(() => {
    dispatch(getCSRFToken());
  }, [dispatch]);

  return csrfToken;
}