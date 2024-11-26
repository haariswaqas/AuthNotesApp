import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const NoteList = () => {
  const { authState } = useAuth(); // Get the authentication state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const fetchNotes = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/notes', {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          });

          if (response.data.success && Array.isArray(response.data.notes)) {
            setNotes(response.data.notes);
          } else {
            setNotes([]);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching notes:', err);
          setError('Failed to fetch notes');
          setLoading(false);
        }
      };

      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.token]);

  const handleDelete = async (noteId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.data.success) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      } else {
        console.error('Failed to delete note');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (loading) {
    return <div>Loading notes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="note-list">
      <h2 className="text-xl font-bold mb-4">Notes</h2>
      <ul>
        {notes.length > 0 ? (
          notes.map((note) => (
            <li key={note.id} className="bg-gray-800 text-white p-4 mb-2 rounded-md">
                 <Link to={`/notes/${note.id}`} className="font-semibold text-blue-400 hover:underline">
                 {note.title}
                 </Link>
              <p>{note.content}</p>
              {authState.user?.userId === note.userId && (
                <div className="mt-2 flex space-x-2">
                  <Link
                    to={`/edit-note/${note.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li>No notes available</li>
        )}
      </ul>
    </div>
  );
};

export default NoteList;
