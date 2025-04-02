import React from 'react';

const NoteCard = ({ note, onEdit, onDelete, onClick }) => {
    const getThemeClasses = (theme) => {
        switch (theme) {
            case 'dark':
                return 'bg-dark text-white';
            case 'blue':
                return 'bg-primary text-white';
            case 'green':
                return 'bg-success text-white';
            default:
                return 'bg-light text-dark';
        }
    };

    return (
        <div className="col">
            <div
                className={`card h-100 ${getThemeClasses(note.theme)} shadow-sm`}
                onClick={onClick}
                style={{ cursor: 'pointer' }}
            >
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{note.title}</h5>
                    <p className="card-text flex-grow-1" style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden'
                    }}>
                        {note.content}
                    </p>
                    <div className="d-flex justify-content-between mt-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                            className="btn btn-sm btn-outline-light"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                            className="btn btn-sm btn-outline-light"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;