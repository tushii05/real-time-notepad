import React from 'react';
import { Modal } from 'react-bootstrap';

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

const NoteModal = ({ selectedNote, onClose }) => {
    if (!selectedNote) return null;

    return (
        <Modal show={selectedNote !== null} onHide={onClose} centered>
            <Modal.Header closeButton className={getThemeClasses(selectedNote.theme)}>
                <Modal.Title>{selectedNote.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={getThemeClasses(selectedNote.theme)}>
                <div style={{ whiteSpace: 'pre-line' }}>{selectedNote.content}</div>
            </Modal.Body>
            <Modal.Footer className={getThemeClasses(selectedNote.theme)}>
                <button
                    className="btn btn-secondary"
                    onClick={onClose}
                >
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default NoteModal;