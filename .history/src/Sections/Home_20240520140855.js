import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import PieSocket from 'piesocket-js';

const PieSocks = () => {
  const [pieData, setPieData] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [pieSocket, setPieSocket] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const connectPieSocket = () => {
      console.log("Attempting to connect to PieSocket...");
      const socket = new PieSocket({
        clusterId: "free.blr2",
        apiKey: "q9fvff6Hlau5M62lRApYUBOSbLfVsnhazBdX2cY0",
        endPoint: "wss://free.blr2.piesocket.com/v3/1?api_key=q9fvff6Hlau5M62lRApYUBOSbLfVsnhazBdX2cY0&notify_self=1",
        apiSecret: "MesZJ9EbLFmTuUsriHhiQVkpkhFoGevI",
        notifySelf: true,
        presence: true,
      });

      socket.on("error", (error) => {
        console.error("WebSocket error: ", error);
      });

      socket.on("close", (reason) => {
        console.error("WebSocket closed: ", reason);
      });

      socket.subscribe("test-room").then((channel) => {
        console.log("Channel is ready");

        channel.listen("new_payload", (data, meta) => {
          console.log("New payload received", data, meta);
          setPieData(data);
        });

        channel.publish("new_payload", {
          from: "React Native",
          message: "Hello Data From React Native!",
          meta: "8111"
        }).catch((error) => {
          console.error("Publish error: ", error);
        });
      }).catch((error) => {
        console.error("Subscription error: ", error);
        setTimeout(connectPieSocket, 5000); // Retry after 5 seconds
      });

      setPieSocket(socket);
    };

    if (cameraPermission === 'granted') {
      connectPieSocket();
    }
  }, [cameraPermission]);

  const toggleCameraType = () => {
    setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
  };

  if (cameraPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }

  if (cameraPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text>Socket</Text>
      {pieData && <Text>Data: {pieData.message}</Text>}
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default PieSocks;
