import { Book } from '@prisma/client';

export default function BookList({ books }: { books: Book[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <div key={book.id} className="border rounded p-4 shadow">
          <h3 className="font-bold">{book.title}</h3>
          <p className="text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500">{book.genre}</p>
        </div>
      ))}
    </div>
  );
}
