// ============================================
// CREATE TECHNOLOGY
// File: services/technologies/create/index.js
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVICE_PORT || 3005;

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
  res.json({ status: 'healthy', service: 'create-technology' });
});

app.post('/v1/api/technologies/create', async (req, res) => {
  try {
    const { name, sector, description, adoptionLevel } = req.body;
    
    if (!name || !sector || !adoptionLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'sector', 'adoptionLevel']
      });
    }
    
    const validAdoptionLevels = ['emerging', 'growing', 'mature', 'declining'];
    if (!validAdoptionLevels.includes(adoptionLevel)) {
      return res.status(400).json({
        error: 'Invalid adoption level',
        validLevels: validAdoptionLevels
      });
    }
    
    const query = `
      INSERT INTO technologies (name, sector, description, adoption_level)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [name, sector, description || null, adoptionLevel];
    const result = await pool.query(query, values);
    
    res.status(201).json({
      message: 'Technology created successfully',
      data: result.rows[0]
    });
    
    console.log(`Created technology: ${name}`);
    
  } catch (error) {
    console.error('Error creating technology:', error);
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
  console.log(`Create Technology Service running on port ${PORT}`);
});

// ============================================
// READ TECHNOLOGY SERVICE
// File: services/technologies/read/index.js
// ============================================
// PORT 3006
// Similar structure, but with:

// GET /v1/api/technologies/read
// Query params: sector, adoptionLevel, name
// Returns list with pagination

// GET /v1/api/technologies/read/:id
// Returns single technology by ID

// ============================================
// UPDATE TECHNOLOGY SERVICE 
// File: services/technologies/update/index.js
// ============================================
// PORT 3007
// PUT /v1/api/technologies/update/:id
// Updates only provided fields

// ============================================
// DELETE TECHNOLOGY SERVICE
// File: services/technologies/delete/index.js
// ============================================
// PORT 3008
// DELETE /v1/api/technologies/delete/:id
// Deletes technology by ID