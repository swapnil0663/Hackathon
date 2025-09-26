const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function installDatabase() {
  // First connect to postgres database to create our database
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres', // Connect to default postgres database
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await adminClient.connect();

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'complaintrack';
    console.log(`📊 Creating database: ${dbName}`);
    
    try {
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`ℹ️  Database '${dbName}' already exists`);
      } else {
        throw error;
      }
    }

    await adminClient.end();

    // Now connect to our database to create tables
    const dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    });

    console.log(`🔌 Connecting to ${dbName} database...`);
    await dbClient.connect();

    // Read and execute main schema
    console.log('📋 Creating main tables...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove database creation commands from schema since we already created it
    const cleanedSchema = schemaSQL
      .replace(/CREATE DATABASE.*?;/gi, '')
      .replace(/\\c.*?;/gi, '')
      .trim();

    await dbClient.query(cleanedSchema);
    console.log('✅ Main tables created successfully');

    // Read and execute sessions schema
    console.log('📋 Creating sessions table...');
    const sessionsPath = path.join(__dirname, '..', 'database', 'sessions_schema.sql');
    const sessionsSQL = fs.readFileSync(sessionsPath, 'utf8');
    await dbClient.query(sessionsSQL);
    console.log('✅ Sessions table created successfully');

    // Insert default admin user
    console.log('👤 Creating default admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await dbClient.query(`
      INSERT INTO users (user_id, full_name, email, phone, password, role) 
      VALUES (1, 'System Admin', 'admin@complaintrack.com', '+1234567890', $1, 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);
    console.log('✅ Default admin user created (email: admin@complaintrack.com, password: admin123)');

    await dbClient.end();
    console.log('🎉 Database installation completed successfully!');

  } catch (error) {
    console.error('❌ Database installation failed:', error.message);
    process.exit(1);
  }
}

// Run the installation
if (require.main === module) {
  installDatabase();
}

module.exports = installDatabase;