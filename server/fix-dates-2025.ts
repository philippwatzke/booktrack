import prisma from './src/utils/db.js';

async function fixDates() {
  try {
    // Get all logs with 2024 dates
    const logs = await prisma.dailyReadingLog.findMany({
      where: {
        date: {
          startsWith: '2024-'
        }
      }
    });

    console.log(`Found ${logs.length} logs with 2024 dates`);

    // Update each log to 2025
    for (const log of logs) {
      const oldDate = log.date;
      const newDate = oldDate.replace('2024-', '2025-');

      await prisma.dailyReadingLog.update({
        where: { id: log.id },
        data: { date: newDate }
      });

      console.log(`Updated: ${oldDate} → ${newDate}`);
    }

    console.log('✅ All dates fixed to 2025!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDates();
