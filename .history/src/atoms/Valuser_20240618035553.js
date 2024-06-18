import React from 'react';
import { useLocation } from 'react-router-dom';
import "./valuser.css"
function Valuser() {
  const location = useLocation();
  const data = location.state?.data;

  console.log("data from scanner: ", data);

  return (
    <div>
      <h1 >New Check-In Data</h1>
      {data ? (
        <div className='card-holder'>
        <img className='user-image' src={data.image} alt="Attendee" />
<div className='card-right-side'>
    <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Occupation:</strong> {data.occupation}</p>
          <p><strong>Office:</strong> {data.office}</p>
          <p><strong>Phone Number:</strong> {data.phonenumber}</p>
</div>
          
          {/* <p><strong>Selected Event:</strong> {data.selectedEvent}</p> */}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default Valuser;
