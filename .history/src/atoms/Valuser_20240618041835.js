import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./valuser.css"

function Valuser() {
  const location = useLocation();
  const initialData = location.state?.data;
  const [scannedData, setScannedData] = useState(initialData ? [initialData] : []);

  useEffect(() => {
    if (initialData) {
      setScannedData(prevData => [...prevData, initialData]);
    }
  }, [initialData]);

  return (
<div>
    
    <div className='card-data'>
      <h1 className='new-data-header'>Validated Data</h1>
      {scannedData.length > 0 ? (
        scannedData.map((data, index) => (
          <div key={index} className='card-holder'>
            <img className='user-image' src={data.image} alt="Attendee" />
            <div className='card-right-side'>
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Occupation:</strong> {data.occupation}</p>
              <p><strong>Office:</strong> {data.office}</p>
              <p><strong>Phone Number:</strong> {data.phonenumber}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
</div>
    

  );
}

export default Valuser;
