import React, { useRef, useState, useEffect } from 'react';
import './printMe.css'; // Your main component styles
import TicketTemplate from "../temps/TicketTemplate"

function PrintMe({ payload }) {
  const printRef = useRef();
  const [capturedImage, setCapturedImage] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef();

  useEffect(() => {
    startVideoStream();

    return () => {
      stopVideoStream();
    };
  }, []);

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to start video stream: ', error);
    }
  };

  const stopVideoStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  const handleCapture = async () => {
    try {
      if (!videoStream) {
        console.error('Video stream is not available.');
        return;
      }

      const track = videoStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const photoBlob = await imageCapture.takePhoto();
      const imageData = URL.createObjectURL(photoBlob);
      setCapturedImage(imageData);

      // Hide the video after capturing the image
      if (videoRef.current) {
        videoRef.current.pause(); // Pause the video
        videoRef.current.srcObject = null; // Remove the video source
      }
    } catch (error) {
      console.error('Failed to capture image from camera: ', error);
    }
  };

  const handleRetake = () => {
    // Clear the captured image and restart the video stream
    setCapturedImage(null);
    startVideoStream();
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div>
      <div>
        <button onClick={handlePrint}>Print Ticket</button>
        <div ref={printRef}>
          <TicketTemplate payload={"Hello World"} />
          {capturedImage && <img src={capturedImage} alt="Captured" />}
        </div>
        </div>
    </div>
  );
}

export default PrintMe;
