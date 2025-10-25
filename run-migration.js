// Quick migration runner
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🔄 Running migration: add_test_agent.sql');

    const sql = readFileSync('./prisma/migrations/add_test_agent.sql', 'utf8');

    await client.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Added test agent:');
    console.log('  - ID: agent-test-123');
    console.log('  - Email: agent@test.com');
    console.log('  - Name: Test Agent');
    console.log('  - Store: store-main-qc');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
