'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import AddBookForm from '../components/AddBookForm';
import BookList from '../components/BookList';
import { Book } from '@prisma/client';

export default function HomePage() {
  const { data: session } = useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'genre'>('title');
  const [filterGenre, setFilterGenre] = useState<string>('');

  useEffect(() => {
    if (session?.user) {
      fetchBooks();
    }
  }, [session]);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
  };

  const sortedAndFilteredBooks = books
    .filter((book) => !filterGenre || book.genre === filterGenre)
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  if (!session) {
    return (
      <div className="text-center mt-10">Please sign in to view your books</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Book List</h1>

      <div className="mb-8">
        <AddBookForm onBookAdded={fetchBooks} />
      </div>

      <div className="mb-4 flex gap-4">
        <select
          className="border rounded p-2"
          onChange={(e) => setSortBy(e.target.value as 'title' | 'genre')}
          value={sortBy}
        >
          <option value="title">Sort by Title</option>
          <option value="genre">Sort by Genre</option>
        </select>

        <select
          className="border rounded p-2"
          onChange={(e) => setFilterGenre(e.target.value)}
          value={filterGenre}
        >
          <option value="">All Genres</option>
          {[...new Set(books.map((book) => book.genre))].map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <BookList books={sortedAndFilteredBooks} />
    </div>
  );
}
