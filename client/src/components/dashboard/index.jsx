import React, { useState, useEffect, useRef } from 'react';
import { CreateNote, fetchNotes, DeleteNoteData, fetchCrf, UpdateNote } from '../../api/auth';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import NoteForm from './NoteForm';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editNoteId, setEditNoteId] = useState(null);
    const [theme, setTheme] = useState('light');
    const [selectedNote, setSelectedNote] = useState(null);
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
    };

    return (
        <div className="container py-4">
            <div className="text-center mb-5">
                <h1 className="display-4">Welcome to the Dashboard</h1>
                <p className="lead">Here you can view and manage your notes.</p>
            </div>

            <NoteForm
                editNoteId={editNoteId}
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                theme={theme}
                setTheme={setTheme}
                handleCreateOrUpdateNote={handleCreateOrUpdateNote}
                inputRef={inputRef}
            />

            <div className="mb-5">
                <h3 className="mb-4">My Notes</h3>
                {notes.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={handleEditNote}
                                onDelete={handleDeleteNote}
                                onClick={() => setSelectedNote(note)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">No notes found. Create your first note above!</div>
                )}
            </div>

            <NoteModal
                selectedNote={selectedNote}
                onClose={() => setSelectedNote(null)}
            />
        </div>
    );
};

export default Dashboard;