// ============================================
// UPDATE TECHNOLOGY   
// File: services/technologies/update/index.js
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVICE_PORT || 3007;

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
  res.json({ status: 'healthy', service: 'update-technology' });
});

app.put('/v1/api/technologies/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sector, description, adoptionLevel } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }
    
    const checkQuery = 'SELECT * FROM technologies WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Technology not found'
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
    
    if (sector !== undefined) {
      updates.push(`sector = $${paramCounter}`);
      values.push(sector);
      paramCounter++;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramCounter}`);
      values.push(description);
      paramCounter++;
    }
    
    if (adoptionLevel !== undefined) {
      const validLevels = ['emerging', 'growing', 'mature', 'declining'];
      if (!validLevels.includes(adoptionLevel)) {
        return res.status(400).json({
          error: 'Invalid adoption level',
          validLevels: validLevels
        });
      }
      updates.push(`adoption_level = $${paramCounter}`);
      values.push(adoptionLevel);
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
      UPDATE technologies 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, values);
    
    res.json({
      message: 'Technology updated successfully',
      data: result.rows[0]
    });
    
    console.log(`Updated technology with ID: ${id}`);
    
  } catch (error) {
    console.error('Error updating technology:', error);
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
  console.log(`Update Technology Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});