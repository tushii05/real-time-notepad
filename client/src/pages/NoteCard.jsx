import React from 'react';

const NoteCard = ({ note, onEdit, onDelete, onSelect }) => {
    return (
        <li onClick={() => onSelect(note)} style={{ padding: '15px', borderRadius: '8px', backgroundColor: note.theme === 'dark' ? '#333' : note.theme === 'blue' ? '#aee' : note.theme === 'green' ? '#aead00' : '#fff', color: note.theme === 'dark' ? '#fff' : '#000', cursor: 'pointer' }}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={(e) => { e.stopPropagation(); onEdit(note); }}>Edit</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>Delete</button>
        </li>
    );
};

export default NoteCard;
