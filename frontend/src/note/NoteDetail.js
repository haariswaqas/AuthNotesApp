import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NoteDetail = () => {
  const { id } = useParams(); // Extract the note ID from the URL
  const { authState } = useAuth(); // Access authentication state
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation after deleting

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (response.data.success) {
          setNote(response.data.note);
        } else {
          setError('Note not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load note');
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, authState.token]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.data.success) {
        navigate('/notes'); // Redirect to the notes list after deletion
      } else {
        setError('Failed to delete note');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  };

  if (loading) {
    return <div>Loading note details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="note-detail bg-gray-900 text-white p-6 rounded-md">
      {note ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
          <p className="text-lg mb-6">{note.content}</p>
          <p className="text-sm text-gray-400">
            Created by: {authState.user?.email} on {new Date(note.createdAt).toLocaleString()}
          </p>

          <div className="mt-4">
            {authState.user?.userId === note.userId && (
              <div className="flex space-x-4">
                <Link
                  to={`/edit-note/${note.id}`}
                  className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                <Link
                  to="/notes"
                  className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Back to Notes
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Note not found</p>
      )}
    </div>
  );
};

export default NoteDetail;
