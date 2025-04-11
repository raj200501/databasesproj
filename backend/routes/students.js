const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await pool.query('SELECT * FROM STUDENTS');
    res.json(students.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a student by email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const student = await pool.query('SELECT * FROM STUDENTS WHERE email = $1', [email]);
    if (student.rows.length === 0) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json(student.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// CREATE a new student
router.post('/', async (req, res) => {
  const { email, last_name, major, classification } = req.body;
  try {
    const newStudent = await pool.query(
      'INSERT INTO STUDENTS (email, last_name, major, classification) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, last_name, major, classification]
    );
    res.json(newStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE student details
router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { last_name, major, classification } = req.body;
  try {
    const updateStudent = await pool.query(
      'UPDATE STUDENTS SET last_name=$1, major=$2, classification=$3 WHERE email=$4 RETURNING *',
      [last_name, major, classification, email]
    );
    if (updateStudent.rows.length === 0) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json(updateStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a student
router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const deleteStudent = await pool.query('DELETE FROM STUDENTS WHERE email=$1 RETURNING *', [email]);
    if (deleteStudent.rows.length === 0) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json({ msg: 'Student deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
