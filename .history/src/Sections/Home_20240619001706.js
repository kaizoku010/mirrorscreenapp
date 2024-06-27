import React, { useState, useEffect } from 'react';
import HomeAtom from '../atoms/HomeAtom';

function Home() {
 
    return (
        <div>
  <div className='mirror-page'>
            <HomeAtom passcode={"payload"}/>
        </div>
        </div>
      
    );
}

export default Home;
