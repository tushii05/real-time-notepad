import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser, uploadAvatar, fetchCrf } from '../api/auth';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card, Spinner, Image } from 'react-bootstrap';
const API_BASE_URL = 'http://localhost:3001';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarLoading, setAvatarLoading] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
                setName(userData.name);
                setUsername(userData.username);
                if (userData.avatar) {
                    setAvatarPreview(`${API_BASE_URL}/uploads/${userData.avatar}`);
                }
            } catch (error) {
                toast.error('Failed to load profile data');
                navigate('/');
            }
        };
        loadUserData();
    }, [navigate]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setAvatarLoading(true);
            const csrfToken = await fetchCrf();
            const updatedUser = await uploadAvatar(formData, csrfToken.csrfToken);

            // Update the avatar preview with the new image
            setAvatarPreview(`${API_BASE_URL}/uploads/${updatedUser.avatar}`);
            toast.success('Profile picture updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update avatar');
            // Revert to previous avatar if update fails
            if (user?.avatar) {
                setAvatarPreview(`${API_BASE_URL}/uploads/${user.avatar}`);
            }
        } finally {
            setAvatarLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <h3 className="mb-0">My Profile</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <div className="position-relative d-inline-block">
                                    <Image
                                        src={avatarPreview || '/default-avatar.png'}
                                        roundedCircle
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        className="border border-3 border-primary"
                                        alt="Profile"
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle p-0"
                                        style={{ width: '40px', height: '40px' }}
                                        title="Change profile picture"
                                    >
                                        <i className="bi bi-camera fs-5"></i>
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="d-none"
                                        disabled={avatarLoading}
                                    />
                                    {avatarLoading && (
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                            <Spinner animation="border" variant="light" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        readOnly
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        readOnly
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;