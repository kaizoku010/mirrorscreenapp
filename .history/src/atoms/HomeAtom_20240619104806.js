import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularRevealPanel } from 'react-circular-reveal';
import PrintMe from './PrintMe';
import { db, collection, onSnapshot } from '../operations/firebase';
import { Modal, Box, Typography, Button } from '@mui/material';
import "./homeAtom.css";
import Logo from "../media/logo.svg";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function HomeAtom({ passcode }) {
  const [isOpened, setOpened] = useState(false);
  const [code, setCode] = useState('');
  const [checkedInIds, setCheckedInIds] = useState(new Set());
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    window.location.href = 'https://moxie5agency.com/';
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (passcode?.meta) {
      const object = passcode.meta.toString();
      setCode(object);
    }

    const checksRef = collection(db, 'checks');
    const unsubscribe = onSnapshot(checksRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') { // Changed to `change.type` instead of `change.password`
          const newCheck = change.doc.data();
          console.log('New check-in data: ', newCheck);
          if (!checkedInIds.has(newCheck.id)) {
            navigate('/validate', { state: { data: newCheck } });
            setCheckedInIds(prevIds => new Set([...prevIds, newCheck.uid]));
          } else {
            console.log(`Attendee ${newCheck.name} with ID ${newCheck.uid} is already checked in.`);
          }
        }
      });
    });

    handleOpen(); // Open the modal when component mounts

    return () => unsubscribe();
  }, [passcode, navigate, checkedInIds]);

  return (
    <>
      <CircularRevealPanel
        reveal={isOpened}
        revealContent={
          <div className='print-me-area revealed'>
            <PrintMe payload={passcode?.meta} />
          </div>
        }
      >
        <div className='home-page content'>
          <div className='text-holder'>
            <div className='logo-holder'> 
              <img className='skip' src={Logo}/>
            </div>
            <div className='text-holder_'>
              {/* <h1 className='hello-text'>Hello</h1>
              <h2 className='welcome-text'>Welcome To Our Tech Launch</h2>
              <p className='please-me-text'>Please Wait As Your Ticket Is Validated, We Shall Check You In Shortly. Thank You!</p> */}
              <button className='start-here' onClick={handleButtonClick}>Start Here</button>
            </div>
          </div>
        </div>
      </CircularRevealPanel>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Register for one of our events to check in
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please register for one of our upcoming events to proceed with the check-in process.
          </Typography>
          <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Modal>
    </>
  );
}

export default HomeAtom;
