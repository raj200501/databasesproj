const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all membership trends
router.get('/', async (req, res) => {
  try {
    const trends = await pool.query('SELECT * FROM MEMBERSHIP_TRENDS');
    res.json(trends.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a specific membership trend
router.get('/:membership_id', async (req, res) => {
  const { membership_id } = req.params;
  try {
    const trend = await pool.query('SELECT * FROM MEMBERSHIP_TRENDS WHERE membership_id = $1', [membership_id]);
    if (trend.rows.length === 0) {
      return res.status(404).json({ msg: 'Membership trend not found' });
    }
    res.json(trend.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// CREATE a new membership trend
router.post('/', async (req, res) => {
  const { student_id, club_id, membershipEndDate } = req.body;
  try {
    const newTrend = await pool.query(
      'INSERT INTO MEMBERSHIP_TRENDS (student_id, club_id, membershipEndDate) VALUES ($1, $2, $3) RETURNING *',
      [student_id, club_id, membershipEndDate]
    );
    res.json(newTrend.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE a membership trend
router.put('/:membership_id', async (req, res) => {
  const { membership_id } = req.params;
  const { membershipEndDate } = req.body;
  try {
    const updateTrend = await pool.query(
      'UPDATE MEMBERSHIP_TRENDS SET membershipEndDate=$1 WHERE membership_id=$2 RETURNING *',
      [membershipEndDate, membership_id]
    );
    if (updateTrend.rows.length === 0) {
      return res.status(404).json({ msg: 'Membership trend not found' });
    }
    res.json(updateTrend.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a membership trend
router.delete('/:membership_id', async (req, res) => {
  const { membership_id } = req.params;
  try {
    const deleteTrend = await pool.query('DELETE FROM MEMBERSHIP_TRENDS WHERE membership_id=$1 RETURNING *', [membership_id]);
    if (deleteTrend.rows.length === 0) {
      return res.status(404).json({ msg: 'Membership trend not found' });
    }
    res.json({ msg: 'Membership trend deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
