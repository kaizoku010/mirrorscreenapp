import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, collection, onSnapshot, doc, updateDoc } from '../operations/firebase'; // Adjust firebase imports as per your setup
import "./valuser.css";

function Valuser() {
  const location = useLocation();
  const initialData = location.state?.data;
  const [scannedData, setScannedData] = useState(initialData ? [initialData] : []);
  const [editedData, setEditedData] = useState(null); // State to hold edited data temporarily

  useEffect(() => {
    const checksRef = collection(db, 'checks');
    const unsubscribe = onSnapshot(checksRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newCheck = change.doc.data();
          console.log('New check-in data: ', newCheck);
          if (!scannedData.find(item => item.uid === newCheck.uid)) {
            setScannedData(prevData => [...prevData, newCheck]);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [scannedData]);

  const handleEdit = (data) => {
    setEditedData(data); // Set the data to be edited in state
  };

  const handleSave = async () => {
    if (editedData) {
      const docRef = doc(db, 'checks', editedData.uid);
      await updateDoc(docRef, editedData); // Update the document in Firestore
      setEditedData(null); // Clear edited data after saving
    }
  };

  const handleChange = (e, field) => {
    const newValue = e.target.value;
    setEditedData(prevData => ({
      ...prevData,
      [field]: newValue
    }));
  };

  return (
    <div>
      <h1 className='new-data-header'>Validated Data</h1>
      <div className='card-data'>
        {scannedData.length > 0 ? (
          scannedData.map((data, index) => (
            <div key={index} className='card-holder'>
              <img className='user-image' src={data.image} alt="Attendee" />
              <div className='card-right-side'>
                {/* Editable fields */}
                <p><strong>Name:</strong> <input type="text" value={editedData?.name || data.name} onChange={(e) => handleChange(e, 'name')} /></p>
                <p><strong>Email:</strong> <input type="email" value={editedData?.email || data.email} onChange={(e) => handleChange(e, 'email')} /></p>
                <p><strong>Occupation:</strong> <input type="text" value={editedData?.occupation || data.occupation} onChange={(e) => handleChange(e, 'occupation')} /></p>
                <p><strong>Office:</strong> <input type="text" value={editedData?.office || data.office} onChange={(e) => handleChange(e, 'office')} /></p>
                <p><strong>Phone Number:</strong> <input type="tel" value={editedData?.phonenumber || data.phonenumber} onChange={(e) => handleChange(e, 'phonenumber')} /></p>
                {/* Save button */}
                <button onClick={() => handleSave()}>Save Changes</button>
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
