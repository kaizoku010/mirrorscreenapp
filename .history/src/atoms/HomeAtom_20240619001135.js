import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularRevealPanel } from 'react-circular-reveal';
import PrintMe from './PrintMe';
import { db, collection, onSnapshot } from '../operations/firebase';
import "./homeAtom.css";
import Logo from "../media/logo.svg"

function HomeAtom({ passcode }) {
  const [isOpened, setOpened] = useState(false);
  const [code, setCode] = useState('');
  const [checkedInIds, setCheckedInIds] = useState(new Set());
  const navigate = useNavigate();

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
          <div className='logo-holder'> 
<img className='skip' src={Logo}/>
          </div>
          <div className='text-holder_'>
          <h1 className='hello-text'>Hello</h1>
          <h2 className='welcome-text'>Welcome To Our Tech Launch</h2>
          <p className='please-me-text'>Please Wait As Your Ticket Is Validated, We Shall Check You In shortly</p>

          </div>

   </div>
      </div>
    </CircularRevealPanel>
  );
}

export default HomeAtom;
