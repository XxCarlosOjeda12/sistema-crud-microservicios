// ============================================
// UPDATE STARTUP
// File: services/startups/update/index.js
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVICE_PORT || 3003;

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
  res.json({ status: 'healthy', service: 'update-startup' });
});

app.put('/v1/api/startups/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, foundedAt, location, category, fundingAmount } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }
    
    const checkQuery = 'SELECT * FROM startups WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Startup not found'
      });
    }
    
    const updates = [];
    const values = [];
    let paramCounter = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramCounter}`);
      values.push(name);
      paramCounter++;
    }
    
    if (foundedAt !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(foundedAt)) {
        return res.status(400).json({
          error: 'Invalid date format. Use YYYY-MM-DD'
        });
      }
      updates.push(`founded_at = $${paramCounter}`);
      values.push(foundedAt);
      paramCounter++;
    }
    
    if (location !== undefined) {
      updates.push(`location = $${paramCounter}`);
      values.push(location);
      paramCounter++;
    }
    
    if (category !== undefined) {
      updates.push(`category = $${paramCounter}`);
      values.push(category);
      paramCounter++;
    }
    
    if (fundingAmount !== undefined) {
      if (isNaN(fundingAmount) || fundingAmount < 0) {
        return res.status(400).json({
          error: 'Invalid funding amount'
        });
      }
      updates.push(`funding_amount = $${paramCounter}`);
      values.push(fundingAmount);
      paramCounter++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update'
      });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    values.push(id);
    
    const updateQuery = `
      UPDATE startups 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, values);
    
    res.json({
      message: 'Startup updated successfully',
      data: result.rows[0]
    });
    
    console.log(`Updated startup with ID: ${id}`);
    
  } catch (error) {
    console.error('Error updating startup:', error);
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
  console.log(`Update Startup Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});