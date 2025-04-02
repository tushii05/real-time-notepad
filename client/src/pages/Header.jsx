import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from "../api/auth";
import useSessionTimer from "../hooks/useSessionTimer";
import { fetchUser } from "../api/auth";
import { Dropdown, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const navigate = useNavigate();
    const timeLeft = useSessionTimer();
    const [user, setUser] = useState(null);
    const [sessionWarning, setSessionWarning] = useState(false);

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

    useEffect(() => {
        if (timeLeft !== null && timeLeft < 30000) {
            setSessionWarning(true);
        } else {
            setSessionWarning(false);
        }
    }, [timeLeft]);

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

    const calculateProgress = () => {
        if (timeLeft === null) return 0;
        const totalSessionTime = 600000;
        return (timeLeft / totalSessionTime) * 100;
    };

    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <i className="bi bi-journal-text me-2"></i>
                    <span>Notepad Pro</span>
                </Link>

                <div className="d-flex align-items-center">
                    {timeLeft !== null && (
                        <div className="me-3" style={{ minWidth: '120px' }}>
                            <div className="text-white small mb-1">
                                <i className="bi bi-clock me-1"></i>
                                {formatTime(timeLeft)}
                            </div>
                            <ProgressBar
                                now={calculateProgress()}
                                variant={sessionWarning ? 'danger' : 'info'}
                                animated={sessionWarning}
                                className={sessionWarning ? 'progress-bar-striped' : ''}
                            />
                        </div>
                    )}

                    {user ? (
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
                                <div className="me-2">
                                    <div className="fw-bold text-dark">{user.name}</div>
                                    {/* <div className="small text-muted">{user.role || 'User'}</div> */}
                                </div>
                                <i className="bi bi-person-circle fs-4"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow">
                                <Dropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                                    <i className="bi bi-person me-2"></i> Profile
                                </Dropdown.Item>


                                <Dropdown.Item as={Link} to="/settings" className="d-flex align-items-center">
                                    <i className="bi bi-gear me-2"></i> Settings
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center">
                                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <button onClick={handleLogout} className="btn btn-outline-light">
                            <i className="bi bi-box-arrow-right me-1"></i> Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;