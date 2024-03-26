const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { param, body, validationResult } = require('express-validator');

const app = express();
const PORT = 8080;

// PostgreSQL database configuration
const pool = new Pool({
  user: 'main',
  host: process.env.HOST || "localhost",
  database: 'truckdb',
  password: 'password',
  port: 5432,
});

app.use(bodyParser.json());
// Serve static files from the 'build' directory
app.use(express.static('build'));

// GET all trucks
app.get('/api/trucks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trucks');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// GET truck by ID
app.get('/api/trucks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM trucks WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Truck not found');
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST a new truck
app.post('/api/trucks',
  [
    body('model').notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1900 }).withMessage('Year must be a valid year'),
    body('price').notEmpty().withMessage('Price is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    const { sub_type_id, vendor_id, model, year, price, description } = req.body;
    try {
      const errors = validationResult(req);
      errors.isEmpty() || errors.throw();
      const result = await pool.query(
        'INSERT INTO trucks (sub_type_id, vendor_id, model, year, price, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [sub_type_id, vendor_id, model, year, price, description]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// PUT update truck by ID
app.put('/api/truck/:id', async (req, res) => {
  const { id } = req.params;
  const { sub_type_id, vendor_id, model, year, price, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE trucks SET sub_type_id = $1, vendor_id = $2, model = $3, year = $4, price = $5, description = $6 WHERE id = $7 RETURNING *',
      [sub_type_id, vendor_id, model, year, price, description, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Truck not found');
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE truck by ID
app.delete('/api/truck/:id',
  [ 
    param('id').notEmpty().withMessage('Model is required'),
    param('id').isInt().withMessage('ID must be a valid integer')
  ],
  async (req, res) => {
  const { id } = req.params;
  try {
    const errors = validationResult(req);
    errors.isEmpty() || errors.throw();
    await pool.query('DELETE FROM trucks WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
