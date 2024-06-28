import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from 'aws-sdk'; // Adjust AWS SDK

const s3 = new Storage({
  // Configure AWS S3 credentials and region
  region: 'us-east-1', 
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const EditModal = ({ open, onClose, onSave, data }) => {
  const [editedUser, setEditedUser] = useState({
    id: data?.id || '',
    name: data?.name || '',
    email: data?.email || '',
    job: data?.occupation || '',
    office: data?.office || '',
    simu: data?.phonenumber || '',
    image: data?.image || '',
  });

  useEffect(() => {
    if (data) {
      setEditedUser({
        id: data.id || '',
        name: data.name || '',
        email: data.email || '',
        job: data.occupation || '',
        office: data.office || '',
        simu: data.phonenumber || '',
        image: data.image || '',
      });
    }
  }, [data]);

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
        // Upload image to AWS S3
        const uploadParams = {
          Bucket: 'moxieeventsbucket',
          Key: `images/${imageFileName}`,
          Body: imageFile,
          ACL: 'public-read', // Optional: Adjust permissions as needed
        };
        const data = await s3.upload(uploadParams).promise();

        // Get image URL from S3
        const imageURL = data.Location;

        setEditedUser((prevUser) => ({
          ...prevUser,
          image: imageURL,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.warn('No image file selected');
    }
  };

  const handleSave = () => {
    console.log('Save button clicked'); // Check if the button click is logged
    console.log('Edited user:', editedUser); // Check the editedUser state
    try {
      console.log('Save button clicked'); // Check if the button click is logged
      console.log('Edited user:', editedUser); // Check the editedUser state
      onSave(editedUser); // Ensure onSave function is invoked with correct data
    } catch (error) {
      console.error('Error saving user:', error); // Log any errors that occur during save
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default EditModal;