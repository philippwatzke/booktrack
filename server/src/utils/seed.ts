import bcrypt from 'bcrypt';
import prisma from './db.js';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    await prisma.readingSession.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.note.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('test1234', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@booktrack.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });

    console.log('✅ Created test user:', user.email);

    // Create books (with genres and tags as JSON strings for SQLite)
    const books = await Promise.all([
      prisma.book.create({
        data: {
          userId: user.id,
          title: 'Der Alchemist',
          author: 'Paulo Coelho',
          description: 'Eine inspirierende Geschichte über einen andalusischen Hirten auf seiner Reise zu den Pyramiden.',
          coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
          pageCount: 198,
          currentPage: 142,
          status: 'READING',
          genres: JSON.stringify(['Philosophie', 'Abenteuer']),
          tags: JSON.stringify(['Inspiration', 'Reise']),
        },
      }),
      prisma.book.create({
        data: {
          userId: user.id,
          title: 'Atomic Habits',
          author: 'James Clear',
          description: 'Bewährte Strategien für den Aufbau guter und das Ablegen schlechter Gewohnheiten.',
          coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
          pageCount: 320,
          status: 'FINISHED',
          genres: JSON.stringify(['Sachbuch', 'Selbsthilfe']),
          tags: JSON.stringify(['Produktivität', 'Gewohnheiten']),
          rating: 5,
        },
      }),
      prisma.book.create({
        data: {
          userId: user.id,
          title: '1984',
          author: 'George Orwell',
          description: 'Ein dystopischer Roman über Überwachung und totalitäre Kontrolle.',
          coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
          pageCount: 328,
          status: 'WANT_TO_READ',
          genres: JSON.stringify(['Dystopie', 'Klassiker']),
          tags: JSON.stringify(['Politik', 'Überwachung']),
          priority: 5,
        },
      }),
      prisma.book.create({
        data: {
          userId: user.id,
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          description: 'Eine kurze Geschichte der Menschheit von den Anfängen bis heute.',
          coverUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
          pageCount: 512,
          currentPage: 89,
          status: 'READING',
          genres: JSON.stringify(['Sachbuch', 'Geschichte']),
          tags: JSON.stringify(['Anthropologie', 'Evolution']),
        },
      }),
    ]);

    console.log(`✅ Created ${books.length} books`);

    // Create reading sessions
    const sessions = await Promise.all([
      prisma.readingSession.create({
        data: {
          userId: user.id,
          bookId: books[0].id,
          startTime: new Date('2024-01-20T14:00:00Z'),
          endTime: new Date('2024-01-20T15:30:00Z'),
          pagesRead: 25,
          notes: 'Sehr inspirierendes Kapitel über persönliche Legenden',
        },
      }),
      prisma.readingSession.create({
        data: {
          userId: user.id,
          bookId: books[3].id,
          startTime: new Date('2024-01-21T10:00:00Z'),
          endTime: new Date('2024-01-21T11:20:00Z'),
          pagesRead: 15,
          notes: 'Faszinierende Einblicke in die kognitive Revolution',
        },
      }),
    ]);

    console.log(`✅ Created ${sessions.length} reading sessions`);

    // Create quotes
    const quotes = await Promise.all([
      prisma.quote.create({
        data: {
          userId: user.id,
          bookId: books[0].id,
          text: 'Wenn du etwas ganz fest willst, dann wird das ganze Universum darauf hinwirken, dass du es auch erreichen kannst.',
          page: 23,
        },
      }),
      prisma.quote.create({
        data: {
          userId: user.id,
          bookId: books[1].id,
          text: 'Du bist nicht das Ergebnis deiner Ziele. Du bist das Ergebnis deiner Systeme.',
          page: 27,
        },
      }),
    ]);

    console.log(`✅ Created ${quotes.length} quotes`);

    // Create notes
    const notes = await Promise.all([
      prisma.note.create({
        data: {
          userId: user.id,
          bookId: books[0].id,
          content: 'Wichtig: Der Protagonist lernt, auf sein Herz zu hören',
          page: 45,
        },
      }),
      prisma.note.create({
        data: {
          userId: user.id,
          bookId: books[3].id,
          content: 'Die drei großen Revolutionen: kognitive, landwirtschaftliche, wissenschaftliche',
          page: 21,
        },
      }),
    ]);

    console.log(`✅ Created ${notes.length} notes`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📧 Test credentials:\nEmail: ${user.email}\nPassword: test1234`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
