import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from "../api/auth";
import useSessionTimer from "../hooks/useSessionTimer";
import { fetchUser } from "../api/auth"; // Assume this fetches user data

const Header = () => {
    const navigate = useNavigate();
    const timeLeft = useSessionTimer();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user info", error);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <header style={{ padding: '10px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <nav>
                <Link to="/" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
            </nav>
            <div>
                <span style={{ marginRight: '15px' }}>Session Expires In: {timeLeft !== null ? formatTime(timeLeft) : 'Loading...'}</span>
                {user ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            {user.name} ▼
                        </button>
                        {dropdownOpen && (
                            <ul style={{ position: 'absolute', right: 0, top: '100%', background: '#444', color: '#fff', listStyle: 'none', padding: '10px', margin: 0, borderRadius: '5px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
                                <li><Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link></li>
                                <li><button onClick={handleLogout} style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '5px' }}>Logout</button></li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <button onClick={handleLogout} style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button>
                )}
            </div>
        </header>
    );
};

export default Header;