const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await pool.query('SELECT * FROM ATTENDANCE');
    res.json(attendance.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a specific attendance record
router.get('/:attendance_id', async (req, res) => {
  const { attendance_id } = req.params;
  try {
    const attendanceRecord = await pool.query('SELECT * FROM ATTENDANCE WHERE attendance_id = $1', [attendance_id]);
    if (attendanceRecord.rows.length === 0) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    res.json(attendanceRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// CREATE a new attendance record
router.post('/', async (req, res) => {
  const { check_in_time, check_out_time, event_id, student_id } = req.body;
  try {
    const newAttendance = await pool.query(
      'INSERT INTO ATTENDANCE (check_in_time, check_out_time, event_id, student_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [check_in_time, check_out_time, event_id, student_id]
    );
    res.json(newAttendance.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE an attendance record
router.put('/:attendance_id', async (req, res) => {
  const { attendance_id } = req.params;
  const { check_in_time, check_out_time } = req.body;
  try {
    const updateAttendance = await pool.query(
      'UPDATE ATTENDANCE SET check_in_time=$1, check_out_time=$2 WHERE attendance_id=$3 RETURNING *',
      [check_in_time, check_out_time, attendance_id]
    );
    if (updateAttendance.rows.length === 0) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    res.json(updateAttendance.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE an attendance record
router.delete('/:attendance_id', async (req, res) => {
  const { attendance_id } = req.params;
  try {
    const deleteAttendance = await pool.query('DELETE FROM ATTENDANCE WHERE attendance_id=$1 RETURNING *', [attendance_id]);
    if (deleteAttendance.rows.length === 0) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    res.json({ msg: 'Attendance record deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
