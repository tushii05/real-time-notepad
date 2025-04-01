import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import toast from 'react-hot-toast';
import { useCSRF } from '../hooks/useCSRF';

const Registration = () => {
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const csrfToken = useCSRF();


    const handleSignup = async (e) => {
        e.preventDefault();
        if (!csrfToken) {
            toast.error('Security token missing. Please refresh the page.');
            return;
        }
        setIsLoading(true);

        try {
            await signup(name, username, password, csrfToken);
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.details || error.message || 'Sign Up failed';
            toast.error(errorMessage);

        } finally {
            setIsLoading(false);
        }
    };

    return (<div style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
        {isLoading && (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                }}
            >
                <div className="loader" style={{
                    border: '8px solid #f3f3f3',
                    borderTop: '8px solid #3498db',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    animation: 'spin 2s linear infinite',
                }}></div>
            </div>
        )}
        <form onSubmit={handleSignup} style={{ maxWidth: '400px', backgroundColor: '#f7f7f7', borderRadius: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>SignUp</h2>
            <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                style={{ width: '93%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #e3eaf0', fontSize: '1rem' }}
            />
            <input
                type="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="UserName"
                required
                style={{ width: '93%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #e3eaf0', fontSize: '1rem' }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ width: '93%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #e3eaf0', fontSize: '1rem' }}
            />
            <button
                type="submit"
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#4b4f56',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#535bf2')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#4b4f56')}
                disabled={isLoading}
            >
                {isLoading ? 'Signup in...' : 'SignUp'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p>
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        style={{
                            color: '#535bf2',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </form></div>
    );
};

export default Registration;