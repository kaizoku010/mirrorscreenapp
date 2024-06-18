import React, { useState, useEffect } from 'react';
import HomeAtom from '../atoms/HomeAtom';

function Home() {
 
    return (
        <div>
            <HomeAtom passcode={"payload"}/>
        </div>
    );
}

export default Home;
