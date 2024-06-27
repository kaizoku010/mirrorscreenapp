import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularRevealPanel } from 'react-circular-reveal';
import PrintMe from './PrintMe';
import { db, collection, onSnapshot } from '../operations/firebase';
import { Modal, Box, Typography, Button } from '@mui/material';
import "./homeAtom.css";
import Logo from "../media/logo.svg";

const modalStyle = {
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

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (passcode?.meta) {
      const object = passcode.meta.toString();
      setCode(object);
    }

    const checksRef = collection(db, 'checks');
    const unsubscribe = onSnapshot(checksRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
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
              <button className='start-here' onClick={handleModalOpen}>Start Here</button>
            </div>
          </div>
        </div>
      </CircularRevealPanel>

      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Register For One Of Our Events To Check in
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }}>
            Thank you for using our selfcheck-in terminal.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please register for one of our upcoming events to proceed with the check-in process.
          </Typography>
          <button className='no-id' onClick={handleModalClose} variant="contained" sx={{ mt: 2 }}>Close</button>
        </Box>
      </Modal>
    </>
  );
}

export default HomeAtom;
