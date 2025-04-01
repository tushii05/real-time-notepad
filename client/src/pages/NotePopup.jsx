import React from 'react';

const NotePopup = ({ note, onClose }) => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default NotePopup;
