const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await pool.query('SELECT * FROM NOTIFICATIONS');
    res.json(notifications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a notification by id
router.get('/:notification_id', async (req, res) => {
  const { notification_id } = req.params;
  try {
    const notification = await pool.query('SELECT * FROM NOTIFICATIONS WHERE notification_id = $1', [notification_id]);
    if (notification.rows.length === 0) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    res.json(notification.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// CREATE a new notification
router.post('/', async (req, res) => {
  const { notification_message, recipient_id, notification_state_sent } = req.body;
  try {
    const newNotification = await pool.query(
      'INSERT INTO NOTIFICATIONS (notification_message, recipient_id, notification_state_sent) VALUES ($1, $2, $3) RETURNING *',
      [notification_message, recipient_id, notification_state_sent]
    );
    res.json(newNotification.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE a notification (e.g., mark as sent)
router.put('/:notification_id', async (req, res) => {
  const { notification_id } = req.params;
  const { notification_state_sent } = req.body;
  try {
    const updateNotification = await pool.query(
      'UPDATE NOTIFICATIONS SET notification_state_sent=$1 WHERE notification_id=$2 RETURNING *',
      [notification_state_sent, notification_id]
    );
    if (updateNotification.rows.length === 0) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    res.json(updateNotification.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a notification
router.delete('/:notification_id', async (req, res) => {
  const { notification_id } = req.params;
  try {
    const deleteNotification = await pool.query('DELETE FROM NOTIFICATIONS WHERE notification_id=$1 RETURNING *', [notification_id]);
    if (deleteNotification.rows.length === 0) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    res.json({ msg: 'Notification deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
