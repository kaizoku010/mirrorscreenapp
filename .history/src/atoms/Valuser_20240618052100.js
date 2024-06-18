import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, collection, onSnapshot, doc, updateDoc } from '../operations/firebase'; // Adjust firebase imports as per your setup
import "./valuser.css";

function Valuser() {
  const location = useLocation();
  const initialData = location.state?.data;
  const [scannedData, setScannedData] = useState(initialData ? [initialData] : []);
  const [editedData, setEditedData] = useState(null); // State to hold edited data temporarily
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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

  // Function to handle click on an item to open edit modal
  const handleEdit = (data) => {
  console.log("clicked")
    setEditedData(data); // Set the data to be edited in state
    setShowModal(true); // Show the edit modal
  };

  // Function to handle closing the edit modal
  const handleCloseModal = () => {
    setShowModal(false); // Close the edit modal
    setEditedData(null); // Clear edited data
  };

  // Function to handle saving edited data
  const handleSave = async () => {
    if (editedData) {
      const docRef = doc(db, 'checks', editedData.uid);
      await updateDoc(docRef, editedData); // Update the document in Firestore
      setShowModal(false); // Close the modal after saving
      setEditedData(null); // Clear edited data after saving
    }
  };

  // Function to handle changes in input fields
  const handleChange = (e, field) => {
    const newValue = e.target.value;
    setEditedData(prevData => ({
      ...prevData,
      [field]: newValue
    }));
  };

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Handle image upload and update editedData with new image URL
    // Example: Upload to Firebase Storage and update editedData.image with the new URL
  };

  return (
    <div>
      <h1 className='new-data-header'>Validated Data</h1>
      <div className='card-data'>
        {scannedData.length > 0 ? (
          scannedData.map((data, index) => (
            <div key={index} className='card-holder' onClick={() => handleEdit(data)}>
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

      {/* Edit Modal */}
      {editedData && (
        <div className={`edit-modal ${showModal ? 'active' : ''}`}>
          <div className='modal-content'>
            <span className='close' onClick={handleCloseModal}>&times;</span>
            <h2>Edit User Details</h2>
            <label>Name: <input type="text" value={editedData.name} onChange={(e) => handleChange(e, 'name')} /></label>
            <label>Email: <input type="email" value={editedData.email} onChange={(e) => handleChange(e, 'email')} /></label>
            <label>Occupation: <input type="text" value={editedData.occupation} onChange={(e) => handleChange(e, 'occupation')} /></label>
            <label>Office: <input type="text" value={editedData.office} onChange={(e) => handleChange(e, 'office')} /></label>
            <label>Phone Number: <input type="tel" value={editedData.phonenumber} onChange={(e) => handleChange(e, 'phonenumber')} /></label>
            {/* Input for changing image */}
            <label>Change Image: <input type="file" accept="image/*" onChange={handleImageChange} /></label>
            <button onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Valuser;
