const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await pool.query('SELECT * FROM CLUBS');
    res.json(clubs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a club by club_name
router.get('/:club_name', async (req, res) => {
  const { club_name } = req.params;
  try {
    const club = await pool.query('SELECT * FROM CLUBS WHERE club_name = $1', [club_name]);
    if (club.rows.length === 0) {
      return res.status(404).json({ msg: 'Club not found' });
    }
    res.json(club.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// CREATE a new club
router.post('/', async (req, res) => {
  const { club_name, club_budget, club_description } = req.body;
  try {
    const newClub = await pool.query(
      'INSERT INTO CLUBS (club_name, club_budget, club_description) VALUES ($1, $2, $3) RETURNING *',
      [club_name, club_budget, club_description]
    );
    res.json(newClub.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE a club
router.put('/:club_name', async (req, res) => {
  const { club_name } = req.params;
  const { club_budget, club_description } = req.body;
  try {
    const updateClub = await pool.query(
      'UPDATE CLUBS SET club_budget=$1, club_description=$2 WHERE club_name=$3 RETURNING *',
      [club_budget, club_description, club_name]
    );
    if (updateClub.rows.length === 0) {
      return res.status(404).json({ msg: 'Club not found' });
    }
    res.json(updateClub.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a club
router.delete('/:club_name', async (req, res) => {
  const { club_name } = req.params;
  try {
    const deleteClub = await pool.query('DELETE FROM CLUBS WHERE club_name=$1 RETURNING *', [club_name]);
    if (deleteClub.rows.length === 0) {
      return res.status(404).json({ msg: 'Club not found' });
    }
    res.json({ msg: 'Club deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
