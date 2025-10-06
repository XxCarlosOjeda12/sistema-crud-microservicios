// ============================================
// READ STARTUP
// File: services/startups/read/index.js
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVICE_PORT || 3002;

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
  res.json({ status: 'healthy', service: 'read-startup' });
});

app.get('/v1/api/startups/read', async (req, res) => {
  try {
    const { name, category, location, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM startups WHERE 1=1';
    const values = [];
    let paramCounter = 1;
    
    if (name) {
      query += ` AND name ILIKE $${paramCounter}`;
      values.push(`%${name}%`);
      paramCounter++;
    }
    
    if (category) {
      query += ` AND category ILIKE $${paramCounter}`;
      values.push(`%${category}%`);
      paramCounter++;
    }
    
    if (location) {
      query += ` AND location ILIKE $${paramCounter}`;
      values.push(`%${location}%`);
      paramCounter++;
    }
    
    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, values);
    
    let countQuery = 'SELECT COUNT(*) FROM startups WHERE 1=1';
    const countValues = [];
    paramCounter = 1;
    
    if (name) {
      countQuery += ` AND name ILIKE $${paramCounter}`;
      countValues.push(`%${name}%`);
      paramCounter++;
    }
    
    if (category) {
      countQuery += ` AND category ILIKE $${paramCounter}`;
      countValues.push(`%${category}%`);
      paramCounter++;
    }
    
    if (location) {
      countQuery += ` AND location ILIKE $${paramCounter}`;
      countValues.push(`%${location}%`);
      paramCounter++;
    }
    
    const countResult = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + result.rows.length < totalCount
      }
    });
    
    console.log(`Retrieved ${result.rows.length} startups`);
    
  } catch (error) {
    console.error('Error reading startups:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/v1/api/startups/read/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }
    
    const query = 'SELECT * FROM startups WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Startup not found'
      });
    }
    
    res.json({
      data: result.rows[0]
    });
    
    console.log(`Retrieved startup with ID: ${id}`);
    
  } catch (error) {
    console.error('Error reading startup:', error);
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
  console.log(`Read Startup Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});