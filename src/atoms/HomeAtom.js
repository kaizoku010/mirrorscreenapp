import React, { useEffect, useState } from 'react'
import "./homeAtom.css"
import { CircularRevealPanel } from 'react-circular-reveal';

function HomeAtom({passcode}) {
    const [isOpened, setOpened] = useState(false);
    const [code, setCode] = useState()
    // console.log("passcode: ",passcode?.meta)
    // setCode(passcode?.meta)

    useEffect(()=>{
   console.log("passcode: ",passcode?.meta)
    const object = passcode?.meta.toString();
    console.log("passed code: ", object)

    setCode(object)
    }, [passcode])
    
    return (
        <CircularRevealPanel
        reveal={isOpened}
        revealContent={
            <div className='print-me-area revealed' onClick={() => setOpened(false)}>
                    <h1>Passded Data:{passcode?.meta} </h1>
            </div> 
        }
        >
              <div className='home-page content'>
            <div className='text-holder'>
            <h1 className='hello-text'>Hello</h1>
            <h2 className='welcome-text'>Welcome</h2>
            <p className='please-me-text'>please enter your passcode below to check-in</p>
            <input enterKeyHint='099c41' name='passcode' value={passcode?.meta} className='input-passcode'/>
            <button className='submit-btn' onClick={()=>setOpened(true)}>Submit</button>
            </div>  
            </div>
        </CircularRevealPanel>
  
  )
}

export default HomeAtom