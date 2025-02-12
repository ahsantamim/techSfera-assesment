import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received body:', body);

    if (!body.title || !body.author || !body.genre) {
      return NextResponse.json(
        { error: 'Title, author, and genre are required' },
        { status: 400 }
      );
    }

    // Create the book directly without checking user
    const book = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        genre: body.genre,
        userId: session.user.id,
      },
    });

    console.log('Book created:', book);
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      { error: 'Failed to create book', details: error.message },
      { status: 500 }
    );
  }
}
