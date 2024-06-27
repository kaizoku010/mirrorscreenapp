import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Box, Button, TextField } from '@mui/material';
import { db, collection, onSnapshot, doc, setDoc, ref, uploadBytes, getDownloadURL, storage } from '../operations/firebase'; // Adjust firebase imports as per your setup
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

      // Hide the video after capturing the image
      if (videoRef.current) {
        videoRef.current.pause(); // Pause the video
        videoRef.current.srcObject = null; // Remove the video source
      }

      // Upload the captured image
      const imageFileName = `${uuidv4()}.jpg`;
      const storageRef = ref(storage, `/images/${imageFileName}`);
      await uploadBytes(storageRef, photoBlob);
      const downloadURL = await getDownloadURL(storageRef);
      setEditedUser((prevUser) => ({
        ...prevUser,
        image: downloadURL,
      }));
    } catch (error) {
      console.error('Failed to capture image from camera: ', error);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startVideoStream();
  };

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
    startVideoStream();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    stopVideoStream();
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
            {!capturedImage && <video ref={videoRef} autoPlay playsInline />}
            {!capturedImage && <Button onClick={handleCapture}>Capture Image</Button>}
            {capturedImage && <img src={capturedImage} alt="Captured" />}
            {capturedImage && <Button onClick={handleRetake}>Retake Image</Button>}
            <input
              className="img-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }} // Hide the file input field
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
