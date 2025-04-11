const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import API routes
const studentsRouter = require('./routes/students');
const clubsRouter = require('./routes/clubs');
const eventsRouter = require('./routes/events');
const attendanceRouter = require('./routes/attendance');
const notificationsRouter = require('./routes/notifications');
// (Add additional routers as needed, e.g. membershipTrends, clubOfficers, eventOrganizers, universityAdmins, etc.)

// Set up route endpoints
app.use('/api/students', studentsRouter);
app.use('/api/clubs', clubsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/', (req, res) => {
  res.send('Campus Club Event Management API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
