import React from 'react'
import { useLocation } from 'react-router-dom';


function Valuser() {

    const location = useLocation();
    const data = location.state?.data;

  return (
    <div>Valuser</div>
  )
}

export default Valuser