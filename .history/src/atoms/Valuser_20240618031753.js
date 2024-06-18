import React from 'react'
import { useLocation } from 'react-router-dom';


function Valuser() {
    return (
        <div>
          <h1>New Check-In Data</h1>
          {data ? (
            <div>
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Occupation:</strong> {data.occupation}</p>
              <p><strong>Office:</strong> {data.office}</p>
              <p><strong>Phone Number:</strong> {data.phonenumber}</p>
              <p><strong>Selected Event:</strong> {data.selectedEvent}</p>
              {/* Add more fields as needed */}
              <img src={data.image} alt="Attendee" />
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      );
    }

export default Valuser