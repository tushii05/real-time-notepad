import React, { useState, useEffect, useRef } from 'react';

const NoteForm = ({ onSubmit, editNote, setEditNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [theme, setTheme] = useState('light');
    const inputRef = useRef(null);

    useEffect(() => {
        if (editNote) {
            setTitle(editNote.title);
            setContent(editNote.content);
            setTheme(editNote.theme);
            inputRef.current.focus();
        } else {
            setTitle('');
            setContent('');
            setTheme('light');
        }
    }, [editNote]);

    const handleSubmit = () => {
        onSubmit(title, content, theme);
        setTitle('');
        setContent('');
        setTheme('light');
        setEditNote(null);
    };

    return (
        <div style={{ marginBottom: '20px', padding: '20px', borderRadius: '10px', background: '#f4f4f4' }}>
            <h3>{editNote ? 'Update Note' : 'Create New Note'}</h3>
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
                style={{ marginBottom: '10px', padding: '5px' }}
            >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
            </select>
            <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: editNote ? 'green' : 'blue', color: 'white', borderRadius: '5px' }}>
                {editNote ? 'Update Note' : 'Create Note'}
            </button>
        </div>
    );
};

export default NoteForm;
