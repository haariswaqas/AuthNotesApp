import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const NoteForm = () => {
  const { authState } = useAuth();
  const { id } = useParams(); // Get the note ID from the URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      // Fetch the note details if id exists
      const fetchNote = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/notes/${id}`, {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          });

          if (response.data.success) {
            setTitle(response.data.note.title);
            setContent(response.data.note.content);
          } else {
            setError('Failed to fetch the note details');
          }
        } catch (err) {
          console.error('Error fetching note:', err);
          setError('An error occurred while fetching the note');
        }
      };

      fetchNote();
    }
  }, [id, authState.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!title || !content) {
      setError('Both title and content are required');
      return;
    }

    try {
      let response;
      if (id) {
        // Update note (PUT request)
        response = await axios.put(
          `http://localhost:3000/api/notes/${id}`,
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        // Create note (POST request)
        response = await axios.post(
          'http://localhost:3000/api/notes',
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      }

      if (response.data.success) {
        setSuccessMessage(id ? 'Note updated successfully!' : 'Note created successfully!');
        if (!id) {
          setTitle('');
          setContent('');
        }
        setError('');
      } else {
        setError(id ? 'Failed to update the note' : 'Failed to create the note');
      }
    } catch (err) {
      console.error(id ? 'Error updating note:' : 'Error creating note:', err);
      setError(id ? 'An error occurred while updating the note' : 'An error occurred while creating the note');
    }
  };

  return (
    <div className="note-form bg-gray-800 p-6 rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Note' : 'Create a New Note'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 text-gray-900 rounded-md"
            placeholder="Note title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 text-gray-900 rounded-md"
            placeholder="Note content"
            rows="5"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {id ? 'Update Note' : 'Post Note'}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
