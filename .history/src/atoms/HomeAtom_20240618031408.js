import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { CircularRevealPanel } from 'react-circular-reveal';
import PrintMe from './PrintMe';
import { db, collection, onSnapshot } from '../operations/firebase';
import "./homeAtom.css";

function HomeAtom({ passcode }) {
  const [isOpened, setOpened] = useState(false);
  const [code, setCode] = useState('');
  const history = useNavigate(); // Use history for navigation

  useEffect(() => {
    if (passcode?.meta) {
      const object = passcode.meta.toString();
      setCode(object);
    }

    // Set up Firestore listener
    const checksRef = collection(db, 'checks');
    const unsubscribe = onSnapshot(checksRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newCheck = change.doc.data();
          console.log('New check-in data: ', newCheck);
          // Navigate to a new page with the new data
          history('/validate', { data: newCheck }); // Adjust the path as per your routing setup
          // Or you can update the state to show the new data
          // setOpened(true);
        }
      });
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [passcode, history]);

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
          <p className='please-me-text'>please enter your passcode below to check-in</p>
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
