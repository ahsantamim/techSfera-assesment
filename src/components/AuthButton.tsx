'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      callbackUrl: '/',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="border rounded px-2 py-1"
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sign In
      </button>
    </form>
  );
}
