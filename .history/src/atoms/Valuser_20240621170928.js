import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Box, Button, TextField } from '@mui/material';
import { db, collection, onSnapshot, doc, setDoc, ref, uploadBytes, getDownloadURL, storage } from '../operations/firebase'; // Adjust firebase imports as per your setup
import { v4 as uuidv4 } from 'uuid';
import './valuser.css';
import QRCode from "react-qr-code";

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
  const printRef = useRef();

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
      simu:
