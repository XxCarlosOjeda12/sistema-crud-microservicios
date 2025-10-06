// ============================================
// DELETE TECHNOLOGY 
// File: services/technologies/delete/index.js
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVICE_PORT || 3008;

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
  res.json({ status: 'healthy', service: 'delete-technology' });
});

app.delete('/v1/api/technologies/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
    
    const technologyData = checkResult.rows[0];
    
    const deleteQuery = 'DELETE FROM technologies WHERE id = $1';
    await pool.query(deleteQuery, [id]);
    
    res.status(200).json({
      message: 'Technology deleted successfully',
      data: {
        id: technologyData.id,
        name: technologyData.name
      }
    });
    
    console.log(`Deleted technology with ID: ${id}, Name: ${technologyData.name}`);
    
  } catch (error) {
    console.error('Error deleting technology:', error);
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
  console.log(`Delete Technology Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});