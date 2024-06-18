import React, { useState, useEffect } from 'react';
import PieSocket from 'piesocket-js';
import HomeAtom from '../atoms/HomeAtom';

function Home() {
 
if(data!== undefined){
    setPayload(data)
    pieSocket.disconnect();
}

      
        // Handle the received data as needed
    };


  
    return (
        <div>
            <HomeAtom passcode={payload}/>
        </div>
    );
}

export default Home;
