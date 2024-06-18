import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, collection, onSnapshot } from '../operations/firebase'; // Adjust firebase imports as per your setup
import "./valuser.css";

function Valuser() {
  const location = useLocation();
  const initialData = location.state?.data;
  const [scannedData, setScannedData] = useState(initialData ? [initialData] : []);

  useEffect(() => {
    const checksRef = collection(db, 'checks');
    const unsubscribe = onSnapshot(checksRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newCheck = change.doc.data();
          console.log('New check-in data: ', newCheck);
          // Check if newCheck is already in scannedData
          if (!scannedData.find(item => item.uid === newCheck.uid)) {
            setScannedData(prevData => [...prevData, newCheck]);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [scannedData]);

  return (
    <div>
      <h1 className='new-data-header'>Validated Data</h1>
      <div className='card-data'>
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
