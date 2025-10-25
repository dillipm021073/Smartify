/**
 * Seed script to populate available MSISDN (phone numbers)
 * Run this script to add sample phone numbers for testing
 *
 * Usage: node seed-msisdn.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const { Client } = pg;

// Philippine mobile number format: +63 9XX XXX XXXX
// We'll generate numbers in the format: 09XX XXX XXXX for display
const generatePhilippineNumbers = (count) => {
  const numbers = [];
  const prefixes = ['917', '918', '919', '920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '939', '945', '953', '954', '955', '956', '965', '966', '967', '975', '976', '977', '978', '979', '985', '986', '987', '988', '989', '995', '996', '997', '998', '999'];

  for (let i = 0; i < count; i++) {
    // Pick random prefix from major PH networks
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    // Generate 7 random digits
    const suffix = Math.floor(1000000 + Math.random() * 9000000).toString();

    // Format: 09XX XXX XXXX
    const number = `0${prefix}${suffix}`;
    numbers.push(number);
  }

  return numbers;
};

async function seedMSISDN() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log('Connected! Checking if availableNumbers table exists...');

    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'available_numbers'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Creating availableNumbers table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS available_numbers (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          msisdn TEXT NOT NULL UNIQUE,
          status TEXT NOT NULL DEFAULT 'available',
          reserved_for VARCHAR,
          assigned_to VARCHAR,
          reserved_at TIMESTAMP,
          assigned_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
      console.log('Table created successfully!');
    } else {
      console.log('Table already exists.');
    }

    // Generate 100 sample numbers
    console.log('Generating 100 sample phone numbers...');
    const numbers = generatePhilippineNumbers(100);

    // Insert numbers
    console.log('Inserting numbers into database...');
    let inserted = 0;
    let skipped = 0;

    for (const msisdn of numbers) {
      try {
        const id = randomUUID();
        await client.query(
          `INSERT INTO available_numbers (id, msisdn, status, created_at, updated_at)
           VALUES ($1, $2, 'available', NOW(), NOW())
           ON CONFLICT (msisdn) DO NOTHING`,
          [id, msisdn]
        );
        inserted++;
      } catch (error) {
        skipped++;
      }
    }

    console.log(`\n✅ Seeding completed!`);
    console.log(`   - Inserted: ${inserted} new numbers`);
    console.log(`   - Skipped: ${skipped} duplicates`);

    // Show total count
    const countResult = await client.query('SELECT COUNT(*) as count FROM available_numbers WHERE status = \'available\'');
    console.log(`   - Total available numbers in database: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

seedMSISDN();
