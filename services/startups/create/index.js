// ============================================
// CREATE STARTUP
// File: services/startups/create/index.js
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVICE_PORT || 3001;


app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'reto_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
});


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'create-startup' });
});


app.post('/v1/api/startups/create', async (req, res) => {
  try {
    const { name, foundedAt, location, category, fundingAmount } = req.body;
    
    if (!name || !foundedAt || !location || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'foundedAt', 'location', 'category']
      });
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(foundedAt)) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    const funding = fundingAmount || 0;
    if (isNaN(funding) || funding < 0) {
      return res.status(400).json({
        error: 'Invalid funding amount'
      });
    }
    
    const query = `
      INSERT INTO startups (name, founded_at, location, category, funding_amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [name, foundedAt, location, category, funding];
    const result = await pool.query(query, values);
    
    res.status(201).json({
      message: 'Startup created successfully',
      data: result.rows[0]
    });
    
    console.log(`Created startup: ${name}`);
    
  } catch (error) {
    console.error('Error creating startup:', error);
    
    if (error.code === '23505') {  
      return res.status(409).json({
        error: 'Startup with this name already exists'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Create Startup Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});