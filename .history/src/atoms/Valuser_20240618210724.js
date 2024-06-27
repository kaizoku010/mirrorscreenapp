import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Box, Button, TextField } from '@mui/material';
import { db, collection, onSnapshot, doc, setDoc, ref, uploadBytes, getDownloadURL, storage } from '../operations/firebase'; // Adjust firebase imports as per your setup
import { v4 as uuidv4 } from 'uuid';
import './valuser.css';

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
  const [capturedImage, setCapturedImage] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef();

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
    startVideoStream(); // Start video stream when opening the modal
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
    stopVideoStream(); // Stop video stream when closing the modal
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
      setEditedUser((prevUser) => ({
        ...prevUser,
        image: imageData,
      }));

      // Hide the video after capturing the image
      if (videoRef.current) {
        videoRef.current.pause(); // Pause the video
        videoRef.current.srcObject = null; // Remove the video source
      }
    } catch (error) {
      console.error('Failed to capture image from camera: ', error);
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
      console.error('Failed to start video stream: ', error);
    }
  };

  const stopVideoStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  const handleSave = async () => {
    if (editedUser.id) {
      const docRef = doc(db, 'checks', editedUser.id);
      try {
        await setDoc(docRef, { ...editedUser }); // Using set instead of updateDoc
        setOpenModal(false);
        setEditedData(null);
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
        console.error('Error setting document:', error);
        alert('Failed to set document: ' + error.message);
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
                <p><strong className='user-details'>{data.name}</strong></p>
                <p><strong className='user-details'>{data.email}</strong></p>
                <p><strong className='user-details'> {data.job}</strong></p>
                <p><strong className='user-details'> {data.office}</strong></p>
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
          {capturedImage && <img src={capturedImage} alt="Captured" />}
          {!capturedImage && <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', bottom: 10, right: 10, width: 100, height: 100, zIndex: 10 }} />}
          {!capturedImage && <Button variant="contained" onClick={handleCapture}>Capture Image</Button>}
          {capturedImage && <Button variant="contained" onClick={() => setCapturedImage(null)}>Retake</Button>}
          <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          <Button variant="contained" onClick={handleCloseModal}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Valuser;
