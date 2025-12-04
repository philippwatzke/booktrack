import prisma from './src/utils/db.js';

async function fixDates() {
  try {
    // Get all logs with 2025 dates
    const logs = await prisma.dailyReadingLog.findMany({
      where: {
        date: {
          startsWith: '2025-'
        }
      }
    });

    console.log(`Found ${logs.length} logs with 2025 dates`);

    // Update each log to 2024
    for (const log of logs) {
      const oldDate = log.date;
      const newDate = oldDate.replace('2025-', '2024-');

      await prisma.dailyReadingLog.update({
        where: { id: log.id },
        data: { date: newDate }
      });

      console.log(`Updated: ${oldDate} → ${newDate}`);
    }

    console.log('✅ All dates fixed!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDates();
