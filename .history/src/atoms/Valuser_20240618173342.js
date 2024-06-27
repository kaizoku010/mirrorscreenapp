import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Box, Button, TextField } from '@mui/material';
import { db, collection, onSnapshot, doc, updateDoc } from '../operations/firebase'; // Adjust firebase imports as per your setup
import { ref, uploadBytes, getDownloadURL, storage } from '../operations/firebase'; // Adjust Firebase imports as per your setup
import { v4 as uuidv4 } from 'uuid';
import "./valuser.css";

function Valuser() {
  const location = useLocation();
  const initialData = location.state?.data;
  const [scannedData, setScannedData] = useState(initialData ? [initialData] : []);
  const [editedData, setEditedData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    id: '', // Ensure id is initialized
    name: '',
    email: '',
    job: '',
    office: '',
    simu: '',
    image: '',
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'checks'), (snapshot) => {
      const newData = [];
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (!newData.some(item => item.id === data.id)) {
          newData.push(data);
        }
      });
      setScannedData(newData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (data) => {
    setEditedData(data); // Optional: If you need to keep track of original data separately
    setEditedUser({
      id: data.id || '', // Ensure id is set
      name: data.name || '',
      email: data.email || '',
      job: data.occupation || '',
      office: data.office || '',
      simu: data.phonenumber || '',
      image: data.image || '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedUser({
      id: '',
      name: '',
      email: '',
      job: '',
      office: '',
      simu: '',
      image: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      const imageFileName = `${uuidv4()}-${imageFile.name}`;
      try {
        const storageRef = ref(storage, `/images/${imageFileName}`);
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);
        setEditedUser((prevUser) => ({
          ...prevUser,
          image: downloadURL,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.warn('No image file selected');
    }
  };

console.log("user_id: ", editedData?.id)

  const handleSave = async () => {
    if (editedUser.id) {


      const docRef = doc(db, 'checks', editedUser.id);
      try {
        await updateDoc(docRef, editedUser);
        setOpenModal(false);
        setEditedUser({
          id: '',
          name: '',
          email: '',
          job: '',
          office: '',
          simu: '',
          image: '',
        });
      } catch (error) {
        console.error('Error updating document:', error);
        alert('Failed to update document: ' + error.message);
      }
    } else {
      console.warn('No ID found in editedUser:', editedUser);
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="edit-modal-title">Edit User Details</h2>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editedUser.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Occupation"
            name="job"
            value={editedUser.job}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Office"
            name="office"
            value={editedUser.office}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="simu"
            value={editedUser.simu}
            onChange={handleChange}
          />
          <div className="nice-form-group">
            <label className="sub-title">Edit Profile Image</label>
            <input
              className="img-input"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="contained" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Valuser;
