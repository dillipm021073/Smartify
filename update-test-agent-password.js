// Update test agent with proper password
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function updatePassword() {
  const client = await pool.connect();

  try {
    console.log('🔒 Hashing password...');

    // Hash the password 'test123'
    const passwordHash = await bcrypt.hash('test123', 10);

    console.log('🔄 Updating test agent password...');

    const result = await client.query(
      `UPDATE agents
       SET password_hash = $1
       WHERE id = 'agent-test-123'
       RETURNING id, username, email`,
      [passwordHash]
    );

    if (result.rows.length > 0) {
      console.log('✅ Password updated successfully!');
      console.log('');
      console.log('Test Agent Credentials:');
      console.log('  Username: testagent');
      console.log('  Password: test123');
      console.log('  Agent ID:', result.rows[0].id);
      console.log('  Email:', result.rows[0].email);
    } else {
      console.log('❌ Agent not found!');
    }

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

updatePassword();
