const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await pool.query('SELECT * FROM EVENTS');
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET an event by event_id
router.get('/:event_id', async (req, res) => {
  const { event_id } = req.params;
  try {
    const event = await pool.query('SELECT * FROM EVENTS WHERE event_id = $1', [event_id]);
    if (event.rows.length === 0) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// CREATE a new event
router.post('/', async (req, res) => {
  const { event_location, event_date, club_id, organizer_id } = req.body;
  try {
    const newEvent = await pool.query(
      'INSERT INTO EVENTS (event_location, event_date, club_id, organizer_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [event_location, event_date, club_id, organizer_id]
    );
    res.json(newEvent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE an event
router.put('/:event_id', async (req, res) => {
  const { event_id } = req.params;
  const { event_location, event_date, club_id, organizer_id } = req.body;
  try {
    const updateEvent = await pool.query(
      'UPDATE EVENTS SET event_location=$1, event_date=$2, club_id=$3, organizer_id=$4 WHERE event_id=$5 RETURNING *',
      [event_location, event_date, club_id, organizer_id, event_id]
    );
    if (updateEvent.rows.length === 0) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(updateEvent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE an event
router.delete('/:event_id', async (req, res) => {
  const { event_id } = req.params;
  try {
    const deleteEvent = await pool.query('DELETE FROM EVENTS WHERE event_id=$1 RETURNING *', [event_id]);
    if (deleteEvent.rows.length === 0) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
