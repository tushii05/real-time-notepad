import { useEffect, useState } from 'react';
import { fetchCrf } from '../api/auth';

export function useCSRF() {
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const getCSRFToken = async () => {
            const token = await fetchCrf();
            setCsrfToken(token.csrfToken);
        };
        getCSRFToken()
    }, []);
    return csrfToken;
}
