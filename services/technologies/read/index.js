// ============================================
// READ TECHNOLOGY  
// File: services/technologies/read/index.js
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVICE_PORT || 3006;

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
  res.json({ status: 'healthy', service: 'read-technology' });
});

app.get('/v1/api/technologies/read', async (req, res) => {
  try {
    const { name, sector, adoptionLevel, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM technologies WHERE 1=1';
    const values = [];
    let paramCounter = 1;
    
    if (name) {
      query += ` AND name ILIKE $${paramCounter}`;
      values.push(`%${name}%`);
      paramCounter++;
    }
    
    if (sector) {
      query += ` AND sector ILIKE $${paramCounter}`;
      values.push(`%${sector}%`);
      paramCounter++;
    }
    
    if (adoptionLevel) {
      query += ` AND adoption_level = $${paramCounter}`;
      values.push(adoptionLevel);
      paramCounter++;
    }
    
    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, values);
    
    let countQuery = 'SELECT COUNT(*) FROM technologies WHERE 1=1';
    const countValues = [];
    paramCounter = 1;
    
    if (name) {
      countQuery += ` AND name ILIKE $${paramCounter}`;
      countValues.push(`%${name}%`);
      paramCounter++;
    }
    
    if (sector) {
      countQuery += ` AND sector ILIKE $${paramCounter}`;
      countValues.push(`%${sector}%`);
      paramCounter++;
    }
    
    if (adoptionLevel) {
      countQuery += ` AND adoption_level = $${paramCounter}`;
      countValues.push(adoptionLevel);
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
    
    console.log(`Retrieved ${result.rows.length} technologies`);
    
  } catch (error) {
    console.error('Error reading technologies:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/v1/api/technologies/read/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }
    
    const query = 'SELECT * FROM technologies WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Technology not found'
      });
    }
    
    res.json({
      data: result.rows[0]
    });
    
    console.log(`Retrieved technology with ID: ${id}`);
    
  } catch (error) {
    console.error('Error reading technology:', error);
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
  console.log(`Read Technology Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});