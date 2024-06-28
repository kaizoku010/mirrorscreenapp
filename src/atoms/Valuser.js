import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Box, Button, TextField } from '@mui/material';
//import { db, collection, onSnapshot, doc, setDoc, ref, uploadBytes, getDownloadURL, storage } from '../operations/firebase'; // Adjust firebase imports as per your setup
import { dynamoDB, s3 } from '../operations/aws-config';

import { v4 as uuidv4 } from 'uuid';
import QRCode from "react-qr-code";
import './valuser.css';

function Valuser() {
  const location = useLocation();
  const initialData = location.state?.data;
  const [scannedData, setScannedData] = useState(initialData ? [initialData] : []);
  const [editedData, setEditedData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    id: '',
    name: '',
    email: '',
    job: '',
    office: '',
    simu: '',
    image: '',
  });
  const [capturedImage, setCapturedImage] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef();
  const printRef = useRef();

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const params = {
          TableName: 'attendees'
        };
        const data = await dynamoDB.scan(params).promise();
        const newData = data.Items;
        setScannedData(newData);
      } catch (error) {
        console.error('Error fetching check-ins', error);
      }
    };
    fetchChecks();
  }, []);

  const handleEdit = (data) => {
    console.log('Editing data:', data); // Log the data being edited
    setEditedData(data);
    setEditedUser({
      uid: data.uid || '', // Use uid instead of id
      name: data.name || '',
      email: data.email || '',
      job: data.occupation || '',
      office: data.office || '',
      simu: data.phonenumber || '',
      image: data.image || '',
    });
    setOpenModal(true);
    startVideoStream();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedUser({
      uid: '',
      name: '',
      email: '',
      job: '',
      office: '',
      simu: '',
      image: '',
    });
    stopVideoStream();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      const imageFileName = `${uuidv4()}-${imageFile.name}`;
      try {
        const params = {
          Bucket: 'your-bucket-name',
          Key: `images/${imageFileName}`,
          Body: imageFile,
          ACL: 'public-read'
        };
        const upload = await s3.upload(params).promise();
        setEditedUser(prevUser => ({
          ...prevUser,
          image: upload.Location
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.warn('No image file selected');
    }
  };

  const handleCapture = async () => {
    try {
      if (!videoStream) {
        console.error('Video stream is not available.');
        return;
      }

      const track = videoStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const photoBlob = await imageCapture.takePhoto();
      const imageData = URL.createObjectURL(photoBlob);
      setCapturedImage(imageData);
      setEditedUser(prevUser => ({
        ...prevUser,
        image: imageData,
      }));

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    } catch (error) {
      console.error('Failed to capture image from camera:', error);
    }
  };

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to start video stream:', error);
    }
  };

  const stopVideoStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };


  const handleSave = async () => {
    if (editedUser.uid) {
      console.log('Saving user:', editedUser); // Log the user data before saving
      const params = {
        //TableName: 'checks',
        TableName: 'attendees',
        Item: { ...editedUser }
      };
      try {
        await dynamoDB.put(params).promise();
        console.log('User saved successfully');
        setOpenModal(false);
        setEditedData(null);
        setEditedUser({
          uid: '',
          name: '',
          email: '',
          job: '',
          office: '',
          simu: '',
          image: '',
        });
      } catch (error) {
        console.error('Error setting document:', error);
        alert('Failed to set document: ' + error.message);
      }
    } else {
      console.error('Edited user ID');
    }
  };



  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div className='ticket-page' ref={printRef}>
      <div className="card-data">
        {scannedData.length > 0 ? (
          scannedData.map(data => (
            <div key={data.uid} className="card-holder" onClick={() => handleEdit(data)}>
              <img className="user-image" src={data.image} alt="Attendee" />
              <div className="card-right-side">
                <p><strong className='user_details'>{data.name}</strong></p>
                <p><strong className='user_details'>{data.email}</strong></p>
                <p><strong className='user_details'>Company: {data.job || "N/A"}</strong></p>
                <p><strong ></strong>Occupation: {data.office || "N/A"}</p>
                <p><strong></strong>Contact: {data.simu || "N/A"}</p>
                <p><strong></strong>Passcode: {data.password}</p>

                <div className='user-qr-code'>
                  <QRCode color='red' value={`${data.email},${data.name}`} />
                </div>
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
            width: '80%',
            maxWidth: 600,
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
          {capturedImage && <img src={capturedImage} alt="Captured" />}
          {!capturedImage && <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />}
          {!capturedImage && <Button variant="contained" onClick={handleCapture}>Capture Image</Button>}
          {capturedImage && <Button variant="contained" onClick={() => setCapturedImage(null)}>Retake</Button>}
          <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          <Button variant="contained" onClick={handleCloseModal}>Cancel</Button>
        </Box>
      </Modal>

      <Button className="no-print" variant="contained" onClick={handlePrint}>Print Ticket</Button>
    </div>
  );
}

export default Valuser;
