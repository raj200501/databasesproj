import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventList from './EventList';

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Replace the URL with your backend URL if deployed
    axios.get('http://localhost:5000/api/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <EventList events={events} />
    </div>
  );
};

export default Dashboard;
