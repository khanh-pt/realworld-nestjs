#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { DatabaseSeeder } from '../database/seeds/seed';

// Load environment variables
config();

async function runSeed() {
  console.log('🌱 Starting database seeding process...\n');

  const seeder = new DatabaseSeeder();

  try {
    await seeder.seed();
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  void runSeed();
}

export { runSeed };
