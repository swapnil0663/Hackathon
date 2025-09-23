#!/usr/bin/env node

require('dotenv').config();
const { checkAndUpdateDatabase } = require('../database/migrate');

console.log('🚀 Starting database migration...');

checkAndUpdateDatabase()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  });