import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, collection, onSnapshot, doc, updateDoc, getDoc } from '../operations/firebase'; // Adjust firebase imports as per your setup
import EditModal from './EditModal'; // Import your EditModal component
import "./valuser.css";

function Valuser() {
  const location = useLocation();
  const initialData = location.state?.data;
  const [scannedData, setScannedData] = useState(initialData ? [initialData] : []);
  const [editedData, setEditedData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'checks'), (snapshot) => {
      const newData = [];
      snapshot.forEach((doc) => {
        newData.push({ id: doc.id, ...doc.data() });
      });
      setScannedData(newData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (data) => {
    setEditedData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedData(null);
  };

  const handleSave = async (updatedUser) => {
    if (updatedUser && updatedUser.id) {
      const docRef = doc(db, 'checks', updatedUser.id);
      console.log("user id")
      try {
        await updateDoc(docRef, updatedUser);
        setOpenModal(false);
        setEditedData(null);
      } catch (error) {
        console.error('Error updating document:', error);
        alert('Failed to update document: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h1 className="new-data-header">Validated Data</h1>
      <div className="card-data">
        {scannedData.length > 0 ? (
          scannedData.map((data) => (
            <div key={data.id} className="card-holder" onClick={() => handleEdit(data)}>
              <img className="user-image" src={data.image} alt="Attendee" />
              <div className="card-right-side">
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Occupation:</strong> {data.job}</p>
                <p><strong>Office:</strong> {data.office}</p>
                <p><strong>Phone Number:</strong> {data.simu}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>

      <EditModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        data={editedData}
      />
    </div>
  );
}

export default Valuser;