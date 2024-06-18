import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularRevealPanel } from 'react-circular-reveal';
import PrintMe from './PrintMe';
import { db, collection, onSnapshot, query, where } from '../operations/firebase';
import "./homeAtom.css";

function HomeAtom({ passcode }) {
  const [isOpened, setOpened] = useState(false);
  const [code, setCode] = useState('');
  const [checkedInIds, setCheckedInIds] = useState(new Set()); // Track checked-in IDs
  const navigate = useNavigate();

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
          // Check if the attendee ID is already checked in
          if (!checkedInIds.has(newCheck.uid)) {
            // Navigate to Valuser with new data
            navigate('/validate', { state: { data: newCheck } });
            // Update checked-in IDs
            setCheckedInIds(prevIds => new Set([...prevIds, newCheck.uid]));
          } else {
            console.log(`Attendee ${newCheck.name} with ID ${newCheck.uid} is already checked in.`);
            // Handle already checked-in feedback (optional)
          }
        }
      });
    });

    return () => unsubscribe();
  }, [passcode, navigate, checkedInIds]);

  return (
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
          <h1 className='hello-text'>Hello</h1>
          <h2 className='welcome-text'>Welcome</h2>
          <p className='please-me-text'>Please enter your passcode below to check-in</p>
          <input 
            enterKeyHint='099c41' 
            name='passcode' 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            className='input-passcode' 
          />
          <button className='submit-btn' onClick={() => setOpened(true)}>Submit</button>
        </div>
      </div>
    </CircularRevealPanel>
  );
}

export default HomeAtom;
