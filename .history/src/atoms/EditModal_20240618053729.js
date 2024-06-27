// EditModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';

const EditModal = ({ open, onClose, onSave, data }) => {
  const [editedData, setEditedData] = useState(data || { name: '', email: '', occupation: '', office: '', phonenumber: '' });

  useEffect(() => {
    // Update editedData when data changes
    setEditedData(data || { name: '', email: '', occupation: '', office: '', phonenumber: '' });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    // Handle image change logic here
    // Example: Upload image and update editedData.image with new URL
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
        <TextField fullWidth  name="name" value={editedData.name} onChange={handleChange} />
        <TextField fullWidth  name="email" value={editedData.email} onChange={handleChange} />
        <TextField fullWidth  name="occupation" value={editedData.occupation} onChange={handleChange} />
        <TextField fullWidth  name="office" value={editedData.office} onChange={handleChange} />
        <TextField fullWidth label="Phone Number" name="phonenumber" value={editedData.phonenumber} onChange={handleChange} />
        {/* Input for changing image */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button variant="contained" onClick={onSave}>Save Changes</Button>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
      </Box>
    </Modal>
  );
};

export default EditModal;
