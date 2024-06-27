// EditModal.js
import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { ref, uploadBytes, getDownloadURL,st } from '../operations/firebase'; // Adjust Firebase imports as per your setup
import { v4 as uuidv4 } from 'uuid';

const EditModal = ({ open, onClose, onSave, user }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];
    const imageFileName = `${uuidv4()}-${imageFile.name}`;
    try {
      const storageRef = ref(storage, `/images/${imageFileName}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      setEditedUser(prevUser => ({
        ...prevUser,
        image: downloadURL
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSave = () => {
    onSave(editedUser);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <h2 id="edit-modal-title">Edit User Details</h2>
        <TextField fullWidth label="Name" name="name" value={editedUser.name} onChange={handleChange} />
        <TextField fullWidth label="Email" name="email" value={editedUser.email} onChange={handleChange} />
        <TextField fullWidth label="Occupation" name="job" value={editedUser.job} onChange={handleChange} />
        <TextField fullWidth label="Office" name="office" value={editedUser.office} onChange={handleChange} />
        <TextField fullWidth label="Phone Number" name="simu" value={editedUser.simu} onChange={handleChange} />
        <div className="nice-form-group">
          <label className="sub-title">Edit Profile Image</label>
          <input
            className="img-input"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <Button variant="contained" onClick={handleSave}>Save Changes</Button>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
      </Box>
    </Modal>
  );
};

export default EditModal;
