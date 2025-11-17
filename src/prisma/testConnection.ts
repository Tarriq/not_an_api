import prisma from './client.js';

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
  } catch (err) {
    console.error('❌ Database connection failed: ', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
