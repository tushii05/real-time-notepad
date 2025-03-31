import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});


export const signup = async (name, username, password, csrfToken) => {
    try {
        const response = await api.post('/register', {
            name,
            username,
            password
        },
            {
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });
        return response.data;
    } catch (error) {
        console.error('Signup failed', error.response?.data);
        throw error;
    }
};

export const login = async (email, password, csrfToken) => {
    try {
        const response = await api.post('/login', {
            username: email,
            password
        },
            {
                headers: { "X-CSRF-Token": csrfToken }
            });
        return response.data;
    } catch (error) {
        console.error('Login failed', error.response?.data);
        throw error;
    }
};

export const fetchUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/userDetails`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data', error.response?.data);
        throw error;
    }
};


export const fetchCrf = async () => {
    try {
        const response = await axios.get(`${API_URL}/csrf-token`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error.response.data)
        console.error('Failed to fetch CSRF token', error.response?.data);
        throw error;
    }
};


export const logOut = async () => {
    try {
        const csrfToken = await fetchCrf();
        const response = await axios.post(`${API_URL}/logout`, {}, {
            headers: {
                "X-CSRF-Token": csrfToken.csrfToken
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error('Logout failed', error.response?.data || error.message);
        throw error;
    }
};


export const CreateNote = async (title, content, csrfToken) => {
    console.log("object", title, content, csrfToken)
    try {
        const response = await api.post('/notes', {
            title,
            content
        },
            {
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });
        return response.data;
    } catch (error) {
        console.error('Create Note failed', error.response?.data);
        throw error;
    }
};

export const UpdateNote = async (id, title, content, csrfToken) => {
    try {
        const response = await api.put(`/notes/${id}`, {
            title,
            content
        },
            {
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });
        return response.data;
    } catch (error) {
        console.error('Create Note failed', error.response?.data);
        throw error;
    }
};

export const fetchNotes = async () => {
    try {
        const response = await axios.get(`${API_URL}/notes`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch CSRF token', error.response?.data);
        throw error;
    }
};


export const fetchNoteData = async () => {
    try {
        const response = await axios.get(`${API_URL}/notes`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch CSRF token', error.response?.data);
        throw error;
    }
};

export const DeleteNoteData = async (id, csrfToken) => {
    try {
        const response = await api.delete(`/notes/${id}`, {
            headers: { 'X-CSRF-TOKEN': csrfToken },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete note', error.response?.data);
        throw error;
    }
};