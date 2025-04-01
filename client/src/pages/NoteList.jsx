import React from 'react';
import NoteCard from './NoteCard';

const NoteList = ({ notes, onEdit, onDelete, onSelect }) => {
    return (
        <div>
            <h3>My Notes</h3>
            {notes.length > 0 ? (
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', listStyle: 'none', padding: 0 }}>
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />
                    ))}
                </ul>
            ) : (
                <p>No notes found.</p>
            )}
        </div>
    );
};

export default NoteList;
