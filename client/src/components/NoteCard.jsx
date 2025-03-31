import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoteCard = ({ note }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">{note.title}</h3>
      <p>{note.content.substring(0, 100)}...</p>
      <div className="mt-4">
        <button
          className="text-blue-500"
          onClick={() => navigate(`/notes/${note._id}`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
