import React, { useState, useEffect } from 'react';
import { CreateNote, fetchNotes, DeleteNoteData, fetchCrf, UpdateNote } from '../api/auth';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editNoteId, setEditNoteId] = useState(null);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const data = await fetchNotes();
                setNotes(data.notes);
            } catch (error) {
                toast.error('Failed to load notes.');
            }
        };
        loadNotes();
    }, []);

    // const handleCreateNote = async () => {
    //     if (!title || !content) {
    //         toast.error('Title and Content are required!');
    //         return;
    //     }

    //     try {
    //         const csrfTokenEd = await fetchCrf()
    //         const newNote = await CreateNote(title, content, csrfTokenEd.csrfToken);
    //         setNotes([...notes, newNote]);
    //         setTitle('');
    //         setContent('');
    //         toast.success('Note created successfully!');
    //     } catch (error) {
    //         const errorMessage = error.response?.data?.message || error.message || 'Failed to create note';
    //         toast.error(errorMessage);
    //     }
    // };


    const handleCreateOrUpdateNote = async () => {
        if (!title || !content) {
            toast.error('Title and Content are required!');
            return;
        }

        try {
            const csrfTokenEd = await fetchCrf();
            let newNote;
            if (editNoteId) {
                newNote = await UpdateNote(editNoteId, title, content, csrfTokenEd.csrfToken);
                setEditNoteId(null);
                toast.success('Note updated successfully!');
            } else {
                newNote = await CreateNote(title, content, csrfTokenEd.csrfToken);
                toast.success('Note created successfully!');
            }

            setNotes(notes.map(note => note.id === newNote.id ? newNote : note));
            setTitle('');
            setContent('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create/update note';
            toast.error(errorMessage);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const csrfTokenEd = await fetchCrf()

            await DeleteNoteData(noteId, csrfTokenEd.csrfToken);
            setNotes(notes.filter(note => note.id !== noteId));
            toast.success('Note deleted successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete note';
            toast.error(errorMessage);
        }
    };

    const handleEditNote = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditNoteId(note.id); // Set the note to edit
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to the Dashboard</h1>
            <p>Here you can view and manage your notes.</p>

            <div>
                <h3>Create New Note</h3>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '100px' }}
                />
                <button
                    onClick={handleCreateOrUpdateNote}
                    style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', cursor: 'pointer' }}
                >
                    Create Note
                </button>
            </div>

            <div>
                <h3>My Notes</h3>
                {notes.length > 0 ? (
                    <ul>
                        {notes.map((note) => (
                            <li key={note.id} style={{ padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}>
                                <h4>{note.title}</h4>
                                <p>{note.content}</p>
                                <button
                                    onClick={() => handleEditNote(note)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: 'green',
                                        color: 'white',
                                        marginTop: '10px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Edit Note
                                </button>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        marginTop: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete Note
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notes found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
