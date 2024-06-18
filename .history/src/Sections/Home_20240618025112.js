import React, { useState, useEffect } from 'react';
import PieSocket from 'piesocket-js';
import HomeAtom from '../atoms/HomeAtom';

function Home() {
    const [pieSocket, setPieSocket] = useState(null);
    const [payload, setPayload] = useState()

    useEffect(() => {
        const socket = new PieSocket({
            clusterId: "free.blr2",
            apiKey: "q9fvff6Hlau5M62lRApYUBOSbLfVsnhazBdX2cY0",
            endPoint: "wss://free.blr2.piesocket.com/v3/1?api_key=q9fvff6Hlau5M62lRApYUBOSbLfVsnhazBdX2cY0&notify_self=1",
            apiSecret: "MesZJ9EbLFmTuUsriHhiQVkpkhFoGevI",
            notifySelf: true,
            presence: true,
        });
        
        setPieSocket(socket);

        // Cleanup function
        return () => {
            if (pieSocket) {
                pieSocket.disconnect();
            }
        };
    }, []);

    const onPieSocketMessage = (data, meta) => {
        console.log("React Payload: ", data);

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
