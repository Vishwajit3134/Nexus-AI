require("dotenv").config();
const { Pool } = require("pg");

// 1. Create the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 2. Define the SQL to create tables if they don't exist
const createTablesQuery = `
  -- Create Users Table
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,       -- External ID (e.g., from Clerk)
    email VARCHAR(255) NOT NULL UNIQUE,
    credits INTEGER DEFAULT 50,        -- Default credits for new users
    current_plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create Image Creations Table
  CREATE TABLE IF NOT EXISTS image_creations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    tool_type VARCHAR(50) NOT NULL,
    prompt_input TEXT NOT NULL,
    artistic_style VARCHAR(100),
    storage_url TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Optional: Create Indexes for Performance
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_image_creations_user_id ON image_creations(user_id);
  CREATE INDEX IF NOT EXISTS idx_image_creations_is_public ON image_creations(is_public);
`;

// 3. Function to initialize the database
const initDb = async () => {
  try {
    await pool.query(createTablesQuery);
    console.log("✅ Database tables checked/created successfully.");
  } catch (error) {
    console.error("❌ Error initializing database tables:", error);
  }
};

// 4. Run initialization immediately
initDb();

// 5. Export the query method for use in routes
module.exports = {
  query: (text, params) => pool.query(text, params),
};
