import React from 'react';
import HomeAtom from '../atoms/HomeAtom';
import BG_VID from "../media/bg.mp4";
import './Home.css';

function Home() {
  return (
    <div className='tech-background'>
      <div className='video-container'>
        <video autoPlay loop muted className='bg-video'>
          <source src={BG_VID} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className='mirror-page'>
        <HomeAtom passcode={"payload"} />
      </div>
    </div>
  );
}

export default Home;
