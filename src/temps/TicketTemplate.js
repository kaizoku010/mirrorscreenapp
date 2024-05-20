import React from 'react';
import "./TicketTemplate.css";

function TicketTemplate({ payload }) {
  return (
    <div className="ticket-template">
      <h2>This is a mock Ticket to be printed: {payload}</h2>
      <h2>ID NUMBER</h2>
      <h2>QRCODE</h2>

    </div>
  );
}

export default TicketTemplate;
