import React from 'react';
import EventDetail from './EventDetail';

const EventList = ({ events }) => {
  return (
    <div>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map(event => (
          <EventDetail key={event.event_id} event={event} />
        ))
      )}
    </div>
  );
};

export default EventList;
