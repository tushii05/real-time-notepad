import React, { useState, useEffect, useRef } from 'react';
import { CreateNote, fetchNotes, DeleteNoteData, fetchCrf, UpdateNote } from '../api/auth';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editNoteId, setEditNoteId] = useState(null);
    const [theme, setTheme] = useState('light');
    const [selectedNote, setSelectedNote] = useState(null); // For popup
    const inputRef = useRef(null);

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

    const handleCreateOrUpdateNote = async () => {
        if (!title || !content) {
            toast.error('Title and Content are required!');
            return;
        }

        try {
            const csrfTokenEd = await fetchCrf();
            let newNote;
            if (editNoteId) {
                newNote = await UpdateNote(editNoteId, title, content, theme, csrfTokenEd.csrfToken);
                setEditNoteId(null);
                toast.success('Note updated successfully!');
            } else {
                newNote = await CreateNote(title, content, theme, csrfTokenEd.csrfToken);
                toast.success('Note created successfully!');
            }

            setNotes(prevNotes =>
                editNoteId ? prevNotes.map(note => note.id === newNote.id ? newNote : note) : [...prevNotes, newNote]
            );
            setTitle('');
            setContent('');
            setTheme('light');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create/update note';
            toast.error(errorMessage);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const csrfTokenEd = await fetchCrf();
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
        setTheme(note.theme || 'light');
        setEditNoteId(note.id);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    const handleCardClick = (note) => {
        setSelectedNote(note);
    };

    const closePopup = () => {
        setSelectedNote(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to the Dashboard</h1>
            <p>Here you can view and manage your notes.</p>

            <div style={{ marginBottom: '20px', padding: '20px', borderRadius: '10px', background: '#f4f4f4' }}>
                <h3>{editNoteId ? 'Update Note' : 'Create New Note'}</h3>
                <input
                    ref={inputRef}
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
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', cursor: 'pointer' }}
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                </select>
                <button
                    onClick={handleCreateOrUpdateNote}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: editNoteId ? 'green' : 'blue',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        marginLeft: '10px'
                    }}
                >
                    {editNoteId ? 'Update Note' : 'Create Note'}
                </button>
            </div>

            <div>
                <h3>My Notes</h3>
                {notes.length > 0 ? (
                    <ul style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '15px',
                        padding: 0,
                        listStyle: 'none'
                    }}>
                        {notes.map((note) => (
                            <li
                                key={note.id}
                                onClick={() => handleCardClick(note)} // Open popup on click
                                style={{
                                    // flex: '1 1 calc(33.333% - 20px)',
                                    // maxWidth: 'calc(33.333% - 20px)',
                                    height: '250px', // Fixed height
                                    overflow: 'hidden',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    backgroundColor: note.theme === 'dark' ? '#333' :
                                        note.theme === 'blue' ? '#aee' :
                                            note.theme === 'green' ? '#aead00' : '#fff',
                                    color: note.theme === 'dark' ? '#fff' : '#000',
                                    border: '1px solid #ccc',
                                    boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}
                            >
                                <h4 style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>{note.title}</h4>

                                <p style={{
                                    flexGrow: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 3
                                }}>{note.content}</p>

                                <div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditNote(note); }} // Prevents popup open
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: 'green',
                                            color: 'white',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                            marginRight: '5px',
                                        }}
                                    >
                                        Edit Note
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} // Prevents popup open
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                        }}
                                    >
                                        Delete Note
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notes found.</p>
                )}
            </div>

            {/* Popup Modal */}
            {selectedNote && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: selectedNote.theme === 'dark' ? '#333' :
                            selectedNote.theme === 'blue' ? '#aee' :
                                selectedNote.theme === 'green' ? '#aead00' : '#fff',
                        color: selectedNote.theme === 'dark' ? '#fff' : '#000',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '50%',
                        maxWidth: '600px',
                        boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <button
                            onClick={closePopup}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '15px',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            X
                        </button>
                        <h2>{selectedNote.title}</h2>
                        <p>{selectedNote.content}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
