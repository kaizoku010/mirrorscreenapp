import React, { useState, useEffect } from 'react';
import HomeAtom from '../atoms/HomeAtom';

function Home() {
 
    return (
        <div className='home-'>
            <HomeAtom passcode={"payload"}/>
        </div>
    );
}

export default Home;
