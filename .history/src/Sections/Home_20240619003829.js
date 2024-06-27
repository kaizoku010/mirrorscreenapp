import React, { useState, useEffect } from 'react';
import HomeAtom from '../atoms/HomeAtom';
import BG_VID from "../media/bg"

function Home() {
 
    return (
        <div className='tech-background'>
  <div className='mirror-page'>
            <HomeAtom passcode={"payload"}/>
        </div>
        </div>
      
    );
}

export default Home;
