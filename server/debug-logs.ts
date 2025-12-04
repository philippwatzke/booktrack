import prisma from './src/utils/db.js';

async function debug() {
  try {
    // Get first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No users found');
      return;
    }

    console.log('✅ User:', user.email);

    // Check daily logs
    const logs = await prisma.dailyReadingLog.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 10
    });

    console.log('\n📊 Daily Logs:', logs.length);
    logs.forEach(log => {
      console.log(`  - ${log.date}: ${log.pagesRead} pages, ${log.duration}s, books: ${log.booksRead}`);
    });

    // Check reading sessions
    const sessions = await prisma.readingSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { book: { select: { title: true } } }
    });

    console.log('\n📖 Recent Reading Sessions:', sessions.length);
    sessions.forEach(s => {
      console.log(`  - ${s.createdAt.toISOString().split('T')[0]}: ${s.book.title} - ${s.pagesRead} pages, ${s.duration}s`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
