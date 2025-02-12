'use client';

import { useState } from 'react';

export default function AddBookForm({
  onBookAdded,
}: {
  onBookAdded: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add book');
      }

      setFormData({ title: '', author: '', genre: '' });
      onBookAdded();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <input
          type="text"
          placeholder="Title"
          className="w-full border rounded p-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Author"
          className="w-full border rounded p-2"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Genre"
          className="w-full border rounded p-2"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Adding...' : 'Add Book'}
      </button>
    </form>
  );
}
