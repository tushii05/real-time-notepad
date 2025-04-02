import React, { useEffect } from 'react';

const NoteForm = ({
    editNoteId,
    title,
    setTitle,
    content,
    setContent,
    theme,
    setTheme,
    handleCreateOrUpdateNote,
    inputRef
}) => {
    useEffect(() => {
        if (editNoteId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editNoteId, inputRef]);

    return (
        <div className="card shadow mb-5">
            <div className="card-body p-4">
                <h3 className="card-title mb-4">{editNoteId ? 'Update Note' : 'Create New Note'}</h3>
                <div className="mb-3">
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-control form-control-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        rows="4"
                    />
                </div>
                <div className="mb-3">
                    <select
                        className="form-select"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                    </select>
                </div>
                <button
                    onClick={handleCreateOrUpdateNote}
                    className={`btn ${editNoteId ? 'btn-success' : 'btn-primary'} btn-lg`}
                >
                    {editNoteId ? 'Update Note' : 'Create Note'}
                </button>
            </div>
        </div>
    );
};

export default NoteForm;