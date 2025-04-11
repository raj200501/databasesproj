import React from 'react';

const EventDetail = ({ event }) => {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h3>Event ID: {event.event_id}</h3>
      <p>Location: {event.event_location}</p>
      <p>Date: {new Date(event.event_date).toLocaleString()}</p>
      <p>Club ID: {event.club_id}</p>
      <p>Organizer ID: {event.organizer_id}</p>
    </div>
  );
};

export default EventDetail;
